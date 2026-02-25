import { useTranslations } from 'next-intl';
import { Sparkles, Send, Mail, User, Tag, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <main className="relative isolate min-h-screen text-white overflow-hidden selection:bg-[#D4AF37] selection:text-black bg-[#0b1b2b]">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2fbf9a]/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-40 flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-xl text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mb-12">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          Direct Channel
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] leading-none mb-8 text-white uppercase text-center">
          {t('title')} <span className="italic font-serif tracking-tight lowercase text-[#D4AF37]">{t('titleHighlight')}</span>
        </h1>
        
        <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-24 font-medium tracking-tight text-center">
          {t('subtitle')}
        </p>

        <div className="w-full max-w-4xl group relative rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-1 overflow-hidden transition-all hover:border-white/10 shadow-2xl">
           <div className="bg-white/[0.02] rounded-[2.8rem] p-10 md:p-16 h-full flex flex-col space-y-12">
              <form className="space-y-12">
                 <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black flex items-center gap-2">
                          <User className="w-3 h-3 text-[#D4AF37]" />
                          {t('fullName')}
                       </label>
                       <input 
                          type="text" 
                          placeholder={t('fullNamePlaceholder')} 
                          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:border-[#D4AF37]/50 focus:outline-none transition-all placeholder:text-white/5"
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black flex items-center gap-2">
                          <Mail className="w-3 h-3 text-[#D4AF37]" />
                          {t('emailAddress')}
                       </label>
                       <input 
                          type="email" 
                          placeholder={t('emailPlaceholder')} 
                          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:border-[#D4AF37]/50 focus:outline-none transition-all placeholder:text-white/5"
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black flex items-center gap-2">
                       <Tag className="w-3 h-3 text-[#D4AF37]" />
                       {t('subject')}
                    </label>
                    <select className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:border-[#D4AF37]/50 focus:outline-none transition-all appearance-none cursor-pointer">
                       <option className="bg-[#050505]">{t('subjectGeneral')}</option>
                       <option className="bg-[#050505]">{t('subjectSales')}</option>
                       <option className="bg-[#050505]">{t('subjectSupport')}</option>
                       <option className="bg-[#050505]">{t('subjectPartnerships')}</option>
                    </select>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black flex items-center gap-2">
                       <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                       {t('message')}
                    </label>
                    <textarea 
                       rows={6}
                       placeholder={t('messagePlaceholder')} 
                       className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:border-[#D4AF37]/50 focus:outline-none transition-all placeholder:text-white/5"
                    />
                 </div>

                 <button className="h-20 w-full rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#D4AF37] transition-all active:scale-95 shadow-2xl group/btn">
                    {t('sendMessage')}
                    <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                 </button>
              </form>
           </div>
        </div>
      </div>
    </main>
  );
}
