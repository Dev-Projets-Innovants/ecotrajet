
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  // Update document title if provided
  React.useEffect(() => {
    if (title) {
      document.title = `${title} | ÉcoTrajet`;
    }
  }, [title]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 pt-16">
        {children}
      </div>
      <Footer />
    </div>
  );
};
