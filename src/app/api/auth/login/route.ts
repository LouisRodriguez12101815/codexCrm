import { setSession } from '@/lib/auth';
import { redirectTo } from '@/lib/redirect';

export async function POST(req: Request) {
  const formData = await req.formData();

  if (formData.get('email') === process.env.DEMO_EMAIL && formData.get('password') === process.env.DEMO_PASSWORD) {
    await setSession();
    return redirectTo(req, '/leads');
  }

  return redirectTo(req, '/?error=login');
}
