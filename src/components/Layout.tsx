import React, { ReactNode } from 'react';

type PageShellProps = {
  children: ReactNode;
};

export const PageShell: React.FC<PageShellProps> = ({ children }) => (
  <div className="min-h-screen bg-[#f4f6ff] flex items-center justify-center px-4 py-8 sm:py-10 md:py-12">
    <div className="w-full max-w-4xl">{children}</div>
  </div>
);


