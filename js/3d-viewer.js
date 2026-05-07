// ============================================
// PERIODIC TABLE ONLINE — 3D VIEWER
// Bohr model + molecular explorer using Canvas
// ============================================

// ============ BOHR MODEL (Element Modal) ============

let bohrAnimFrame = null;
let explorerAnimFrame = null;
let explorerDemoFrame = null;

function renderBohrModel(el) {
  const canvas = document.getElementById('atomCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;

  if (bohrAnimFrame) cancelAnimationFrame(bohrAnimFrame);

  // Parse electron shells from el.electrons string e.g. "2,8,18,1"
  const shells = (el.electrons || '1').split(',').map(Number);
  const numShells = shells.length;

  // Color based on category
  const baseColor = CATEGORY_COLORS[el.category] || '#4ECDC4';
  const electronColor = '#FF6700';

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background
    const isDark = document.body.classList.contains('dark');
    ctx.fillStyle = isDark ? '#1a1d26' : '#f0f2f5';
    ctx.fillRect(0, 0, W, H);

    // Draw orbital rings
    const maxRadius = Math.min(cx, cy) - 20;
    const shellSpacing = maxRadius / (numShells + 0.5);

    for (let s = 0; s < numShells; s++) {
      const r = shellSpacing * (s + 1);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw electrons on this shell
      const numE = shells[s];
      const speed = 0.3 / (s + 1); // outer shells slower

      for (let e = 0; e < numE; e++) {
        const angle = (2 * Math.PI * e / numE) + t * speed * (s % 2 === 0 ? 1 : -1);
        const ex = cx + r * Math.cos(angle);
        const ey = cy + r * Math.sin(angle);

        // Electron glow
        const grd = ctx.createRadialGradient(ex, ey, 0, ex, ey, 8);
        grd.addColorStop(0, electronColor);
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(ex, ey, 8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Electron dot
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fillStyle = electronColor;
        ctx.fill();
      }
    }

    // Nucleus
    const nucleusR = Math.min(18, shellSpacing * 0.45);

    // Nucleus glow
    const nucGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, nucleusR * 2);
    nucGrd.addColorStop(0, baseColor);
    nucGrd.addColorStop(0.5, baseColor + 'aa');
    nucGrd.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, nucleusR * 2, 0, Math.PI * 2);
    ctx.fillStyle = nucGrd;
    ctx.fill();

    // Nucleus body
    ctx.beginPath();
    ctx.arc(cx, cy, nucleusR, 0, Math.PI * 2);
    ctx.fillStyle = baseColor;
    ctx.fill();

    // Nucleus symbol
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.font = `bold ${nucleusR > 14 ? 14 : 10}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(el.symbol, cx, cy);

    t += 0.02;
    bohrAnimFrame = requestAnimationFrame(draw);
  }

  draw();
}

// ============ EXPLORER SECTION DEMO (H2O molecule) ============

function startExplorerSectionDemo() {
  const canvas = document.getElementById('explorerCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  if (explorerDemoFrame) cancelAnimationFrame(explorerDemoFrame);

  let t = 0;
  let rotY = 0;

  // H2O molecule: O center, two H atoms
  const atoms = [
    { symbol: 'O', color: '#FF4444', r: 22, x: 0, y: 0, z: 0 },
    { symbol: 'H', color: '#88ccff', r: 14, x: -65, y: -30, z: 20 },
    { symbol: 'H', color: '#88ccff', r: 14, x: 65, y: -30, z: 20 },
  ];

  const bonds = [[0,1],[0,2]];

  function project(x, y, z, rotY) {
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const rx = x * cosY - z * sinY;
    const rz = x * sinY + z * cosY;
    const scale = 350 / (350 + rz);
    return {
      px: W/2 + rx * scale,
      py: H/2 + y * scale,
      scale,
      rz
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const isDark = document.body.classList.contains('dark');
    ctx.fillStyle = isDark ? '#1a1d26' : '#f8f9fb';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    }
    for (let i = 0; i < H; i += 30) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
    }

    rotY += 0.008;

    // Project atoms
    const projected = atoms.map(a => {
      const p = project(a.x, a.y, a.z, rotY);
      return { ...a, ...p };
    });

    // Sort by z for depth
    const sortedAtoms = [...projected].sort((a, b) => a.rz - b.rz);

    // Draw bonds
    bonds.forEach(([i, j]) => {
      const a = projected[i], b = projected[j];
      ctx.beginPath();
      ctx.moveTo(a.px, a.py);
      ctx.lineTo(b.px, b.py);
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 6 * ((a.scale + b.scale) / 2);
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Draw atoms
    sortedAtoms.forEach(a => {
      const r = a.r * a.scale;

      // Shadow
      ctx.beginPath();
      ctx.arc(a.px + r*0.3, a.py + r*0.3, r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fill();

      // Atom sphere with gradient
      const grd = ctx.createRadialGradient(
        a.px - r*0.3, a.py - r*0.3, r*0.1,
        a.px, a.py, r
      );
      grd.addColorStop(0, lightenColor(a.color, 0.5));
      grd.addColorStop(0.5, a.color);
      grd.addColorStop(1, darkenColor(a.color, 0.4));

      ctx.beginPath();
      ctx.arc(a.px, a.py, r, 0, Math.PI*2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Highlight
      const hGrd = ctx.createRadialGradient(
        a.px - r*0.25, a.py - r*0.25, 0,
        a.px - r*0.25, a.py - r*0.25, r*0.6
      );
      hGrd.addColorStop(0, 'rgba(255,255,255,0.5)');
      hGrd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(a.px, a.py, r, 0, Math.PI*2);
      ctx.fillStyle = hGrd;
      ctx.fill();

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(8, 13 * a.scale)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.symbol, a.px, a.py);
    });

    // Molecule formula overlay
    ctx.font = 'bold 18px Space Grotesk, sans-serif';
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('H₂O', 16, 16);

    // Bond angle indicator
    ctx.font = '12px Space Grotesk, sans-serif';
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)';
    ctx.fillText('∠ 104.5°', 16, H - 28);

    t += 0.016;
    explorerDemoFrame = requestAnimationFrame(draw);
  }

  draw();
}

// ============ EXPLORER MODAL 3D ============

const COMPOUNDS = {
  h2o:   { name:'Water', formula:'H₂O', atoms:[
    {s:'O',c:'#FF4444',r:22,x:0,y:0,z:0},
    {s:'H',c:'#88ccff',r:14,x:-65,y:-30,z:20},
    {s:'H',c:'#88ccff',r:14,x:65,y:-30,z:20}
  ], bonds:[[0,1],[0,2]], info:'Bent molecular geometry, 104.5° bond angle. Essential for life.'},
  nacl:  { name:'Sodium Chloride', formula:'NaCl', atoms:[
    {s:'Na',c:'#FF6B35',r:20,x:-50,y:0,z:0},
    {s:'Cl',c:'#FFEAA7',r:24,x:50,y:0,z:0}
  ], bonds:[[0,1]], info:'Ionic compound. Forms cubic crystal lattice. Common table salt.'},
  co2:   { name:'Carbon Dioxide', formula:'CO₂', atoms:[
    {s:'C',c:'#555',r:18,x:0,y:0,z:0},
    {s:'O',c:'#FF4444',r:20,x:-80,y:0,z:0},
    {s:'O',c:'#FF4444',r:20,x:80,y:0,z:0}
  ], bonds:[[0,1],[0,2]], info:'Linear geometry, 180° bond angle. Greenhouse gas in the atmosphere.'},
  nh3:   { name:'Ammonia', formula:'NH₃', atoms:[
    {s:'N',c:'#4444FF',r:20,x:0,y:0,z:0},
    {s:'H',c:'#88ccff',r:13,x:-55,y:30,z:-30},
    {s:'H',c:'#88ccff',r:13,x:55,y:30,z:-30},
    {s:'H',c:'#88ccff',r:13,x:0,y:-60,z:20}
  ], bonds:[[0,1],[0,2],[0,3]], info:'Trigonal pyramidal. Household cleaner and fertilizer precursor.'},
  ch4:   { name:'Methane', formula:'CH₄', atoms:[
    {s:'C',c:'#555',r:18,x:0,y:0,z:0},
    {s:'H',c:'#88ccff',r:13,x:70,y:0,z:-50},
    {s:'H',c:'#88ccff',r:13,x:-70,y:0,z:-50},
    {s:'H',c:'#88ccff',r:13,x:0,y:70,z:50},
    {s:'H',c:'#88ccff',r:13,x:0,y:-70,z:50}
  ], bonds:[[0,1],[0,2],[0,3],[0,4]], info:'Tetrahedral geometry, 109.5° bond angles. Simplest alkane. Natural gas.'},
  c6h6:  { name:'Benzene', formula:'C₆H₆', atoms:[
    ...Array.from({length:6},(_,i)=>({s:'C',c:'#333',r:16,x:Math.cos(i*Math.PI/3)*70,y:Math.sin(i*Math.PI/3)*70,z:0})),
    ...Array.from({length:6},(_,i)=>({s:'H',c:'#88ccff',r:11,x:Math.cos(i*Math.PI/3)*110,y:Math.sin(i*Math.PI/3)*110,z:0}))
  ], bonds:Array.from({length:6},(_,i)=>[i,(i+1)%6]).concat(Array.from({length:6},(_,i)=>[i,i+6])),
   info:'Aromatic ring with delocalized π electrons. Planar hexagonal geometry.'},
};

let explorerRotY = 0;
let currentCompound = COMPOUNDS.h2o;

function startExplorerDemo() {
  const canvas = document.getElementById('explorerModal3D');
  if (!canvas) return;
  if (explorerAnimFrame) cancelAnimationFrame(explorerAnimFrame);
  renderExplorerMolecule(canvas, currentCompound);
  updateExplorerInfo(currentCompound);
}

function renderExplorerMolecule(canvas, compound) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  if (explorerAnimFrame) cancelAnimationFrame(explorerAnimFrame);

  function project(x, y, z) {
    const cosY = Math.cos(explorerRotY), sinY = Math.sin(explorerRotY);
    const rx = x * cosY - z * sinY;
    const rz = x * sinY + z * cosY;
    const scale = 400 / (400 + rz);
    return { px: W/2 + rx * scale, py: H/2 + y * scale, scale, rz };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.body.classList.contains('dark');
    ctx.fillStyle = isDark ? '#252836' : '#f0f2f5';
    ctx.fillRect(0, 0, W, H);

    explorerRotY += 0.01;
    const projected = compound.atoms.map(a => ({ ...a, ...project(a.x, a.y, a.z) }));
    const sorted = [...projected].sort((a,b) => a.rz - b.rz);

    // Bonds
    compound.bonds.forEach(([i,j]) => {
      const a = projected[i], b = projected[j];
      ctx.beginPath();
      ctx.moveTo(a.px, a.py);
      ctx.lineTo(b.px, b.py);
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)';
      ctx.lineWidth = Math.max(3, 7 * ((a.scale + b.scale) / 2));
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Atoms
    sorted.forEach(a => {
      const r = a.r * a.scale;

      const grd = ctx.createRadialGradient(
        a.px - r*0.3, a.py - r*0.3, r*0.05,
        a.px, a.py, r
      );
      grd.addColorStop(0, lightenColor(a.c, 0.45));
      grd.addColorStop(0.5, a.c);
      grd.addColorStop(1, darkenColor(a.c, 0.35));

      ctx.beginPath();
      ctx.arc(a.px, a.py, r, 0, Math.PI*2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Specular highlight
      const hGrd = ctx.createRadialGradient(
        a.px - r*0.25, a.py - r*0.25, 0,
        a.px - r*0.25, a.py - r*0.25, r*0.55
      );
      hGrd.addColorStop(0, 'rgba(255,255,255,0.55)');
      hGrd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(a.px, a.py, r, 0, Math.PI*2);
      ctx.fillStyle = hGrd;
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(7, Math.round(12 * a.scale))}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.s, a.px, a.py);
    });

    // Formula
    ctx.font = 'bold 16px Space Grotesk, sans-serif';
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(compound.formula, 14, 12);

    explorerAnimFrame = requestAnimationFrame(draw);
  }

  draw();
}

function updateExplorerInfo(compound) {
  const el = document.getElementById('explorerInfo');
  if (!el) return;
  el.innerHTML = `<strong>${compound.name} (${compound.formula})</strong><br>${compound.info}`;
}

function searchCompound(val) {
  const q = val.toLowerCase().replace(/\s/g,'');
  let found = null;

  // Match by formula or name
  for (const [key, comp] of Object.entries(COMPOUNDS)) {
    if (
      key === q ||
      comp.formula.toLowerCase().replace(/[₀-₉]/g, c => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]) === q ||
      comp.name.toLowerCase().includes(q) ||
      comp.formula.toLowerCase().includes(q)
    ) {
      found = comp;
      break;
    }
  }

  if (!found) {
    // Try matching formulas more loosely
    for (const [key, comp] of Object.entries(COMPOUNDS)) {
      if (key.includes(q.replace('2','').replace('6',''))) {
        found = comp;
        break;
      }
    }
  }

  if (found) {
    currentCompound = found;
    const canvas = document.getElementById('explorerModal3D');
    if (canvas) renderExplorerMolecule(canvas, found);
    updateExplorerInfo(found);
  } else {
    document.getElementById('explorerInfo').innerHTML =
      `<span style="color:var(--text3)">Showing: H₂O, NaCl, CO₂, NH₃, CH₄, C₆H₆</span>`;
  }
}

// ============ COLOR UTILITIES ============

function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * amount));
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
  return `rgb(${r},${g},${b})`;
}

// ============ INIT ============

document.addEventListener('DOMContentLoaded', () => {
  // Start section demo after a short delay
  setTimeout(startExplorerSectionDemo, 500);

  // Restart on dark mode toggle
  const origToggle = window.toggleDark;
  window.toggleDark = function() {
    origToggle();
    setTimeout(startExplorerSectionDemo, 100);
    const expCanvas = document.getElementById('explorerModal3D');
    if (expCanvas && document.getElementById('explorerModal').classList.contains('active')) {
      renderExplorerMolecule(expCanvas, currentCompound);
    }
  };

  // Stop animations when modal closes
  document.getElementById('elementModal').addEventListener('click', function(e) {
    if (e.target === this) {
      if (bohrAnimFrame) { cancelAnimationFrame(bohrAnimFrame); bohrAnimFrame = null; }
    }
  });
});
