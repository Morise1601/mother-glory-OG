import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') || '/admin/dashboard';

  // Open redirect protection: Ensure next is a relative URL or matches origin
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/admin/dashboard';

  if (code || (tokenHash && (type === 'invite' || type === 'recovery'))) {
    try {
      const supabase = await createClient();
      const { error } = code
        ? await supabase.auth.exchangeCodeForSession(code, { flowId: searchParams.get('sb_flow_id') || undefined })
        : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: type as 'invite' | 'recovery' });
      if (!error) {
        const response = NextResponse.redirect(`${origin}${type === 'invite' || type === 'recovery' ? '/admin/reset-password' : safeNext}`);
        response.headers.set('Cache-Control', 'private, no-store');
        response.headers.set('Referrer-Policy', 'no-referrer');
        return response;
      }
    } catch {
      // ignore
    }
  }

  // Return user to admin login with error indicator if exchange fails
  return NextResponse.redirect(`${origin}/admin?error=auth_exchange_failed`);
}

