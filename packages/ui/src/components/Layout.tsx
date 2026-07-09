import React from 'react';
import Header from './Header';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50 text-gray-900">
    <Header />
    <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
  </div>
);

export default Layout;
