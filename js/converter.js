// ============================================
// PERIODIC TABLE ONLINE — UNIT CONVERTER
// ============================================

// ---- TEMPERATURE ----
function convertTemp(from, val) {
  const v = parseFloat(val);
  if (isNaN(v)) return;

  let c, f, k;
  if (from === 'c') {
    c = v; f = v * 9/5 + 32; k = v + 273.15;
  } else if (from === 'f') {
    c = (v - 32) * 5/9; f = v; k = c + 273.15;
  } else {
    k = v; c = v - 273.15; f = c * 9/5 + 32;
  }

  setIfNotActive('tempC', from, c.toFixed(4));
  setIfNotActive('tempF', from, f.toFixed(4));
  setIfNotActive('tempK', from, k.toFixed(4));
}

// ---- ENERGY ----
function convertEnergy(from, val) {
  const v = parseFloat(val);
  if (isNaN(v)) return;

  let j;
  if (from === 'j')   j = v;
  else if (from === 'kj')  j = v * 1000;
  else if (from === 'ev')  j = v * 1.60218e-19;
  else if (from === 'cal') j = v * 4.184;

  setIfNotActive('energyJ',   from, j.toExponential(4));
  setIfNotActive('energykJ',  from, (j / 1000).toExponential(4));
  setIfNotActive('energyeV',  from, (j / 1.60218e-19).toExponential(4));
  setIfNotActive('energyCal', from, (j / 4.184).toExponential(4));
}

// ---- PRESSURE ----
function convertPressure(from, val) {
  const v = parseFloat(val);
  if (isNaN(v)) return;

  let pa;
  if (from === 'pa')   pa = v;
  else if (from === 'atm') pa = v * 101325;
  else if (from === 'bar') pa = v * 1e5;
  else if (from === 'mmhg') pa = v * 133.322;

  setIfNotActive('pressAtm',  from, (pa / 101325).toFixed(6));
  setIfNotActive('pressPa',   from, pa.toFixed(4));
  setIfNotActive('pressBar',  from, (pa / 1e5).toFixed(6));
  setIfNotActive('pressmmHg', from, (pa / 133.322).toFixed(4));
}

// Helper: only update field if it's not the one currently being edited
function setIfNotActive(id, activeFrom, value) {
  const el = document.getElementById(id);
  if (!el) return;
  // Map input id to "from" key
  const fromMap = {
    tempC:'c', tempF:'f', tempK:'k',
    energyJ:'j', energykJ:'kj', energyeV:'ev', energyCal:'cal',
    pressAtm:'atm', pressPa:'pa', pressBar:'bar', pressmmHg:'mmhg'
  };
  if (fromMap[id] !== activeFrom) {
    el.value = isNaN(parseFloat(value)) ? '' : value;
  }
}
