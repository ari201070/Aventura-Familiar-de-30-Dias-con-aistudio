// ===============================
// Lista de Equipaje Interactiva MCP + Multilenguaje + Offline
// ===============================

function getPackingData() {
  return JSON.parse(localStorage.getItem('packingList')) || { esencial: [], opcional: [] };
}

function savePackingData(data) {
  localStorage.setItem('packingList', JSON.stringify(data));
}

function renderPackingList() {
  const data = getPackingData();
  ['esencial', 'opcional'].forEach(type => {
    const ul = document.getElementById(`packing-list-${type}`);
    if (!ul) return;
    ul.innerHTML = '';
    if (data[type].length === 0) {
      const li = document.createElement('li');
      li.textContent = window.t ? window.t('packing_vacio') : 'No hay ítems en esta lista.';
      ul.appendChild(li);
    } else {
      data[type].forEach((item, idx) => {
        const li = document.createElement('li');
        li.textContent = item;
        const btn = document.createElement('button');
        btn.textContent = window.t ? window.t('packing_borrar') : 'Borrar';
        btn.className = 'custom-btn';
        btn.style.marginLeft = '10px';
        btn.onclick = function () {
          data[type].splice(idx, 1);
          savePackingData(data);
          renderPackingList();
        };
        li.appendChild(btn);
        ul.appendChild(li);
      });
    }
  });
}

function addPackingItem() {
  const input = document.getElementById('packing-input');
  const type = document.getElementById('packing-type').value;
  if (!input || !input.value.trim()) return;
  const data = getPackingData();
  data[type].push(input.value.trim());
  savePackingData(data);
  input.value = '';
  renderPackingList();
}

function translatePackingList() {
  renderPackingList(); // Simple: los ítems se muestran igual, los textos de botones y vacíos cambian por t()
}

function initPackingList() {
  document.getElementById('packing-add').onclick = addPackingItem;
  renderPackingList();
  // Escuchar cambio de idioma
  window.onLanguageChange = function () {
    translatePackingList();
  };
}

// Exponer para main.js
window.initPackingList = initPackingList;
