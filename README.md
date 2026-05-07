# ⚛ Periodic Table Online — Clone

A full-featured, interactive periodic table website clone with **3D element viewer**, molecular explorer, molar mass calculator, unit converter, and more.

## 🚀 Features

| Feature | Description |
|---|---|
| 🧪 **Interactive Periodic Table** | All 118 elements with click-to-detail |
| 🌡 **Temperature Mode** | Slide to see phase states at any temperature |
| 📈 **Trend Visualization** | Electronegativity, atomic radius, ionization energy |
| 📅 **Discovery Year** | Color-coded by when each element was found |
| ⚛ **3D Bohr Models** | Animated electron orbital models for every element |
| 🔬 **Molecular Explorer** | 3D rotating molecules: H₂O, NaCl, CO₂, NH₃, CH₄, C₆H₆ |
| 🧮 **Molar Mass Calculator** | Full formula parser with parentheses support |
| 🔄 **Unit Converter** | Temperature, energy, and pressure conversions |
| 📄 **PDF Downloads** | 12 printable periodic table styles |
| 🌙 **Dark Mode** | Persisted via localStorage |
| 🔍 **Search** | By name, symbol, atomic number, or category |

## 📁 File Structure

```
periodic-table/
├── index.html              # Main page — all sections
├── css/
│   └── style.css           # Full stylesheet with dark mode
├── js/
│   ├── elements-data.js    # All 118 elements with full data
│   ├── periodic-table.js   # Table rendering & interactions
│   ├── 3d-viewer.js        # Canvas-based 3D Bohr models & molecules
│   ├── calculator.js       # Molar mass formula parser
│   ├── converter.js        # Unit conversion logic
│   └── pdfs.js             # PDF card grid generator
└── README.md
```

## 🌐 Hosting on GitHub Pages

1. **Create a new GitHub repository**
2. **Upload all files** maintaining the folder structure above
3. Go to **Settings → Pages**
4. Set source to `main` branch, `/ (root)`
5. Your site will be live at `https://yourusername.github.io/repo-name/`

### Using Git CLI:
```bash
git init
git add .
git commit -m "Initial commit: Periodic Table Online clone"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/periodic-table.git
git push -u origin main
```

Then enable GitHub Pages in repository Settings.

## 🛠 Local Development

No build tools needed — pure HTML/CSS/JS.

```bash
# Option 1: Python
python3 -m http.server 8080

# Option 2: Node
npx serve .

# Option 3: VS Code
# Install "Live Server" extension, right-click index.html → Open with Live Server
```

Then open `http://localhost:8080`

## 📊 Data Sources

- Element data compiled from IUPAC, NIST, and PubChem
- Atomic masses per IUPAC 2021 standard atomic weights
- Electronegativity values from Pauling scale
- Electron configurations from standard shell model

## 🎨 Customization

### Change color theme
Edit CSS variables in `css/style.css`:
```css
:root {
  --orange: #FF6700;        /* Primary accent color */
  --orange-light: #FF8C38;  /* Hover state */
}
```

### Add more compounds to Explorer
In `js/3d-viewer.js`, add to the `COMPOUNDS` object:
```js
h2s: {
  name: 'Hydrogen Sulfide',
  formula: 'H₂S',
  atoms: [
    {s:'S', c:'#FFFF44', r:22, x:0,   y:0,  z:0},
    {s:'H', c:'#88ccff',r:13, x:-65, y:-28, z:20},
    {s:'H', c:'#88ccff',r:13, x:65,  y:-28, z:20},
  ],
  bonds: [[0,1],[0,2]],
  info: 'Bent geometry, 92° bond angle. Toxic gas with rotten egg odor.'
}
```

## 📱 Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Safari | ✅ Responsive |

## 📄 License

MIT License — free to use, modify, and distribute.

---

Built with pure HTML, CSS, and JavaScript. No frameworks or build tools required.
