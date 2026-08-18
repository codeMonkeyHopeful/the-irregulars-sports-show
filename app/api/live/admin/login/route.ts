import { getCloudflareContext } from '@opennextjs/cloudflare';

const TOKEN_LIFETIME = 60 * 60 * 8; // 8 hours

type LoginBody = {
  password?: unknown;
};

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function createSignature(
  secret: string,
  payload: string
): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload)
  );

  return bytesToHex(new Uint8Array(signature));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;

    if (!body || typeof body.password !== 'string') {
      return Response.json(
        {
          error: 'Password is required.',
        },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext({
      async: true,
    });

    const adminPassword = env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD is not configured.');

      return Response.json(
        {
          error: 'Server configuration error.',
        },
        { status: 500 }
      );
    }

    if (body.password !== adminPassword) {
      return Response.json(
        {
          error: 'Incorrect password.',
        },
        { status: 401 }
      );
    }

    const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_LIFETIME;

    const payload = `admin:${expiresAt}`;

    const signature = await createSignature(adminPassword, payload);

    const token = `${payload}:${signature}`;

    return Response.json({
      success: true,
      token,
      expiresAt,
    });
  } catch (error) {
    console.error('Admin login error:', error);

    return Response.json(
      {
        error: 'Invalid request.',
      },
      { status: 400 }
    );
  }
}
