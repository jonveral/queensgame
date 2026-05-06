import { NextResponse } from 'next/server';

export interface LevelData {
  size: number;
  regions: number[][];
}

// Fungsi 1: Menghasilkan posisi 9 Ratu yang valid secara acak
function generateValidQueens(size: number): { r: number; c: number }[] {
  let queens: { r: number; c: number }[] = [];

  const solve = (row: number): boolean => {
    if (row === size) return true;

    // Acak urutan kolom untuk mendapatkan peta yang berbeda setiap saat
    const cols = Array.from({ length: size }, (_, i) => i);
    for (let i = cols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cols[i], cols[j]] = [cols[j], cols[i]];
    }

    for (const col of cols) {
      let conflict = false;
      for (const q of queens) {
        // Cek bentrok baris, kolom, dan persentuhan (diagonal/sebelahan)
        if (
          q.c === col ||
          (Math.abs(q.r - row) <= 1 && Math.abs(q.c - col) <= 1)
        ) {
          conflict = true;
          break;
        }
      }

      if (!conflict) {
        queens.push({ r: row, c: col });
        if (solve(row + 1)) return true;
        queens.pop(); // Backtrack jika jalan buntu
      }
    }
    return false;
  };

  solve(0);
  return queens;
}

// Fungsi 2: Membuat wilayah/region di sekitar Ratu
function generateRandomMap(size: number): number[][] {
  const queens = generateValidQueens(size);
  const regions = Array(size).fill(0).map(() => Array(size).fill(0));
  
  // Frontier menyimpan sel-sel terluar dari setiap wilayah yang sedang tumbuh
  const frontier: { r: number; c: number; id: number }[] = [];

  // Tanamkan 9 Ratu sebagai benih/pusat wilayah (ID 1 sampai 9)
  queens.forEach((q, i) => {
    const id = i + 1;
    regions[q.r][q.c] = id;
    frontier.push({ r: q.r, c: q.c, id });
  });

  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Atas, Bawah, Kiri, Kanan

  // Proses perluasan wilayah hingga papan penuh
  while (frontier.length > 0) {
    // Pilih batas wilayah secara acak
    const idx = Math.floor(Math.random() * frontier.length);
    const current = frontier[idx];
    frontier.splice(idx, 1);

    // Cari tetangga yang masih kosong (bernilai 0)
    const emptyNeighbors = [];
    for (const [dr, dc] of dirs) {
      const nr = current.r + dr;
      const nc = current.c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && regions[nr][nc] === 0) {
        emptyNeighbors.push({ r: nr, c: nc });
      }
    }

    if (emptyNeighbors.length > 0) {
      // Ekspansi wilayah ke salah satu tetangga kosong
      const n = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
      regions[n.r][n.c] = current.id;
      
      // Jika masih ada tetangga kosong lain, kembalikan sel saat ini ke antrean
      if (emptyNeighbors.length > 1) {
        frontier.push(current);
      }
      // Masukkan sel yang baru diklaim ke dalam antrean frontier
      frontier.push({ r: n.r, c: n.c, id: current.id });
    }
  }

  return regions;
}

export async function GET() {
  const size = 9; // Ukuran tetap 9x9
  
  // Hasilkan peta otomatis secara real-time
  const randomRegions = generateRandomMap(size);

  const levelData: LevelData = {
    size: size,
    regions: randomRegions
  };

  const response = NextResponse.json(levelData);
  // Matikan caching agar setiap klik "Peta Selanjutnya" selalu men-generate ulang
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  
  return response;
}