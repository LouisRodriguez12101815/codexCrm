import { clearSession } from '@/lib/auth';
import { redirectTo } from '@/lib/redirect';

export async function POST(req: Request) {
  await clearSession();
  return redirectTo(req, '/');
}
