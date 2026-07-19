import { NextResponse } from 'next/server';

function baseUrlFromRequest(req: Request) {
  const configuredBaseUrl = process.env.APP_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  const host = req.headers.get('host') ?? new URL(req.url).host;
  const forwardedProto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const protocol = forwardedProto || new URL(req.url).protocol.replace(':', '') || 'http';

  return `${protocol}://${host}`;
}

export function redirectTo(req: Request, path: string) {
  return NextResponse.redirect(new URL(path, baseUrlFromRequest(req)));
}
