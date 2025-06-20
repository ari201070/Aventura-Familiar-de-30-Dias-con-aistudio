// filepath: [CityDetailPage.tsx](http://_vscodecontentref_/9)
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

const CityDetailPage: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const { t } = useAppContext();

  return (
    <div>
      <h1>{t(cityId || '')}</h1>
      {/* Aquí va el contenido detallado de la ciudad */}
    </div>
  );
};

export default CityDetailPage;