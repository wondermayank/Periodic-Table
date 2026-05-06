// ============================================
// PERIODIC TABLE ONLINE — TABLE RENDERER
// ============================================

// Grid layout: [atomicNumber, gridColumn, gridRow]
// period, group -> grid position
// Lanthanides in row 9, Actinides in row 10

let currentHighlight = 'none';
let currentTrend = 'electronegativity';
let currentTemp = 25;
let activeElement = null;

function buildTable() {
  const table = document.getElementById('periodicTable');
  table.innerHTML = '';

  // Create 10-row grid (7 main + gap + 2 f-block)
  // We'll manually position each element

  // Helper to create a cell
  function makeCell(el) {
    const cell = document.createElement('div');
    cell.className = 'element-cell';
    cell.style.background = CATEGORY_COLORS[el.category] || '#d1d5db';
    cell.setAttribute('data-z', el.z);
    cell.setAttribute('data-name', el.name.toLowerCase());
    cell.setAttribute('data-symbol', el.symbol.toLowerCase());
    cell.setAttribute('data-category', el.category);

    cell.innerHTML = `
      <span class="el-number">${el.z}</span>
      <span class="el-symbol">${el.symbol}</span>
      <span class="el-name">${el.name}</span>
      <span class="el-mass">${el.mass}</span>
    `;

    cell.addEventListener('click', () => openElement(el));
    cell.addEventListener('mouseenter', () => showTooltip(el, cell));
    cell.addEventListener('mouseleave', hideTooltip);
    return cell;
  }

  function makeSpacer(col, row, span = 1) {
    const sp = document.createElement('div');
    sp.className = 'element-spacer';
    sp.style.gridColumn = `${col} / span ${span}`;
    sp.style.gridRow = row;
    return sp;
  }

  // Build grid: 18 columns, 10 rows
  // Row 1: H (col1) ... He (col18)
  // Row 2: Li-Be (1-2), gap (3-12), B-Ne (13-18)
  // Row 3: Na-Mg (1-2), gap (3-12), Al-Ar (13-18)
  // Row 4: K-Kr (1-18 no gaps)
  // Row 5: Rb-Xe (1-18 no gaps)
  // Row 6: Cs-Rn (1-18)
  // Row 7: Fr-Og (1-18)
  // Row 8: spacer row
  // Row 9: *La-Lu (3-17)
  // Row 10: **Ac-Lr (3-17)

  const placements = {}; // z -> {col, row}

  // Period 1
  placements[1]  = {col:1, row:1};
  placements[2]  = {col:18,row:1};

  // Period 2
  placements[3]  = {col:1, row:2};
  placements[4]  = {col:2, row:2};
  for (let i=0; i<6; i++) placements[5+i] = {col:13+i, row:2};

  // Period 3
  placements[11] = {col:1, row:3};
  placements[12] = {col:2, row:3};
  for (let i=0; i<6; i++) placements[13+i] = {col:13+i, row:3};

  // Period 4 (K=19 to Kr=36)
  for (let i=0; i<18; i++) placements[19+i] = {col:1+i, row:4};

  // Period 5 (Rb=37 to Xe=54)
  for (let i=0; i<18; i++) placements[37+i] = {col:1+i, row:5};

  // Period 6 (Cs=55, Ba=56, La=57 placeholder, Hf=72-Rn=86)
  placements[55] = {col:1, row:6};
  placements[56] = {col:2, row:6};
  // La-Lu in f-block row 9
  for (let i=0; i<15; i++) placements[57+i] = {col:3+i, row:9};
  // Hf(72) to Rn(86) in main row 6
  for (let i=0; i<15; i++) placements[72+i] = {col:4+i, row:6};

  // Period 7 (Fr=87, Ra=88, Ac=89 placeholder, Rf=104-Og=118)
  placements[87] = {col:1, row:7};
  placements[88] = {col:2, row:7};
  // Ac-Lr in f-block row 10
  for (let i=0; i<15; i++) placements[89+i] = {col:3+i, row:10};
  // Rf(104) to Og(118) in main row 7
  for (let i=0; i<15; i++) placements[104+i] = {col:4+i, row:7};

  // Set grid-template-rows for 10 rows
  table.style.gridTemplateRows = 'repeat(8, 1fr) 8px repeat(2, 1fr)';

  // Add placeholder cells for La/Ac positions
  const laCell = document.createElement('div');
  laCell.className = 'element-spacer';
  laCell.style.cssText = 'grid-column:3;grid-row:6;background:rgba(255,179,71,0.2);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.5rem;color:#999;';
  laCell.title = 'La–Lu';
  laCell.textContent = 'La–Lu';
  table.appendChild(laCell);

  const acCell = document.createElement('div');
  acCell.className = 'element-spacer';
  acCell.style.cssText = 'grid-column:3;grid-row:7;background:rgba(135,206,235,0.2);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.5rem;color:#999;';
  acCell.title = 'Ac–Lr';
  acCell.textContent = 'Ac–Lr';
  table.appendChild(acCell);

  // Gap row spacer between main + f block
  const gapRow = document.createElement('div');
  gapRow.style.cssText = 'grid-column:1/span 18;grid-row:8;height:8px;';
  table.appendChild(gapRow);

  // F-block labels
  const lantLabel = document.createElement('div');
  lantLabel.style.cssText = 'grid-column:1;grid-row:9;display:flex;align-items:center;justify-content:center;font-size:0.5rem;color:var(--text3);writing-mode:vertical-rl;';
  lantLabel.textContent = '57-71';
  table.appendChild(lantLabel);

  const actLabel = document.createElement('div');
  actLabel.style.cssText = 'grid-column:1;grid-row:10;display:flex;align-items:center;justify-content:center;font-size:0.5rem;color:var(--text3);writing-mode:vertical-rl;';
  actLabel.textContent = '89-103';
  table.appendChild(actLabel);

  const lantLabel2 = document.createElement('div');
  lantLabel2.style.cssText = 'grid-column:2;grid-row:9;display:flex;align-items:center;justify-content:center;font-size:0.55rem;color:var(--text3);';
  lantLabel2.textContent = '*';
  table.appendChild(lantLabel2);

  const actLabel2 = document.createElement('div');
  actLabel2.style.cssText = 'grid-column:2;grid-row:10;display:flex;align-items:center;justify-content:center;font-size:0.55rem;color:var(--text3);';
  actLabel2.textContent = '**';
  table.appendChild(actLabel2);

  // Place all elements
  ELEMENTS.forEach(el => {
    const pos = placements[el.z];
    if (!pos) return;
    const cell = makeCell(el);
    cell.style.gridColumn = pos.col;
    cell.style.gridRow = pos.row;
    table.appendChild(cell);
  });
}

