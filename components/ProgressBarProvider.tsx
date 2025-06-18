'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import NavBar from "@/components/common/NavBar";


const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      
      <ProgressBar/>
      <NavBar/>
      {children}
    </>
  );
};

export default Providers;