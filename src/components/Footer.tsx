// filepath: [Footer.tsx](http://_vscodecontentref_/6)
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

const Footer: React.FC = () => {
  const { t } = useAppContext();

  return (
    <footer className="footer">
      <p>{t('footer_copyright') || '© 2025 Viaje Familiar Argentina'}</p>
    </footer>
  );
};

export default Footer;