// ============ HIGHLIGHT MODES ============

function setHighlight(mode, btn) {
  currentHighlight = mode;
  document.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.getElementById('tempSlider').classList.add('hidden');
  document.getElementById('trendSelect').classList.add('hidden');

  if (mode === 'temperature') {
    document.getElementById('tempSlider').classList.remove('hidden');
    updateTemp(currentTemp);
  } else if (mode === 'trend') {
    document.getElementById('trendSelect').classList.remove('hidden');
    applyTrend(currentTrend);
  } else if (mode === 'year') {
    applyYear();
  } else if (mode === 'isotopes') {
    applyIsotopes();
  } else {
    resetColors();
  }
}

function resetColors() {
  document.querySelectorAll('.element-cell').forEach(cell => {
    const z = parseInt(cell.getAttribute('data-z'));
    const el = ELEMENTS.find(e => e.z === z);
    if (el) {
      cell.style.background = CATEGORY_COLORS[el.category] || '#d1d5db';
    }
  });
}

function updateTemp(val) {
  currentTemp = parseInt(val);
  document.getElementById('tempVal').textContent = val;

  document.querySelectorAll('.element-cell').forEach(cell => {
    const z = parseInt(cell.getAttribute('data-z'));
    const el = ELEMENTS.find(e => e.z === z);
    if (!el) return;

    cell.classList.remove('gas', 'liquid');

    if (el.boil !== null && currentTemp > el.boil) {
      cell.style.background = '#b3d9ff';
      cell.classList.add('gas');
    } else if (el.melt !== null && currentTemp > el.melt) {
      cell.style.background = '#ffb3b3';
      cell.classList.add('liquid');
    } else {
      cell.style.background = CATEGORY_COLORS[el.category] || '#d1d5db';
    }
  });
}

