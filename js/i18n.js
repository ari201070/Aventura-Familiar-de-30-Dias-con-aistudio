// js/i18n.js

const SUPPORTED_LANGUAGES = ['es', 'he'];
const DEFAULT_LANGUAGE = 'es';

let translations = {};
let currentLang = DEFAULT_LANGUAGE;

// Carga los archivos de traducción locales (MCP: primero intenta localStorage, si no fetch local)
async function loadTranslations(lang) {
  if (localStorage.getItem(`translations_${lang}`)) {
    translations[lang] = JSON.parse(localStorage.getItem(`translations_${lang}`));
    return;
  }
  try {
    const response = await fetch(`locales/${lang}.json`);
    const data = await response.json();
    translations[lang] = data;
    localStorage.setItem(`translations_${lang}`, JSON.stringify(data));
  } catch (e) {
    console.error(`No se pudo cargar la traducción para ${lang}:`, e);
    translations[lang] = {};
  }
}

// Aplica traducción a todos los elementos con data-key
function applyTranslations(lang) {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (translations[lang] && translations[lang][key]) {
      if (el.placeholder !== undefined) {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  // Soporte RTL para hebreo
  if (lang === 'he') {
    document.body.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
  } else {
    document.body.setAttribute('dir', 'ltr');
    document.body.classList.remove('rtl');
  }
}

// Cambia el idioma globalmente y lo guarda en localStorage
async function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) lang = DEFAULT_LANGUAGE;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  if (!translations[lang]) await loadTranslations(lang);
  applyTranslations(lang);
  // Notifica a otros módulos si es necesario
  if (window.onLanguageChange) window.onLanguageChange(lang);
}

// Detecta idioma al cargar
async function initI18n() {
  let lang = localStorage.getItem('lang') || DEFAULT_LANGUAGE;
  if (!SUPPORTED_LANGUAGES.includes(lang)) lang = DEFAULT_LANGUAGE;
  await loadTranslations(lang);
  applyTranslations(lang);

  // Botones de idioma
  SUPPORTED_LANGUAGES.forEach(code => {
    const btn = document.getElementById(`btn-${code}`);
    if (btn) {
      btn.classList.toggle('active', code === lang);
      btn.onclick = () => setLanguage(code);
    }
  });
}

// Exponer funciones globalmente si es necesario
window.setLanguage = setLanguage;
window.getCurrentLanguage = () => currentLang;
window.initI18n = initI18n;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', initI18n);
