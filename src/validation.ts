// Kazakhstan IIN / BIN: 12 digits with a mod-11 check digit.
export function isValidIinBin(v: string): boolean {
    if (!/^\d{12}$/.test(v)) return false;
    const d = v.split('').map(Number);
    const w1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const w2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];
    let k = d.slice(0, 11).reduce((s, x, i) => s + x * w1[i], 0) % 11;
    if (k === 10) k = d.slice(0, 11).reduce((s, x, i) => s + x * w2[i], 0) % 11;
    if (k === 10) return false;
    return k === d[11];
  }
  