function setTrend(trend, btn) {
  currentTrend = trend;
  document.querySelectorAll('.trend-select-wrap .ctrl-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyTrend(trend);
}

function applyTrend(trend) {
  const vals = ELEMENTS.map(e => e[trend]).filter(v => v !== null && v !== undefined);
  const min = Math.min(...vals);
  const max = Math.max(...vals);

  document.querySelectorAll('.element-cell').forEach(cell => {
    const z = parseInt(cell.getAttribute('data-z'));
    const el = ELEMENTS.find(e => e.z === z);
    if (!el || el[trend] === null || el[trend] === undefined) {
      cell.style.background = '#d1d5db';
      return;
    }

    const norm = (el[trend] - min) / (max - min);
    const r = Math.round(norm * 255);
    const g = Math.round((1 - norm) * 200 + 50);
    const b = Math.round((1 - Math.abs(norm - 0.5) * 2) * 150);
    cell.style.background = `rgb(${r},${g},${b})`;
  });
}

function applyYear() {
  const yEls = ELEMENTS.filter(e => e.year !== null);
  const minY = Math.min(...yEls.map(e => e.year));
  const maxY = Math.max(...yEls.map(e => e.year));

  document.querySelectorAll('.element-cell').forEach(cell => {
    const z = parseInt(cell.getAttribute('data-z'));
    const el = ELEMENTS.find(e => e.z === z);
    if (!el || el.year === null) {
      cell.style.background = '#888';
      return;
    }
    const norm = (el.year - minY) / (maxY - minY);
    const hue = Math.round(240 - norm * 200);
    cell.style.background = `hsl(${hue}, 70%, 65%)`;
  });
}

function applyIsotopes() {
  const isotopeCounts = {
    // Approximate stable isotope counts
    1:2,2:2,3:2,4:1,5:2,6:2,7:2,8:3,9:1,10:3,
    11:1,12:3,13:1,14:3,15:1,16:4,17:2,18:3,19:3,20:6,
    22:5,23:2,24:4,25:1,26:4,27:1,28:5,29:2,30:5,32:5,34:6,36:6,
    38:4,40:5,42:6,44:6,46:6,48:7,50:10,52:7,54:9,56:4,58:4,60:5,
    62:7,64:7,66:7,68:6,70:7,72:6,74:6,76:7,78:6,80:7,82:4
  };
  
  const max = 10;
  document.querySelectorAll('.element-cell').forEach(cell => {
    const z = parseInt(cell.getAttribute('data-z'));
    const count = isotopeCounts[z] || (z > 83 ? 0 : 1);
    const norm = Math.min(count / max, 1);
    const hue = Math.round(norm * 120); // green = many, red = few
    cell.style.background = `hsl(${hue}, 65%, 65%)`;
  });
}

// ============ SEARCH ============

function searchElements(val) {
  const q = val.toLowerCase().trim();
  const cells = document.querySelectorAll('.element-cell');

  if (!q) {
    cells.forEach(c => c.classList.remove('dimmed', 'highlighted'));
    return;
  }

  cells.forEach(cell => {
    const name = cell.getAttribute('data-name') || '';
    const sym = cell.getAttribute('data-symbol') || '';
    const z = cell.getAttribute('data-z') || '';
    const cat = cell.getAttribute('data-category') || '';

    const match = name.includes(q) || sym.includes(q) || z === q || cat.includes(q);
    if (match) {
      cell.classList.remove('dimmed');
      cell.classList.add('highlighted');
    } else {
      cell.classList.add('dimmed');
      cell.classList.remove('highlighted');
    }
  });
}

// ============ ELEMENT MODAL ============

function openElement(el) {
  activeElement = el;
  const modal = document.getElementById('elementModal');

  document.getElementById('modalAtomic').textContent = el.z;
  document.getElementById('modalSymbol').textContent = el.symbol;
  document.getElementById('modalNameSm').textContent = el.name;
  document.getElementById('modalMass').textContent = el.mass;
  document.getElementById('modalName').textContent = el.name;
  document.getElementById('modalCategory').textContent = CATEGORY_NAMES[el.category] || el.category;
  document.getElementById('modalDesc').textContent = el.desc;

  const block = document.getElementById('modalSymbolBlock');
  block.style.background = CATEGORY_COLORS[el.category] || '#d1d5db';

  // Properties
  const props = document.getElementById('modalProps');
  props.innerHTML = '';

  const propData = [
    ['Atomic Number', el.z],
    ['Atomic Mass', el.mass + ' u'],
    ['Melting Point', el.melt !== null ? el.melt + ' °C' : 'Unknown'],
    ['Boiling Point', el.boil !== null ? el.boil + ' °C' : 'Unknown'],
    ['Density', el.density !== null ? el.density + ' g/cm³' : 'Unknown'],
    ['Electronegativity', el.electronegativity !== null ? el.electronegativity : 'N/A'],
    ['Atomic Radius', el.radius !== null ? el.radius + ' pm' : 'Unknown'],
    ['Ionization Energy', el.ionization !== null ? el.ionization + ' eV' : 'Unknown'],
    ['Electron Config.', el.config],
    ['Electrons', el.electrons],
    ['Discovered', el.year ? el.year : 'Ancient'],
    ['Discoverer', el.discovered || 'Unknown'],
    ['Standard State', el.state ? el.state.charAt(0).toUpperCase() + el.state.slice(1) : 'Solid'],
  ];

  propData.forEach(([label, value]) => {
    const item = document.createElement('div');
    item.className = 'prop-item';
    item.innerHTML = `<div class="prop-label">${label}</div><div class="prop-value">${value}</div>`;
    props.appendChild(item);
  });

  modal.classList.add('active');

  // Render 3D Bohr model
  setTimeout(() => renderBohrModel(el), 100);
}

function closeModal(e) {
  if (e.target === document.getElementById('elementModal')) {
    document.getElementById('elementModal').classList.remove('active');
  }
}

// ============ TOOLTIP ============

let tooltip = null;
function showTooltip(el, cell) {
  hideTooltip();
  tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position:fixed;z-index:9999;background:var(--text);color:var(--bg2);
    padding:8px 12px;border-radius:8px;font-size:0.82rem;pointer-events:none;
    max-width:220px;box-shadow:0 4px 20px rgba(0,0,0,0.3);
    font-family:'Space Grotesk',sans-serif;line-height:1.5;
  `;
  tooltip.innerHTML = `
    <strong>${el.name} (${el.symbol})</strong><br>
    Z = ${el.z} | ${el.mass} u<br>
    ${CATEGORY_NAMES[el.category] || ''}
    ${el.melt !== null ? `<br>Mp: ${el.melt}°C` : ''}
  `;
  document.body.appendChild(tooltip);

  const rect = cell.getBoundingClientRect();
  let top = rect.bottom + 8;
  let left = rect.left;

  if (top + 100 > window.innerHeight) top = rect.top - 110;
  if (left + 220 > window.innerWidth) left = window.innerWidth - 230;
  if (left < 8) left = 8;

  tooltip.style.top = top + 'px';
  tooltip.style.left = left + 'px';
}

function hideTooltip() {
  if (tooltip) { tooltip.remove(); tooltip = null; }
}

// ============ HELPER MODALS ============

function shareModal() {
  if (navigator.share) {
    navigator.share({ title: 'Periodic Table Online', url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
}

function helpModal() {
  document.getElementById('helpModalEl').classList.add('active');
}

function closeHelpModal(e) {
  if (e.target === document.getElementById('helpModalEl')) {
    document.getElementById('helpModalEl').classList.remove('active');
  }
}

function openExplorer() {
  document.getElementById('elementModal').classList.remove('active');
  document.getElementById('explorerModal').classList.add('active');
  setTimeout(() => startExplorerDemo(), 200);
}

function closeExplorerModal(e) {
  if (e.target === document.getElementById('explorerModal')) {
    document.getElementById('explorerModal').classList.remove('active');
  }
}

// ============ DARK MODE ============

function toggleDark() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// ============ MOBILE MENU ============

function toggleMenu() {
  const links = document.querySelector('.nav-links');
  if (links.style.display === 'flex') {
    links.style.display = '';
  } else {
    links.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:60px;left:0;width:100%;background:var(--bg2);padding:12px 20px;border-bottom:1px solid var(--border);z-index:999;';
  }
}

// ============ INIT ============

document.addEventListener('DOMContentLoaded', () => {
  // Load dark mode
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }

  buildTable();
});
