// Minimal stand-in for the dashboard runtime the page was written against:
// loads the CSV datasets, evaluates calculations, and re-runs page callbacks
// when data arrives or the window is resized.
(function () {
  const DATASETS = {
    capacity: 'data/nordic_capacity_irena.csv',
    generation: 'data/nordic_generation_eurostat.csv',
    forecast: 'data/nordic_outlook_2030.csv'
  };

  const store = {};      // id -> {status, data, columns, message}
  const calcs = {};      // id -> {inputs, fn}
  const listeners = [];

  function parseCSV(text) {
    const rows = [];
    let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) {
        if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') q = false;
        else cell += ch;
      } else if (ch === '"') q = true;
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); cell = '';
        if (row.length > 1 || row[0] !== '') rows.push(row);
        row = [];
      } else cell += ch;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    const columns = rows.shift() || [];
    return {
      columns,
      data: rows.map(r => { const o = {}; columns.forEach((c, i) => { o[c] = r[i] === undefined ? '' : r[i]; }); return o; })
    };
  }

  function computeCalc(id, seen) {
    seen = seen || {};
    if (seen[id]) return { status: 'error', data: [], message: 'Circular calculation' };
    seen[id] = true;
    const c = calcs[id];
    const args = [];
    for (const inp of c.inputs) {
      const d = inp in calcs ? computeCalc(inp, seen) : store[inp];
      if (!d || d.status !== 'ok') return { status: d && d.status === 'error' ? 'error' : 'loading', data: [] };
      args.push(d.data);
    }
    try { return { status: 'ok', data: c.fn(...args) }; }
    catch (e) { console.error('Calculation ' + id + ' failed', e); return { status: 'error', data: [], message: String(e) }; }
  }

  function notify() {
    listeners.forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
  }

  window.dash = {
    colors: ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)',
             'var(--series-5)', 'var(--series-6)', 'var(--series-7)', 'var(--series-8)'],
    data(id) {
      if (id in calcs) return computeCalc(id);
      return store[id] || { status: 'missing', data: [] };
    },
    calc(id, def) { calcs[id] = def; },
    onData(fn) { listeners.push(fn); try { fn(); } catch (e) { console.error(e); } },
    loader() {}, refresh() {}, params() { return {}; }, setParams() {}, resetParams() {}, setLink() {}
  };

  Object.entries(DATASETS).forEach(([id, url]) => {
    store[id] = { status: 'loading', data: [] };
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(r.status + ' ' + r.statusText); return r.text(); })
      .then(t => { const p = parseCSV(t); store[id] = { status: 'ok', data: p.data, columns: p.columns }; })
      .catch(e => { console.error('Failed to load ' + url, e); store[id] = { status: 'error', data: [], message: String(e) }; })
      .finally(notify);
  });

  let w = window.innerWidth, t;
  window.addEventListener('resize', () => {
    if (window.innerWidth === w) return;
    w = window.innerWidth;
    clearTimeout(t); t = setTimeout(notify, 120);
  });
})();
