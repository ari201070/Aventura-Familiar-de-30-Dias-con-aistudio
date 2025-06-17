import React from 'react';
import { City } from '../types';
import { useTranslation } from '../utils/markdownParser';

interface CityCardProps {
  city: City;
  onSelect: (cityName: string) => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, onSelect }) => {
  const t = useTranslation();
  const portada = city.images && city.images.length > 0
    ? city.images[0]
    : `docs/imagenes/${city.name.toLowerCase()}/${city.name.toLowerCase()}.jpg`;

  return (
    <div className="city-card" onClick={() => onSelect(city.name)}>
      <img
        src={portada}
        alt={t(city.name)}
        className="city-image"
      />
      <h2>{t(city.name)}</h2>
      <p>{t(city.description)}</p>
    </div>
  );
};

export default CityCard;
