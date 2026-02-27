type LogoProps = {
  className?: string;
};

export default function Logo({ className = 'h-8 w-auto' }: LogoProps) {
  return (
    <div className={`${className} flex items-center gap-2.5`}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-content" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5L19 12L12 19L5 12Z" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
        <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-base-100 bg-success" />
      </div>
      <span className="text-lg font-bold tracking-tight leading-none">
        dragun<span className="text-base-content/30">.app</span>
      </span>
    </div>
  );
}
