
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { CITIES, DEFAULT_CITY_IMAGE, AI_PROMPT_CONFIGS, LANGUAGES } from '../config/constants';
import InteractiveMap from '../components/InteractiveMap';
import { City, AIPromptContent, AIResponseType, Language } from '../config/types';
import { parseMarkdownLinks, parseMarkdownTable } from '../utils/markdownParser';
import { askGemini } from '../services/apiService';

const CityDetailPage: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const { t, language } = useAppContext();

  const city = CITIES.find(c => c.id === cityId);

  const [aiResponses, setAiResponses] = useState<Record<string, AIResponseType | undefined>>({});
  const [aiLoadingStates, setAiLoadingStates] = useState<Record<string, boolean>>({});
  const [aiUserInputs, setAiUserInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    // Reset AI states ONLY when city changes, not on language change
    setAiResponses({});
    setAiLoadingStates({});
    setAiUserInputs({});
  }, [cityId]);

  if (!city) {
    return <Navigate to="/" replace />;
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_CITY_IMAGE;
  };
  
  const detailCardClasses = "bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out";
  const detailSectionTitleClasses = "text-2xl font-bold text-indigo-700 mb-4 pb-2 border-b border-indigo-200 flex items-center";
  const detailTextClasses = "text-gray-700 leading-relaxed";

  const constructFullPrompt = (basePromptKey: string, cityForPrompt: City, userInput: string) => {
    let promptText = t(basePromptKey, { cityName: t(cityForPrompt.nameKey) });
    // Fallback if city-specific prompt is not found
    if (promptText === basePromptKey) {
        const genericPromptKey = `generic${basePromptKey.substring(cityForPrompt.id.length)}`;
        promptText = t(genericPromptKey, { cityName: t(cityForPrompt.nameKey) });
         if (promptText === genericPromptKey) {
            console.error(`AI Prompt not found for key: ${basePromptKey} or ${genericPromptKey}`);
            return null;
         }
    }
    return `${promptText} ${userInput}`.trim();
  };

  const handleGenerateAiContent = async (config: AIPromptContent, cityForPrompt: City, targetLang: Language) => {
    const userInput = aiUserInputs[config.promptKeySuffix] || "";
    const basePromptKey = `${cityForPrompt.id}${config.promptKeySuffix}`;
    const fullPrompt = constructFullPrompt(basePromptKey, cityForPrompt, userInput);

    if (!fullPrompt) {
      setAiResponses(prev => ({ 
        ...prev, 
        [config.promptKeySuffix]: { 
          text: t('iaError') + " (Prompt missing)", 
          lang: targetLang, 
          originalBasePromptKey: basePromptKey, 
          originalUserInput: userInput 
        } 
      }));
      return;
    }

    setAiLoadingStates(prev => ({ ...prev, [config.promptKeySuffix]: true }));
    setAiResponses(prev => ({ 
      ...prev, 
      [config.promptKeySuffix]: { 
        text: t('generating') + '...', 
        lang: targetLang, 
        originalBasePromptKey: basePromptKey, 
        originalUserInput: userInput 
      } 
    }));

    try {
      const responseText = await askGemini(fullPrompt, targetLang);
      setAiResponses(prev => ({ 
        ...prev, 
        [config.promptKeySuffix]: { 
          text: responseText, 
          lang: targetLang, 
          originalBasePromptKey: basePromptKey, 
          originalUserInput: userInput 
        } 
      }));
    } catch (error) {
      setAiResponses(prev => ({ 
        ...prev, 
        [config.promptKeySuffix]: { 
          text: t('iaError'), 
          lang: targetLang, 
          originalBasePromptKey: basePromptKey, 
          originalUserInput: userInput 
        } 
      }));
    } finally {
      setAiLoadingStates(prev => ({ ...prev, [config.promptKeySuffix]: false }));
    }
  };

  const handleTranslateAiResponse = async (config: AIPromptContent, cityForPrompt: City) => {
    const existingResponse = aiResponses[config.promptKeySuffix];
    if (!existingResponse) return;

    const { originalBasePromptKey, originalUserInput } = existingResponse;
    const fullPrompt = constructFullPrompt(originalBasePromptKey, cityForPrompt, originalUserInput);

    if (!fullPrompt) {
        setAiResponses(prev => ({ 
        ...prev, 
        [config.promptKeySuffix]: { 
            ...existingResponse, 
            text: t('iaError') + " (Original prompt error for translation)", 
            lang: language 
        } 
        }));
        return;
    }
    
    setAiLoadingStates(prev => ({ ...prev, [config.promptKeySuffix]: true }));
    
    try {
      const translatedText = await askGemini(fullPrompt, language); 
      setAiResponses(prev => ({ 
        ...prev, 
        [config.promptKeySuffix]: { 
          text: translatedText, 
          lang: language, 
          originalBasePromptKey, 
          originalUserInput 
        } 
      }));
    } catch (error) {
      setAiResponses(prev => ({ 
        ...prev, 
        [config.promptKeySuffix]: { 
            ...existingResponse, 
            text: existingResponse.text + `\n\n(${t('iaError')} - Translation failed)`, 
        } 
      }));
    } finally {
      setAiLoadingStates(prev => ({ ...prev, [config.promptKeySuffix]: false }));
    }
  };
  
  const renderSection = (titleKeySuffix: string, contentKey: string, iconClass: string) => {
    const title = t(`section_title_${titleKeySuffix}`);
    let content = t(contentKey);
    
    if (!content || content === contentKey) return null;

    let contentNode: React.ReactNode;

    const listStyleSections = ['must_see', 'activities_recommended', 'accommodation_examples'];

    if (listStyleSections.includes(titleKeySuffix) && content.includes('- ')) {
      const listItems = content.split('\n').filter(item => item.trim().startsWith('- '));
      contentNode = (
        <ul className="list-disc list-inside space-y-1">
          {listItems.map((item, index) => (
            <li key={index} className={detailTextClasses}>
              {parseMarkdownLinks(item.substring(item.indexOf('- ') + 2))}
            </li>
          ))}
        </ul>
      );
    } else if (titleKeySuffix === 'gastronomy_highlight') {
      const sections = content.split(/\n###\s*(.+?)\n/); 
      contentNode = sections.reduce<React.ReactNode[]>((acc, part, index) => {
        if (index % 2 === 1) { 
          const subtitleKey = part.toLowerCase().includes(t('gastronomy_restaurants_subtitle').toLowerCase().split(' ')[0]) ? 'gastronomy_restaurants_subtitle' : 
                              part.toLowerCase().includes(t('gastronomy_cafes_subtitle').toLowerCase().split(' ')[0]) ? 'gastronomy_cafes_subtitle' : '';
          if (subtitleKey) {
            acc.push(<h3 key={`sub-${index}`} className="text-xl font-semibold text-gray-800 mt-4 mb-2">{t(subtitleKey)}</h3>);
          } else {
             acc.push(<h3 key={`sub-unknown-${index}`} className="text-xl font-semibold text-gray-800 mt-4 mb-2">{part.trim()}</h3>);
          }
        } else if (part.trim().startsWith('|')) { 
          acc.push(<div key={`table-${index}`}>{parseMarkdownTable(part, (k) => t(k), language)}</div>);
        } else if (part.trim()) { 
          const paragraphs = part.trim().split('\n').filter(p => p.trim());
          paragraphs.forEach((paragraph, pIndex) => {
            acc.push(
              <p key={`text-${index}-p-${pIndex}`} className={`${detailTextClasses} mb-3 whitespace-pre-line`}>
                {parseMarkdownLinks(paragraph)}
              </p>
            );
          });
        }
        return acc;
      }, []);
    } else if (titleKeySuffix === 'budget_table' && content.trim().startsWith('|')) {
        contentNode = parseMarkdownTable(content, (k) => t(k), language);
    } else {
      const paragraphs = content.split('\n').filter(p => p.trim() !== '');
      if (paragraphs.length > 0) {
        contentNode = paragraphs.map((paragraph, idx) => (
          <p key={idx} className={`${detailTextClasses} whitespace-pre-line`}>
            {parseMarkdownLinks(paragraph)}
          </p>
        ));
      } else if (content.trim()) {
         contentNode = (
          <p className={`${detailTextClasses} whitespace-pre-line`}>
            {parseMarkdownLinks(content.trim())}
          </p>
        );
      } else {
        contentNode = null; 
      }
    }

    if (contentNode === null || (Array.isArray(contentNode) && contentNode.length === 0 && !(contentNode as any[]).some(n => n !== null))) return null;


    return (
      <section className={detailCardClasses}>
        <h2 className={detailSectionTitleClasses}>
          <i className={`fas ${iconClass} mr-3 text-xl text-indigo-500`}></i>
          {title}
        </h2>
        {contentNode}
      </section>
    );
  };
  
  const renderLinkSection = (titleKeySuffix: string, textKeySuffix: string, urlKeySuffix: string, iconClass: string) => {
    const title = t(`section_title_${titleKeySuffix}`);
    const linkText = t(`${city.id}_${textKeySuffix}`);
    const linkUrl = t(`${city.id}_${urlKeySuffix}`);
    const mainTextContentKey = `${city.id}_${titleKeySuffix.toLowerCase()}`;
    const mainTextContent = t(mainTextContentKey);
    
    const isMainTextValid = mainTextContent && mainTextContent !== mainTextContentKey;
    const isLinkTextValid = linkText && linkText !== `${city.id}_${textKeySuffix}`;
    const isLinkUrlValid = linkUrl && linkUrl !== `${city.id}_${urlKeySuffix}`;

    if (!isMainTextValid && !isLinkUrlValid) {
      return null;
    }
    
    const displayText = isLinkTextValid ? linkText : t('explore_btn');

    return (
      <section className={detailCardClasses}>
        <h2 className={detailSectionTitleClasses}>
          <i className={`fas ${iconClass} mr-3 text-xl text-indigo-500`}></i>
          {title}
        </h2>
        {isMainTextValid && (
             <p className={`${detailTextClasses} mb-4 whitespace-pre-line`}>{parseMarkdownLinks(mainTextContent)}</p>
        )}
        {isLinkUrlValid && (
            <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150 text-sm"
            >
            {displayText} <i className="fas fa-external-link-alt ml-1"></i>
            </a>
        )}
      </section>
    );
  };

  return (
    <div className="space-y-10">
      <header className="text-center py-10 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl shadow-2xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          {t(city.nameKey)}
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section className={detailCardClasses}>
            <img 
              src={city.image} 
              alt={t(city.nameKey)} 
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md mb-6"
              onError={handleImageError}
            />
            <div className={`${detailTextClasses} text-lg whitespace-pre-line`}>{parseMarkdownLinks(t(city.descriptionKey))}</div>
          </section>

          {renderSection('dates_duration', `${city.id}_dates_duration`, 'fa-calendar-alt')}
          {renderSection('must_see', `${city.id}_must_see`, 'fa-star')}
          {renderSection('activities_recommended', city.activitiesKey, 'fa-hiking')}
          {renderSection('gastronomy_highlight', `${city.id}_gastronomy_highlight`, 'fa-utensils')}
          {renderSection('accommodation_examples', city.accommodationKey, 'fa-bed')}
          {renderSection('coordinates', `${city.id}_coordinates`, 'fa-map-pin')}
          {renderLinkSection('events_agenda', 'events_agenda_link_text', 'events_agenda_link_url', 'fa-calendar-check')}
          {renderSection('family_tips', `${city.id}_family_tips`, 'fa-users')}
          {renderSection('cultural_tips', `${city.id}_cultural_tips`, 'fa-landmark')}
          {renderSection('budget_table', city.budgetKey, 'fa-wallet')}
          {renderLinkSection('city_map', 'map_link_text', 'map_link_url', 'fa-map')}

          {AI_PROMPT_CONFIGS.map(config => {
            const currentResponse = aiResponses[config.promptKeySuffix];
            return (
              <section key={config.promptKeySuffix} className={detailCardClasses}>
                <h2 className={detailSectionTitleClasses}>
                  <i className={`fas ${config.icon} mr-3 text-xl text-indigo-500`}></i>
                  {t(config.titleKey)}
                </h2>
                <p className={`${detailTextClasses} mb-4`}>
                  {t(config.descriptionKey, { cityName: t(city.nameKey) })}
                </p>
                <textarea
                  value={aiUserInputs[config.promptKeySuffix] || ''}
                  onChange={(e) => setAiUserInputs(prev => ({ ...prev, [config.promptKeySuffix]: e.target.value }))}
                  placeholder={t(config.userInputPlaceholderKey)}
                  rows={3}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={aiLoadingStates[config.promptKeySuffix]}
                />
                <button
                  onClick={() => handleGenerateAiContent(config, city, language)}
                  disabled={aiLoadingStates[config.promptKeySuffix]}
                  className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mb-3"
                >
                  {aiLoadingStates[config.promptKeySuffix] && currentResponse?.lang === language ? ( 
                    <><i className="fas fa-spinner fa-spin mr-2"></i> {t('generating')}</>
                  ) : (
                    <>{t(config.buttonKey)}</>
                  )}
                </button>
                
                {currentResponse && (
                  <div className="mt-5 p-4 bg-gray-50 rounded-lg shadow-inner whitespace-pre-line text-gray-700 border border-gray-200">
                    {parseMarkdownLinks(currentResponse.text)}
                    {currentResponse.lang !== language && !aiLoadingStates[config.promptKeySuffix] && (
                      <button
                        onClick={() => handleTranslateAiResponse(config, city)}
                        className="mt-3 w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors text-sm"
                      >
                        <i className="fas fa-language mr-2"></i>
                        {t('ai_translate_button_text', { lang: LANGUAGES.find(l => l.code === language)?.name || language })}
                      </button>
                    )}
                     {aiLoadingStates[config.promptKeySuffix] && currentResponse?.lang !== language && ( 
                        <div className="mt-2 text-sm text-gray-500"><i className="fas fa-spinner fa-spin mr-1"></i> {t('generating')} {LANGUAGES.find(l=>l.code === language)?.name}...</div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <aside className="lg:col-span-1 space-y-8 sticky top-24">
           <section className={detailCardClasses}>
            <h2 className={detailSectionTitleClasses}>
                <i className={`fas fa-map-marked-alt mr-3 text-xl text-indigo-500`}></i>
                {t('mapaInteractivoTitulo')}
            </h2>
            <InteractiveMap 
              cities={[city]} 
              selectedCityCoords={city.coords} 
              pointsOfInterest={city.pointsOfInterest}
              zoomLevel={13} 
            />
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CityDetailPage;
