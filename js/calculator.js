// ============================================
// PERIODIC TABLE ONLINE — MOLAR MASS CALCULATOR
// ============================================

// Atomic masses lookup by symbol
const ATOMIC_MASSES = {};
ELEMENTS.forEach(el => { ATOMIC_MASSES[el.symbol] = el.mass; });

function calcMolarMass(formula) {
  const resultEl = document.getElementById('calcResult');
  if (!formula || !formula.trim()) {
    resultEl.innerHTML = '';
    return;
  }

  try {
    const parsed = parseFormula(formula.trim());
    if (!parsed || Object.keys(parsed).length === 0) {
      resultEl.innerHTML = `<div class="result-error">⚠ Could not parse formula. Try: H2O, NaCl, C6H12O6</div>`;
      return;
    }

    let total = 0;
    let breakdown = [];

    for (const [sym, count] of Object.entries(parsed)) {
      const mass = ATOMIC_MASSES[sym];
      if (mass === undefined) {
        resultEl.innerHTML = `<div class="result-error">⚠ Unknown element symbol: ${sym}</div>`;
        return;
      }
      const contrib = mass * count;
      total += contrib;
      breakdown.push(`${sym}: ${count} × ${mass} = ${contrib.toFixed(4)} g/mol`);
    }

    resultEl.innerHTML = `
      <div class="result-main">${total.toFixed(4)} g/mol</div>
      <div class="result-breakdown">${breakdown.join('<br>')}</div>
    `;
  } catch (e) {
    resultEl.innerHTML = `<div class="result-error">⚠ Invalid formula: ${e.message}</div>`;
  }
}

// Recursive formula parser supporting parentheses
function parseFormula(formula) {
  const counts = {};

  function parse(str, pos) {
    const result = {};
    while (pos < str.length) {
      if (str[pos] === '(') {
        // Find matching closing paren
        let depth = 1, end = pos + 1;
        while (end < str.length && depth > 0) {
          if (str[end] === '(') depth++;
          else if (str[end] === ')') depth--;
          end++;
        }
        // Parse inside parens
        const inner = parse(str, pos + 1);
        // Get multiplier after ')'
        let numStr = '';
        let i = end;
        while (i < str.length && str[i] >= '0' && str[i] <= '9') {
          numStr += str[i++];
        }
        const mult = numStr ? parseInt(numStr) : 1;
        for (const [sym, cnt] of Object.entries(inner.result)) {
          result[sym] = (result[sym] || 0) + cnt * mult;
        }
        pos = i;
      } else if (str[pos] === ')') {
        // Return to caller
        return { result, pos: pos + 1 };
      } else if (str[pos] >= 'A' && str[pos] <= 'Z') {
        // Element symbol
        let sym = str[pos++];
        while (pos < str.length && str[pos] >= 'a' && str[pos] <= 'z') {
          sym += str[pos++];
        }
        // Count
        let numStr = '';
        while (pos < str.length && str[pos] >= '0' && str[pos] <= '9') {
          numStr += str[pos++];
        }
        const count = numStr ? parseInt(numStr) : 1;
        result[sym] = (result[sym] || 0) + count;
      } else {
        pos++; // skip unknown chars
      }
    }
    return { result, pos };
  }

  const { result } = parse(formula, 0);
  return result;
}

// Key binding: Enter on input triggers calculation
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('calcInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') calcMolarMass(input.value);
    });
  }
});
