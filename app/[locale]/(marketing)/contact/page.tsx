import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <main className="max-w-3xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
        </h1>
        <p className="text-lg text-base-content/60">
          {t('subtitle')}
        </p>
      </div>

      <div className="card bg-base-200/50 border border-base-300 p-8 shadow-2xl">
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label"><span className="label-text text-base-content/60">{t('fullName')}</span></label>
              <input type="text" placeholder={t('fullNamePlaceholder')} className="input input-bordered bg-base-300 border-base-300" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-base-content/60">{t('emailAddress')}</span></label>
              <input type="email" placeholder={t('emailPlaceholder')} className="input input-bordered bg-base-300 border-base-300" />
            </div>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-base-content/60">{t('subject')}</span></label>
            <select className="select select-bordered bg-base-300 border-base-300">
              <option>{t('subjectGeneral')}</option>
              <option>{t('subjectSales')}</option>
              <option>{t('subjectSupport')}</option>
              <option>{t('subjectPartnerships')}</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-base-content/60">{t('message')}</span></label>
            <textarea className="textarea textarea-bordered h-32 bg-base-300 border-base-300" placeholder={t('messagePlaceholder')}></textarea>
          </div>
          <button className="btn btn-primary btn-block rounded-xl">{t('sendMessage')}</button>
        </form>
      </div>
    </main>
  );
}
