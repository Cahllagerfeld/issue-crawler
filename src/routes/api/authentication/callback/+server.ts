import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import fetch from 'node-fetch';
import cookie from 'cookie';

const tokenURL = 'https://github.com/login/oauth/access_token';
const userURL = 'https://api.github.com/user';

const clientId = env.GITHUB_CLIENT_ID;
const secret = env.GITHUB_CLIENT_SECRET;

export const GET: RequestHandler = async ({ url, request }) => {
  const code = url.searchParams.get('code') as string;
  const state = url.searchParams.get('state') as string;

  const token = await getAccessToken(code);
  const user = await getUser(token);

  const csrfToken = cookie.parse(request.headers.get('cookie') || '').state || '';

  if (state !== csrfToken) {
    throw error(403, 'CSRF Token not matching');
  }

  const tokenCookie = cookie.serialize('access_token', token, { httpOnly: true, path: '/' });
  const userCookie = cookie.serialize('user', user.login || '', { httpOnly: true, path: '/' });

  const headers = new Headers();
  headers.append('location', '/');
  headers.append('set-cookie', tokenCookie);
  headers.append('set-cookie', userCookie);

  return new Response(null, {
    status: 302,
    headers,
  });
};

async function getAccessToken(code: string) {
  const r = await fetch(tokenURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: secret,
      code,
    }),
  });
  const r_1 = (await r.json()) as {
    access_token: string;
    token_type: string;
    scope: string;
  };
  return r_1.access_token;
}

async function getUser(accessToken: string) {
  const r = await fetch(userURL, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return r.json();
}
