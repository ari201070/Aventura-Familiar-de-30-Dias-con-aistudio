import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { useAppContext } from './hooks/useAppContext';
import HomePage from './pages/HomePage';
import CityDetailPage from './pages/CityDetailPage';
import TopBar from './components/TopBar';
import Footer from './components/Footer';

const AppContent: React.FC = () => {
  const { language } = useAppContext();

  useEffect(() => {
    // Update document direction and language for RTL support
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        language === 'he' 
          ? 'מסלול אינטראקטיבי לטיול משפחתי של 30 יום בארגנטינה עם מפות, ממיר מטבעות ופונקציות אופליין'
          : 'Itinerario interactivo para un viaje familiar de 30 días por Argentina con mapas, conversor de moneda y funciones offline'
      );
    }
  }, [language]);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100">
        <TopBar />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/city/:cityId" element={<CityDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
