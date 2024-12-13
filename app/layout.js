import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import './globals.css';
import { NextAuthProvider } from '@/components/providers/NextAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Get Me A Chai',
  description: 'Support your favorite creators with a virtual cup of chai!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-100 py-4 text-center">
              <p>&copy; 2024 Get Me A Chai. All rights reserved.</p>
            </footer>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
