import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AutoOS | Next-Gen Vehicle Service Center Management System',
  description:
    'Autonomous enterprise workshop operating system featuring Edge AI Gate Scanner, Voice-to-Job ambient assistant, constraint bay optimizer, IoT bulk fluid dispensing, and EV battery health passports.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080b11] text-slate-100 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
