// ===============================
// JS PRINCIPAL - Argentina Aventura Familiar de 30 Días
// ===============================

// ========== INICIALIZACIÓN GLOBAL Y TRADUCCIÓN DINÁMICA ==========

document.addEventListener('DOMContentLoaded', function () {
  // Inicializar traducción dinámica (i18n)
  if (window.initI18n) window.initI18n();
  // Inicializar conversor de moneda
  if (window.initCurrencyConverter) window.initCurrencyConverter();
  // Inicializar lista de equipaje
  if (window.initPackingList) window.initPackingList();
  // Inicializar consulta a IA
  if (window.initAiQuery) window.initAiQuery();

  renderTablaTransporte();
  initCityCardNavigation();
  initMap();
});

// ========== TABLA DE TRANSPORTE ENTRE CIUDADES ==========

async function getTransporteData() {
  let data = JSON.parse(localStorage.getItem('transporte'));
  if (!data) {
    try {
      const resp = await fetch('data/transport.json');
      data = await resp.json();
      localStorage.setItem('transporte', JSON.stringify(data));
    } catch (e) {
      data = [];
    }
  }
  return data;
}

async function renderTablaTransporte() {
  const tbody = document.querySelector('#tabla-transporte tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const TRANSPORTE = await getTransporteData();
  if (!Array.isArray(TRANSPORTE) || TRANSPORTE.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.textContent = window.t ? window.t('no_datos_transporte') : 'No hay datos de transporte disponibles.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  const fragment = document.createDocumentFragment();
  const keys = ['desde', 'hasta', 'medio', 'tiempo', 'precio'];
  TRANSPORTE.forEach(row => {
    const tr = document.createElement('tr');
    keys.forEach(key => {
      const td = document.createElement('td');
      td.textContent = row[key] || '';
      tr.appendChild(td);
    });
    const tdCompania = document.createElement('td');
    tdCompania.innerHTML = row.compania || '';
    tr.appendChild(tdCompania);
    fragment.appendChild(tr);
  });
  tbody.appendChild(fragment);
}

// ========== NAVEGACIÓN DE TARJETAS DE CIUDAD ==========

function initCityCardNavigation() {
  document.querySelectorAll(".btn-visit").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const page = btn.getAttribute("data-page");
      if (page) window.location.href = page;
    });
  });
}

// ========== MAPA INTERACTIVO ==========

function initMap() {
  if (typeof L === "undefined") return; // Leaflet no cargado

  const map = L.map('map').setView([-34.5, -63], 4.2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const destinations = [
    { name: window.t ? window.t('buenosaires_title') : 'Buenos Aires', coords: [-34.6118, -58.3960] },
    { name: window.t ? window.t('rosario_title') : 'Rosario', coords: [-32.9442, -60.6505] },
    { name: window.t ? window.t('bariloche_title') : 'Bariloche', coords: [-41.1335, -71.3103] },
    { name: window.t ? window.t('mendoza_title') : 'Mendoza', coords: [-32.8908, -68.8272] },
    { name: window.t ? window.t('malargue_title') : 'Malargüe', coords: [-35.4757, -69.5840] },
    { name: window.t ? window.t('jujuy_title') : 'Jujuy', coords: [-24.1858, -65.2995] },
    { name: window.t ? window.t('iguazu_title') : 'Iguazú', coords: [-25.5952, -54.5732] },
    { name: window.t ? window.t('corrientes_title') : 'Corrientes', coords: [-27.4691, -58.8309] },
    { name: window.t ? window.t('ibera_title') : 'Iberá', coords: [-28.2649, -57.4316] }
  ];

  destinations.forEach(dest => {
    L.marker(dest.coords).addTo(map)
      .bindPopup(dest.name);
  });
}

// ========== FIN ==========
