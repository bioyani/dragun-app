import { redirect } from 'next/navigation';

export default function LocalizedAuthCodeErrorPage() {
  redirect('/auth/auth-code-error');
}
