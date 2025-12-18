import React from 'react';

type SiteHeaderProps = {
  title: string;
  subtitle?: string;
};

export const SiteHeader: React.FC<SiteHeaderProps> = ({ title, subtitle }) => (
  <header className="space-y-3 text-center sm:space-y-4">
    <div className="flex justify-center">
      <img src="/logo.png" alt="logo" className="w-[148px] h-[48px]" style={{ width: '148px', height: '48px' }} />
    </div>
    <h1 className="text-[26px] font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl pt-4">
      {title}
    </h1>
    {subtitle && (
      <p className="text-gray-600 mt-3 text-sm md:text-base max-w-xl mx-auto">
        {subtitle}
      </p>
    )}
  </header>
);


