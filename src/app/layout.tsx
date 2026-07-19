import type { ReactNode } from 'react';
import './style.css';
export const metadata={title:'CodexCRM',description:'AWS-owned SDR CRM'};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>}
