interface PasswordAuthClient {
  auth: {
    setSession(tokens: { access_token: string; refresh_token: string }): Promise<{ error: unknown }>;
    getUser(): Promise<{ data: { user: unknown }; error: unknown }>;
  };
}

function invalidLink() {
  return new Error('This setup or recovery link is invalid or expired. Request a new link to continue.');
}

/** Consume default implicit email links before the PKCE browser client sees their fragment. */
export async function verifyPasswordSetupSession(
  createClient: () => PasswordAuthClient,
  currentUrl: string,
  replaceUrl: (url: string) => void,
): Promise<void> {
  try {
    const url = new URL(currentUrl);
    const fragment = url.hash.slice(1);
    let tokens: { access_token: string; refresh_token: string } | null = null;
    if (fragment) {
      // Clear tokens synchronously before creating the SDK client or performing any requests.
      url.hash = '';
      replaceUrl(url.pathname + url.search);
      const params = new URLSearchParams(fragment);
      const type = params.get('type');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (
        params.has('error') || params.has('error_code') ||
        !['invite', 'recovery'].includes(type || '') ||
        ['type', 'access_token', 'refresh_token', 'token_type'].some(key => params.getAll(key).length > 1) ||
        !accessToken || accessToken.length > 16384 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(accessToken) ||
        !refreshToken || !/^[A-Za-z0-9_-]{8,4096}$/.test(refreshToken) ||
        (params.has('token_type') && params.get('token_type')?.toLowerCase() !== 'bearer')
      ) throw invalidLink();
      tokens = { access_token: accessToken, refresh_token: refreshToken };
    }
    if (url.searchParams.has('error') || url.searchParams.has('error_code')) throw invalidLink();
    const client = createClient();
    if (tokens) {
      const { error } = await client.auth.setSession(tokens);
      if (error) throw invalidLink();
    }
    // getUser validates identity with Supabase Auth; decoded fragment claims are never trusted.
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) throw invalidLink();
  } catch {
    // Provider exceptions can include sensitive inputs. Expose only a fixed public message.
    throw invalidLink();
  }
}
