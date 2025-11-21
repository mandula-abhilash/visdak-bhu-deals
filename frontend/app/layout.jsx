import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import { Inter, Lato } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato',
});

export const metadata = {
  title: 'BhuDeals - Premium Land Marketplace',
  description: 'Browse premium agricultural and commercial properties with detailed maps and measurements',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${lato.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-slate-900 text-white py-12">
            <div className="container mx-auto px-6 text-center">
              <p className="text-slate-400">&copy; 2024 BhuDeals. All rights reserved.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
