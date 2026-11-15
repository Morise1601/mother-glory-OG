import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database.types';
import { AuthError, getStaffActor } from '@/lib/auth/server';
import { adminPagePermission, canAccessAdminPage } from '@/lib/auth/access';
import { enquiryAccessPermission } from '@/lib/auth/enquiry-access';

const publicAdminPaths = new Set(['/admin', '/admin/forgot-password', '/admin/reset-password']);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';
  const isPublic = publicAdminPaths.has(pathname) || pathname === '/auth/callback';
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  function failure(error: unknown) {
    const target = new URL('/admin', request.url);
    target.searchParams.set('error', error instanceof AuthError && error.status === 401 ? 'session_required' : 'access_denied');
    const redirect = NextResponse.redirect(target);
    response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie));
    redirect.headers.set('Cache-Control', 'private, no-store');
    return redirect;
  }

  if (!url || !key) return isPublic ? response : failure(new AuthError('Sign-in is not configured.', 503));
  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies) {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  try {
    if (isPublic) {
      await supabase.auth.getUser();
      return response;
    }
    const actor = await getStaffActor(supabase);
    if (!canAccessAdminPage(actor, pathname)) throw new AuthError('Access denied.', 403);
    const permission = pathname === '/admin/enquiries' ? enquiryAccessPermission(actor, 'read') : adminPagePermission(pathname);
    if (permission) {
      const { data, error } = await supabase.rpc('has_permission', { p_permission_key: permission });
      if (error || data !== true) throw new AuthError('Access denied.', 403);
    }
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  } catch (error) {
    return isPublic ? response : failure(error);
  }
}

export const config = { matcher: ['/admin/:path*', '/auth/callback'] };
