import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import apiService from '../services/apiService';
import { useTranslation } from '../utils/markdownParser';
import { City, Activity, Event } from '../types';

const CityDetailPage: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const t = useTranslation();
  const history = useHistory();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cityData = await fetch(`/data/cities.json`).then(res => res.json());
        const foundCity = cityData.find((c: City) => c.name.toLowerCase() === cityName?.toLowerCase());
        setCity(foundCity);

        const activitiesRes = await apiService.getArgentinaTravelActivities({ destino: cityName });
        setActivities(activitiesRes || []);

        const eventsRes = await apiService.createCalendarEvent({ ciudad: cityName });
        setEvents(eventsRes || []);
      } catch (error) {
        alert(t('Error al cargar datos de la ciudad'));
      }
      setLoading(false);
    }
    fetchData();
  }, [cityName, t]);

  const portada = city && city.images && city.images.length > 0
    ? city.images[0]
    : `docs/imagenes/${cityName?.toLowerCase()}/${cityName?.toLowerCase()}.jpg`;

  return (
    <div className="city-detail">
      <header className="top-bar">
        <button className="lang-btn" onClick={() => {/* lógica de idioma */}}>{t('ES')}</button>
        <button className="lang-btn" onClick={() => {/* lógica de idioma */}}>{t('HE')}</button>
        <button className="back-btn" onClick={() => history.push('/index.html')}>{t('⬅ Volver al itinerario')}</button>
      </header>
      <h1>{t(cityName || '')}</h1>
      <img
        src={portada}
        alt={t(cityName || '')}
        className="city-cover"
      />
      <section>
        <h2>{t('Introducción')}</h2>
        <p>{city ? t(city.description) : ''}</p>
      </section>
      <section>
        <h2>{t('Actividades recomendadas')}</h2>
        {loading ? t('Cargando...') : activities.map(act => (
          <div key={act.id}>
            <h3>{t(act.name)}</h3>
            <p>{t(act.description)}</p>
          </div>
        ))}
      </section>
      <section>
        <h2>{t('Agenda de eventos')}</h2>
        {loading ? t('Cargando...') : events.map(evt => (
          <div key={evt.id}>
            <h3>{t(evt.summary)}</h3>
            <p>{evt.date}</p>
          </div>
        ))}
      </section>
      <section>
        <h2>{t('Alojamiento')}</h2>
        <p>{city && city.accommodation ? t(city.accommodation) : t('Próximamente')}</p>
      </section>
      <section>
        <h2>{t('Gastronomía')}</h2>
        <p>{city && city.food ? t(city.food) : t('Próximamente')}</p>
      </section>
      <section>
        <h2>{t('Atracciones')}</h2>
        <p>{city && city.attractions ? t(city.attractions) : t('Próximamente')}</p>
      </section>
      <section>
        <h2>{t('Presupuesto orientativo')}</h2>
        <p>{city && city.budget ? t(city.budget) : t('Próximamente')}</p>
      </section>
      <section>
        <h2>{t('Consejos para familias')}</h2>
        <p>{city && city.tips ? t(city.tips) : t('Próximamente')}</p>
      </section>
    </div>
  );
};

export default CityDetailPage;
