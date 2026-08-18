import { createHmac, timingSafeEqual } from 'crypto';

type Env = {
  ADMIN_PASSWORD: string;
};

const TOKEN_LIFETIME = 60 * 60 * 8; // 8 hours

function createAdminToken(secret: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_LIFETIME;

  const payload = `admin:${expiresAt}`;

  const signature = createHmac('sha256', secret).update(payload).digest('hex');

  return `${payload}:${signature}`;
}

function verifyPassword(supplied: string, expected: string): boolean {
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);

  if (suppliedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const password = body?.password;

    if (typeof password !== 'string') {
      return Response.json({ error: 'Password is required.' }, { status: 400 });
    }

    /*
     * Next.js route handlers don't automatically
     * expose Cloudflare bindings. For now, this
     * endpoint is a placeholder for the Cloudflare
     * Worker authentication layer.
     */
    const env = process.env as unknown as Env;

    const adminPassword = env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return Response.json(
        {
          error: 'ADMIN_PASSWORD is not configured.',
        },
        { status: 500 }
      );
    }

    if (!verifyPassword(password, adminPassword)) {
      return Response.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    const token = createAdminToken(adminPassword);

    return Response.json({
      success: true,
      token,
    });
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
