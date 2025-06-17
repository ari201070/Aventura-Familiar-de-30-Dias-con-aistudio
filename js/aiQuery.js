// ===============================
// Consulta a IA - Mock MCP + Multilenguaje + Offline
// ===============================

function mockAIResponse(question, lang) {
  // Simulación simple, podrías mejorarla con más respuestas por tema/idioma
  if (!question.trim()) return '';
  if (lang === 'he') {
    return "זהו מענה לדוגמה של ה-AI על שאלתך.";
  }
  return "Esta es una respuesta de ejemplo de la IA a tu pregunta.";
}

async function handleAiQuery() {
  const question = document.getElementById('iaQuestion').value;
  const responseDiv = document.getElementById('iaResponse');
  const btn = document.getElementById('iaSubmit');
  if (!question.trim()) {
    responseDiv.textContent = window.t ? window.t('iaVacio') : 'Por favor, ingresa una pregunta.';
    return;
  }
  btn.disabled = true;
  responseDiv.textContent = window.t ? window.t('iaEsperando') : 'Consultando a la IA...';
  try {
    // Aquí podrías hacer fetch a una API real si hay conexión
    // Simulación offline:
    setTimeout(() => {
      const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'es';
      responseDiv.textContent = mockAIResponse(question, lang);
      btn.disabled = false;
    }, 1200);
  } catch (e) {
    responseDiv.textContent = window.t ? window.t('iaError') : 'No se pudo obtener respuesta.';
    btn.disabled = false;
  }
}

function translateAiQuery() {
  document.getElementById('iaQuestion').placeholder = window.t ? window.t('iaPlaceholder') : 'Haz tu pregunta sobre el viaje...';
  document.getElementById('iaSubmit').textContent = window.t ? window.t('consultarBtn') : 'Consultar';
}

function initAiQuery() {
  document.getElementById('iaSubmit').onclick = handleAiQuery;
  translateAiQuery();
  window.onLanguageChange = function () {
    translateAiQuery();
  };
}

// Exponer para main.js
window.initAiQuery = initAiQuery;
