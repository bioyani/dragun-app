import { useTranslations } from 'next-intl';
import { Sparkles, Send, Mail, User, Tag, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <main className="bg-background text-foreground">
      <section className="hero-glow border-b border-border">
        <div className="section-shell section-gap">
          <div className="max-w-5xl space-y-7">
            <Badge><Sparkles className="h-3.5 w-3.5" /> Direct channel</Badge>
            <h1 className="text-4xl font-semibold tracking-tightest sm:text-6xl">
              {t('title')} <span className="text-muted-foreground">{t('titleHighlight')}</span>
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-shell section-gap">
          <Card className="mx-auto max-w-4xl shadow-md">
            <CardContent className="p-8 sm:p-10">
              <form className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      {t('fullName')}
                    </label>
                    <Input type="text" placeholder={t('fullNamePlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {t('emailAddress')}
                    </label>
                    <Input type="email" placeholder={t('emailPlaceholder')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    {t('subject')}
                  </label>
                  <select className="focus-ring h-12 w-full rounded-md border border-input bg-background px-4 text-sm text-foreground">
                    <option>{t('subjectGeneral')}</option>
                    <option>{t('subjectSales')}</option>
                    <option>{t('subjectSupport')}</option>
                    <option>{t('subjectPartnerships')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {t('message')}
                  </label>
                  <textarea
                    rows={6}
                    placeholder={t('messagePlaceholder')}
                    className="focus-ring w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <Button fullWidth className="uppercase tracking-[0.14em]">
                  {t('sendMessage')}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
