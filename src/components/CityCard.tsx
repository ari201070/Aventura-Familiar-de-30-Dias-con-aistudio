// filepath: [CityCard.tsx](http://_vscodecontentref_/7)
import React from 'react';
import { City } from '../config/types';

interface CityCardProps {
  city: City;
  onSelect: (name: string) => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, onSelect }) => (
  <div className="city-card" onClick={() => onSelect(city.name)}>
    <img src={city.images[0]} alt={city.name} />
    <h2>{city.name}</h2>
    <p>{city.description}</p>
  </div>
);

export default CityCard;