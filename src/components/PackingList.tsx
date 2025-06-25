
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { geminiService } from '../services/apiService';

interface PackingItem {
  id: string;
  name: string;
  type: 'essential' | 'optional';
  checked: boolean;
  translatedName?: string;
}

const DEFAULT_ITEMS: PackingItem[] = [
  { id: '1', name: 'Pasaporte', type: 'essential', checked: false },
  { id: '2', name: 'Medicamentos', type: 'essential', checked: false },
  { id: '3', name: 'Protector solar', type: 'essential', checked: false },
  { id: '4', name: 'Cargadores', type: 'essential', checked: false },
  { id: '5', name: 'Ropa abrigada', type: 'essential', checked: false },
  { id: '6', name: 'Cámara fotográfica', type: 'optional', checked: false },
  { id: '7', name: 'Libros/tableta', type: 'optional', checked: false },
  { id: '8', name: 'Juegos para niños', type: 'optional', checked: false }
];

export const PackingList: React.FC = () => {
  const { t, language } = useAppContext();
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'essential' | 'optional'>('essential');
  const [isTranslating, setIsTranslating] = useState(false);

  // Cargar items desde localStorage al inicio
  useEffect(() => {
    const savedItems = localStorage.getItem('packingListItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(DEFAULT_ITEMS);
    }
  }, []);

  // Guardar items en localStorage cuando cambien
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('packingListItems', JSON.stringify(items));
    }
  }, [items]);

  // Traducir item automáticamente cuando se cambia de idioma
  const translateItem = async (item: PackingItem): Promise<string> => {
    if (language === 'es') return item.name;
    
    try {
      setIsTranslating(true);
      const prompt = `Traduce al hebreo únicamente esta palabra/frase: "${item.name}". Responde solo con la traducción, sin explicaciones.`;
      const translation = await geminiService.query(prompt, language);
      return translation || item.name;
    } catch (error) {
      console.error('Error translating item:', error);
      return item.name; // Fallback
    } finally {
      setIsTranslating(false);
    }
  };

  // Agregar nuevo item
  const addItem = async () => {
    if (!newItemName.trim()) return;
    
    const newItem: PackingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      type: newItemType,
      checked: false
    };

    // Traducir automáticamente si no está en español
    if (language === 'he') {
      newItem.translatedName = await translateItem(newItem);
    }

    setItems(prev => [...prev, newItem]);
    setNewItemName('');
  };

  // Eliminar item
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Toggle checked state
  const toggleItem = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Cambiar tipo de item
  const changeItemType = (id: string, type: 'essential' | 'optional') => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, type } : item
      )
    );
  };

  // Filtrar items por tipo
  const essentialItems = items.filter(item => item.type === 'essential');
  const optionalItems = items.filter(item => item.type === 'optional');

  const renderItemList = (itemList: PackingItem[], title: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
      <ul className="space-y-2">
        {itemList.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className={`${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {language === 'he' && item.translatedName ? item.translatedName : item.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Selector de tipo */}
              <select
                value={item.type}
                onChange={(e) => changeItemType(item.id, e.target.value as 'essential' | 'optional')}
                className="text-xs px-2 py-1 border border-gray-300 rounded"
              >
                <option value="essential">{t('packing_essential')}</option>
                <option value="optional">{t('packing_optional')}</option>
              </select>
              
              {/* Botón eliminar */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t('packing_title')}
      </h2>
      
      {/* Formulario para agregar items */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder={t('packing_placeholder')}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
        />
        
        <select
          value={newItemType}
          onChange={(e) => setNewItemType(e.target.value as 'essential' | 'optional')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="essential">{t('packing_essential')}</option>
          <option value="optional">{t('packing_optional')}</option>
        </select>
        
        <button
          onClick={addItem}
          disabled={!newItemName.trim() || isTranslating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
        >
          {isTranslating ? t('loading') : t('packing_add')}
        </button>
      </div>

      {/* Lista de items esenciales */}
      {renderItemList(essentialItems, t('packing_essential'))}
      
      {/* Lista de items opcionales */}
      {renderItemList(optionalItems, t('packing_optional'))}
      
      {/* Estadísticas */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <div className="text-sm text-gray-600">
          <span className="font-semibold">
            {items.filter(item => item.checked).length} / {items.length}
          </span>
          {' '}items completados
        </div>
      </div>
    </div>
  );
};
