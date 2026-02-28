import { getTranslations } from 'next-intl/server';
import { getCommsChannelStatus } from '@/lib/comms/config';
import { MessageSquare } from 'lucide-react';

interface Props {
  locale: string;
}

/** Renders when no comms channel is configured, so merchants know to set email or SMS. */
export default async function CommsChannelsAlert({ locale }: Props) {
  const status = getCommsChannelStatus();
  if (status.email || status.sms) return null;

  const t = await getTranslations('Dashboard');
  return (
    <div className="alert shadow-warm border-warning/30 bg-warning/5">
      <MessageSquare className="h-5 w-5 shrink-0 text-warning" />
      <div>
        <p className="font-semibold">{t('commsChannelsNotConfigured')}</p>
        <p className="text-sm opacity-80">{t('commsChannelsHint')}</p>
      </div>
      <a
        href={`/${locale}/integrations`}
        className="btn btn-ghost btn-sm min-h-10"
      >
        {t('commsViewIntegrations')}
      </a>
    </div>
  );
}
