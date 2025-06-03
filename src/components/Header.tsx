import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Upload, FileText, Scale, Menu, X } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, { open, close }] = useDisclosure(false);

  const navItems = [
    { path: '/', label: 'Hem', icon: Home },
    { path: '/upload', label: 'Ladda upp', icon: Upload },
    { path: '/analyze', label: 'Analysera', icon: FileText },
    { path: '/juridisk-analys', label: 'AI-Analys', icon: Scale },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <header className="bg-white shadow-sm border-b border-juridika-lightgray sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Title Section */}
        <div className="flex items-center space-x-2">
          <img
            src="/juridika-logo.svg"
            alt="Juridika Logo"
            className="h-8 w-auto"
          />
          <h1 className="text-xl font-semibold text-juridika-charcoal">
            Juridika
          </h1>
        </div>
      
      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-juridika-softgold text-juridika-charcoal font-medium'
                  : 'text-juridika-gray hover:text-juridika-charcoal hover:bg-juridika-cream'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

        {/* Mobile Navigation Button */}
        <button
          onClick={open}
          className="md:hidden text-juridika-charcoal focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Mobile Navigation Overlay */}
        {opened && (
          <div className="fixed top-0 left-0 w-full h-full bg-white z-50 p-4 md:hidden">
            {/* Close Button */}
            <div className="flex justify-end">
              <button onClick={close} className="text-juridika-charcoal focus:outline-none">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Nav Items */}
            <nav className="flex flex-col items-start space-y-4 mt-8">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors w-full ${
                      isActive
                        ? 'bg-juridika-softgold text-juridika-charcoal font-medium'
                        : 'text-juridika-gray hover:text-juridika-charcoal hover:bg-juridika-cream'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
