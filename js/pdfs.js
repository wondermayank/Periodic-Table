// ============================================
// PERIODIC TABLE ONLINE — PDF SECTION
// ============================================

const PDF_CARDS = [
  {
    icon: '📄',
    title: 'Minimal — Exam Mode',
    desc: 'Clean black & white layout optimized for printing. No colors, maximum readability.',
    tag: 'Black & White',
    pages: '1 page'
  },
  {
    icon: '🎨',
    title: 'Colour Coded',
    desc: 'Full color with all element categories clearly distinguished by background color.',
    tag: 'Full Color',
    pages: '1 page'
  },
  {
    icon: '⚛',
    title: 'Electron Configuration',
    desc: 'Each element cell shows the full electron configuration in standard notation.',
    tag: 'Detailed',
    pages: '1 page'
  },
  {
    icon: '🌡',
    title: 'Melting & Boiling Points',
    desc: 'Includes melting and boiling point data for every element at standard pressure.',
    tag: 'Data',
    pages: '1 page'
  },
  {
    icon: '🔬',
    title: 'Atomic Radius',
    desc: 'Color gradient shows atomic radius trends across all periods and groups.',
    tag: 'Trends',
    pages: '1 page'
  },
  {
    icon: '⚡',
    title: 'Electronegativity',
    desc: 'Pauling scale electronegativity values color-mapped from low to high.',
    tag: 'Trends',
    pages: '1 page'
  },
  {
    icon: '📊',
    title: 'Ionization Energy',
    desc: 'First ionization energies displayed with color intensity mapping.',
    tag: 'Trends',
    pages: '1 page'
  },
  {
    icon: '🏛',
    title: 'History of Discovery',
    desc: 'Color-coded by year of discovery — from ancient elements to modern synthetics.',
    tag: 'History',
    pages: '1 page'
  },
  {
    icon: '📐',
    title: 'Large Format — A3',
    desc: 'High-resolution A3 layout suitable for classroom wall posters.',
    tag: 'Poster',
    pages: 'A3 size'
  },
  {
    icon: '🌙',
    title: 'Dark Theme',
    desc: 'Dark background version, ideal for digital display on screens.',
    tag: 'Digital',
    pages: '1 page'
  },
  {
    icon: '📱',
    title: 'Mobile / Compact',
    desc: 'Condensed layout optimized for A5 or mobile screen reference.',
    tag: 'Compact',
    pages: 'A5 size'
  },
  {
    icon: '🔭',
    title: 'Abundance in Universe',
    desc: 'Element cells sized and colored by cosmic abundance in the observable universe.',
    tag: 'Cosmic',
    pages: '1 page'
  },
];

function buildPdfGrid() {
  const grid = document.getElementById('pdfGrid');
  if (!grid) return;
  grid.innerHTML = '';

  PDF_CARDS.forEach(pdf => {
    const card = document.createElement('div');
    card.className = 'pdf-card';
    card.innerHTML = `
      <div class="pdf-icon">${pdf.icon}</div>
      <div class="pdf-title">${pdf.title}</div>
      <div class="pdf-desc">${pdf.desc}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;">
        <span style="font-size:0.72rem;background:var(--orange-glow);color:var(--orange);padding:2px 8px;border-radius:4px;font-weight:600;">${pdf.tag}</span>
        <span style="font-size:0.72rem;color:var(--text3);">${pdf.pages}</span>
      </div>
      <div class="pdf-download">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M10 3v10M7 10l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M4 15v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        Download PDF
      </div>
    `;
    card.addEventListener('click', () => {
      // Generate a simple PDF-like print page
      printPDF(pdf);
    });
    grid.appendChild(card);
  });
}

function printPDF(pdf) {
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Periodic Table — ${pdf.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #FF6700; }
        p { color: #666; }
        .note { background: #fff3e0; padding: 12px; border-radius: 8px; border-left: 4px solid #FF6700; }
      </style>
    </head>
    <body>
      <h1>Periodic Table Online</h1>
      <h2>${pdf.icon} ${pdf.title}</h2>
      <p>${pdf.desc}</p>
      <div class="note">
        <strong>Note:</strong> In the full version, this would download a high-resolution PDF. 
        Use your browser's Print function (Ctrl+P / Cmd+P) to print the main page instead.
      </div>
      <br>
      <button onclick="window.print()" style="background:#FF6700;color:#fff;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;font-size:1rem;">
        Print / Save as PDF
      </button>
    </body>
    </html>
  `);
  win.document.close();
}

document.addEventListener('DOMContentLoaded', buildPdfGrid);
