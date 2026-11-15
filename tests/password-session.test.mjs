import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './module-loader.mjs';

const accessToken = 'header.payload.signature';
const refreshToken = 'opaque-refresh-token';

function fixture({ sessionError = null, userError = null, user = { id: 'verified-user' } } = {}) {
  const events = [];
  const client = { auth: {
    setSession: async tokens => { events.push({ action: 'setSession', tokens }); return { error: sessionError }; },
    getUser: async () => { events.push({ action: 'getUser' }); return { data: { user }, error: userError }; },
  } };
  return { events, factory: () => { events.push({ action: 'createClient' }); return client; }, replaceUrl: url => events.push({ action: 'replaceUrl', url }) };
}

test('default invite fragments are removed before SDK initialization and explicitly exchanged for a verified session', async () => {
  const { verifyPasswordSetupSession } = loadTs('lib/auth/password-session.ts');
  const state = fixture();
  await verifyPasswordSetupSession(state.factory, `https://school.example/admin/reset-password#access_token=${accessToken}&refresh_token=${refreshToken}&type=invite&token_type=bearer`, state.replaceUrl);
  assert.deepEqual(state.events, [
    { action: 'replaceUrl', url: '/admin/reset-password' },
    { action: 'createClient' },
    { action: 'setSession', tokens: { access_token: accessToken, refresh_token: refreshToken } },
    { action: 'getUser' },
  ]);
});

test('recovery fragments use the same verified session flow while PKCE and OTP sessions remain supported', async () => {
  const { verifyPasswordSetupSession } = loadTs('lib/auth/password-session.ts');
  const recovery = fixture();
  await verifyPasswordSetupSession(recovery.factory, `https://school.example/admin/reset-password#access_token=${accessToken}&refresh_token=${refreshToken}&type=recovery`, recovery.replaceUrl);
  assert.equal(recovery.events[2].action, 'setSession');
  for (const suffix of ['', '?code=pkce-code']) {
    const existing = fixture();
    await verifyPasswordSetupSession(existing.factory, `https://school.example/admin/reset-password${suffix}`, existing.replaceUrl);
    assert.deepEqual(existing.events.map(event => event.action), ['createClient', 'getUser']);
  }
});

test('partial, duplicate, malformed, or unrelated token fragments are cleared and rejected before changing the session', async () => {
  const { verifyPasswordSetupSession } = loadTs('lib/auth/password-session.ts');
  const fragments = [
    `access_token=${accessToken}&type=invite`,
    `refresh_token=${refreshToken}&type=recovery`,
    `access_token=${accessToken}&refresh_token=${refreshToken}&type=signup`,
    `access_token=${accessToken}&access_token=another&refresh_token=${refreshToken}&type=invite`,
    `access_token=${accessToken}&refresh_token=${refreshToken}&type=invite&type=recovery`,
    `access_token=not-a-jwt&refresh_token=${refreshToken}&type=invite`,
    `access_token=${accessToken}&refresh_token=%20%20&type=recovery`,
    `access_token=${accessToken}&refresh_token=${refreshToken}&type=invite&token_type=other`,
    'error=access_denied&error_description=expired',
  ];
  for (const fragment of fragments) {
    const state = fixture();
    await assert.rejects(verifyPasswordSetupSession(state.factory, `https://school.example/admin/reset-password#${fragment}`, state.replaceUrl), /invalid or expired/i);
    assert.deepEqual(state.events, [{ action: 'replaceUrl', url: '/admin/reset-password' }]);
  }
});

test('token exchange and user-verification failures cannot fall back to an existing unverified session or expose provider errors', async () => {
  const { verifyPasswordSetupSession } = loadTs('lib/auth/password-session.ts');
  const exchange = fixture({ sessionError: { message: 'secret-provider-token' } });
  await assert.rejects(verifyPasswordSetupSession(exchange.factory, `https://school.example/admin/reset-password#access_token=${accessToken}&refresh_token=${refreshToken}&type=invite`, exchange.replaceUrl), error => !error.message.includes('secret-provider-token') && /invalid or expired/i.test(error.message));
  assert.equal(exchange.events.some(event => event.action === 'getUser'), false);
  const noUser = fixture({ user: null });
  await assert.rejects(verifyPasswordSetupSession(noUser.factory, 'https://school.example/admin/reset-password', noUser.replaceUrl), /invalid or expired/i);
});

test('password reset page consumes its email fragment once across repeated effect setup and cleanup', async () => {
  const effects = [];
  const states = [];
  const state = fixture();
  const originalWindow = globalThis.window;
  const originalUrl = `https://school.example/admin/reset-password#access_token=${accessToken}&refresh_token=${refreshToken}&type=invite`;
  globalThis.window = {
    location: { href: originalUrl },
    history: { state: null, replaceState: (_state, _title, url) => { state.replaceUrl(url); globalThis.window.location.href = new URL(url, originalUrl).href; } },
  };
  try {
    const { default: ResetPasswordPage } = loadTs('app/admin/reset-password/page.tsx', {
      react: {
        useState: initial => { const index = states.length; states.push(initial); return [initial, value => { states[index] = value; }]; },
        useRef: value => ({ current: value }),
        useEffect: effect => effects.push(effect),
      },
      'next/navigation': { useRouter: () => ({ replace() {}, refresh() {} }) },
      'next/image': { default: () => null },
      'next/link': { default: () => null },
      '@/lib/supabase/client': { createBrowserClient: state.factory },
    });
    ResetPasswordPage();
    const cleanup = effects[0]();
    cleanup();
    effects[0]();
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(state.events.map(event => event.action), ['replaceUrl', 'createClient', 'setSession', 'getUser']);
    assert.equal(states[6], true);
    assert.equal(states[7], false);
    assert.equal(globalThis.window.location.href.includes('#'), false);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});
