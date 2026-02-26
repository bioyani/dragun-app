'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Rocket,
  CheckCircle2,
  Plus
} from 'lucide-react';

export default function OnboardingPage() {
  const t = useTranslations('Onboarding');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [strictness, setStrictness] = useState(5);
  const [settlement, setSettlement] = useState(80);
  const [file, setFile] = useState<File | null>(null);

  const totalSteps = 4;

  const handleNext = () => step < totalSteps && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  async function handleFinish() {
    setLoading(true);
    try {
      // 1. Ensure merchant exists first (crucial if no file is uploaded)
      const { completeOnboarding } = await import('@/app/actions/merchant-settings');
      const { uploadContract } = await import('@/app/actions/upload-contract');

      // 2. Upload contract if exists
      if (file) {
        const formData = new FormData();
        formData.append('contract', file);
        const uploadResult = await uploadContract(formData);
        if (!uploadResult.success) throw new Error(uploadResult.error || 'Upload failed');
      }

      // 3. Complete onboarding profile
      const onboardingResult = await completeOnboarding({
        name,
        strictness_level: strictness,
        settlement_floor: settlement / 100
      });
      
      if (!onboardingResult.success) throw new Error(onboardingResult.error || 'Onboarding update failed');

      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding failed:', error);
      const message = error instanceof Error ? error.message : 'Setup failed';
      alert(`${message}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
            {t('title')} <span className="text-foreground">DRAGUN.</span>
          </h1>
          <p className="text-foreground/40 text-sm font-medium tracking-tight">
            {t('subtitle')}
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="flex justify-between items-center mb-12 relative">
           <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-card/80 w-full -z-10" />
           <div 
             className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary transition-all duration-500 -z-10" 
             style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
           />
           
           {[1, 2, 3, 4].map((s) => (
             <div 
               key={s}
               className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                 s <= step ? 'bg-primary border-border text-primary-foreground' : 'bg-card border-border text-muted-foreground'
               }`}
             >
               {s < step ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-black">{s}</span>}
             </div>
           ))}
        </div>

        {/* Form Container */}
        <div className="bg-card backdrop-blur-3xl border border-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col">
          
          {/* Step 1: Business Profile */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-card/80 rounded-2xl flex items-center justify-center text-foreground">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-widest">{t('step1')}</h2>
                  <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">{t('step1Desc')}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 font-bold ml-1">
                  {t('businessName')}
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('businessNamePlaceholder')}
                  className="w-full bg-card border border-border rounded-2xl py-5 px-6 outline-none focus:border-ring transition-all font-bold text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Policy */}
          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-card/80 rounded-2xl flex items-center justify-center text-foreground">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-widest">{t('step2')}</h2>
                  <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">{t('step2Desc')}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 font-bold">Strictness Profile</label>
                    <span className="text-2xl font-black text-foreground">{strictness}<span className="text-xs opacity-20 ml-1">/10</span></span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="10" 
                    value={strictness} 
                    onChange={(e) => setStrictness(parseInt(e.target.value))}
                    className="range range-xs appearance-none bg-card/80 h-1.5 rounded-full accent-white cursor-pointer" 
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 font-bold">Settlement Floor</label>
                    <span className="text-2xl font-black text-foreground">{settlement}<span className="text-xs opacity-20 ml-1">%</span></span>
                  </div>
                  <input 
                    type="range" 
                    min="50" max="100" 
                    value={settlement} 
                    onChange={(e) => setSettlement(parseInt(e.target.value))}
                    className="range range-xs appearance-none bg-card/80 h-1.5 rounded-full accent-white cursor-pointer" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Document Upload */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-card/80 rounded-2xl flex items-center justify-center text-blue-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-widest">{t('step3')}</h2>
                  <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">{t('step3Desc')}</p>
                </div>
              </div>

              <div className="relative group">
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden" id="onboarding-upload" 
                />
                <label 
                  htmlFor="onboarding-upload" 
                  className={`w-full h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${
                    file ? 'border-success bg-success/10' : 'border-border hover:border-ring hover:bg-card/80'
                  }`}
                >
                  {file ? (
                    <>
                      <CheckCircle2 className="w-10 h-10 text-success" />
                      <span className="text-xs font-black uppercase tracking-widest text-foreground">{file.name}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-10 h-10 text-foreground/20 group-hover:text-foreground" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{t('uploadDesc')}</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Rocket */}
          {step === 4 && (
            <div className="text-center space-y-8 py-8 animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-card border border-border rounded-[2.5rem] flex items-center justify-center text-foreground shadow-2xl mx-auto relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:blur-3xl transition-all" />
                  <Rocket className="w-10 h-10 relative z-10" />
               </div>
               <div className="space-y-2">
                 <h2 className="text-3xl font-black uppercase tracking-tight">{t('finishTitle')}</h2>
                 <p className="text-foreground/40 text-sm font-medium max-w-sm mx-auto">{t('finishDesc')}</p>
               </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-auto pt-10 flex gap-4">
            {step > 1 && (
              <button 
                onClick={handleBack}
                disabled={loading}
                className="flex-1 border border-border text-muted-foreground hover:text-foreground hover:border-ring font-black text-[10px] py-5 rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {t('back')}
              </button>
            )}
            
            {step < totalSteps ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 && !name}
                className="flex-[2] bg-white text-primary-foreground hover:bg-primary font-black text-[10px] py-5 rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-20"
              >
                {t('next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                disabled={loading}
                className="flex-[2] bg-primary text-primary-foreground hover:bg-white font-black text-[10px] py-5 rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {loading ? <span className="loading loading-spinner loading-xs" /> : (
                  <>
                    {t('complete')}
                    <Rocket className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
