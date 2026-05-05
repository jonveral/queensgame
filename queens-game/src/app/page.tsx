"use client";

import { useState, useEffect } from "react";
import { LevelData } from "./api/level/route";

interface QueenPos {
  r: number;
  c: number;
  reg: number;
}

export default function QueensGame() {
  const [size, setSize] = useState<number>(0);
  const [regions, setRegions] = useState<number[][]>([]);
  const [board, setBoard] = useState<number[][]>([]);
  const [history, setHistory] = useState<number[][][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Palet warna vintage/kertas tua yang pudar namun tetap bisa dibedakan
  const regionColors: Record<number, string> = {
    1: "bg-[#e8dac1]", // Kertas terang
    2: "bg-[#d6c5a5]", // Khaki pudar
    3: "bg-[#c2b292]", // Coklat debu
    4: "bg-[#d8ceb9]", // Beige
    5: "bg-[#cbbba6]", // Taupe hangat
    6: "bg-[#b7b09c]", // Sage kering
    7: "bg-[#d2bcae]", // Terakota pudar
    8: "bg-[#c4b9ad]", // Abu-abu hangat
    9: "bg-[#e0d0c1]"  // Peach tua
  };

  const fetchNewLevel = () => {
    setIsLoading(true);
    fetch("/api/level", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: LevelData) => {
        setSize(data.size);
        setRegions(data.regions);
        setBoard(Array(data.size).fill(0).map(() => Array(data.size).fill(0)));
        setHistory([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchNewLevel();
  }, []);

  const handleCellClick = (r: number, c: number) => {
    const currentBoardCopy = board.map((row) => [...row]);
    setHistory([...history, currentBoardCopy]);

    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = (newBoard[r][c] + 1) % 3;
    setBoard(newBoard);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousBoard = history[history.length - 1];
    setBoard(previousBoard);
    setHistory(history.slice(0, -1));
  };

  const handleReset = () => {
    setBoard(Array(size).fill(0).map(() => Array(size).fill(0)));
    setHistory([]);
  };

  const queens: QueenPos[] = [];
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 2) queens.push({ r, c, reg: regions[r][c] });
    });
  });

  const errors = new Set<string>();
  for (let i = 0; i < queens.length; i++) {
    for (let j = i + 1; j < queens.length; j++) {
      const q1 = queens[i];
      const q2 = queens[j];
      let isError = false;

      if (q1.r === q2.r || q1.c === q2.c || q1.reg === q2.reg) isError = true;
      if (Math.abs(q1.r - q2.r) <= 1 && Math.abs(q1.c - q2.c) <= 1) isError = true;

      if (isError) {
        errors.add(`${q1.r},${q1.c}`);
        errors.add(`${q2.r},${q2.c}`);
      }
    }
  }

  const isWin = errors.size === 0 && queens.length === size && size > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f4ebd0] font-serif text-[#4a332a]">
        <div className="animate-pulse text-2xl font-bold tracking-widest">
          Membuka Lembaran Kuno...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#ece4d0] font-serif flex flex-col items-center py-10 text-[#3e2723] overflow-x-hidden relative">
      
      {/* Efek Tekstur Kasar (Noise) Opsional menggunakan pseudo-element di Tailwind */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

      {/* Header Judul */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-5xl md:text-6xl font-black text-[#3b261d] mb-4 tracking-wider drop-shadow-sm uppercase">
          QueenAnakDewa
        </h1>
        <p className="text-sm md:text-base font-medium text-[#6a4f40] max-w-lg px-4 italic leading-relaxed">
          "Tempatkan satu Ratu di setiap baris, kolom, dan wilayah. Ingatlah, para Ratu tak boleh saling menatap, bahkan dari sudut menyilang."
        </p>
      </div>

      {/* Kontrol Atas (Undo & Reset) bergaya Retro Pressed Button */}
      <div className="flex gap-4 mb-8 z-10">
        <button 
          onClick={handleUndo} 
          disabled={history.length === 0}
          className={`flex items-center gap-2 px-5 py-2 border-[3px] border-[#3b261d] font-bold rounded-sm transition-all
            ${history.length === 0 
              ? "bg-[#d8ceb9] text-[#a09383] opacity-60 cursor-not-allowed" 
              : "bg-[#e8dac1] text-[#3b261d] shadow-[4px_4px_0px_#3b261d] hover:bg-[#d6c5a5] active:translate-y-1 active:translate-x-1 active:shadow-none"}`}
        >
          <span className="text-lg">↶</span> Urungkan
        </button>
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2 bg-[#e8dac1] text-[#7a2828] border-[3px] border-[#3b261d] font-bold rounded-sm shadow-[4px_4px_0px_#3b261d] hover:bg-[#d6c5a5] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
        >
          <span className="text-lg">↻</span> Bersihkan Papan
        </button>
      </div>

      {/* Grid Game Container (Berbingkai Kayu Tua/Buku) */}
      <div className="p-3 md:p-4 bg-[#d5c5ad] rounded-md shadow-[8px_8px_0px_rgba(59,38,29,0.8)] border-[3px] border-[#3b261d] z-10">
        <div 
          className="grid border-[4px] border-[#2c1c14] bg-[#2c1c14]"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {board.map((row, r) =>
            row.map((cellValue, c) => {
              const regionId = regions[r][c];
              const isError = errors.has(`${r},${c}`);
              
              const borderTop = r === 0 || regions[r - 1][c] !== regionId ? "border-t-[4px] border-t-[#2c1c14]" : "";
              const borderBottom = r === size - 1 || regions[r + 1][c] !== regionId ? "border-b-[4px] border-b-[#2c1c14]" : "";
              const borderLeft = c === 0 || regions[r][c - 1] !== regionId ? "border-l-[4px] border-l-[#2c1c14]" : "";
              const borderRight = c === size - 1 || regions[r][c + 1] !== regionId ? "border-r-[4px] border-r-[#2c1c14]" : "";

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center text-xl sm:text-3xl cursor-pointer select-none transition-colors border border-[#a69986]/40
                    ${regionColors[regionId]} 
                    ${borderTop} ${borderBottom} ${borderLeft} ${borderRight}
                    ${isError ? "bg-[#b95e5e] animate-pulse border-[#6b2020] z-10" : "hover:brightness-95"}
                  `}
                >
                  {cellValue === 1 && <span className="text-[#8c7b6d] font-bold">✖</span>}
                  {/* Bidak Ratu dengan warna Tinta Merah Anggur (Burgundy) */}
                  {cellValue === 2 && <span className="text-[#6b1e1e] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">♛</span>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Area Pesan Kemenangan */}
      <div className="h-16 mt-8 flex items-center justify-center z-10">
        {isWin && (
          <div className="animate-bounce px-8 py-3 bg-[#3b261d] text-[#e8dac1] font-bold text-xl rounded-sm shadow-[4px_4px_0px_#1a100c] border-[2px] border-[#1a100c] uppercase tracking-widest">
            ⚜️ Sabda Dewa Terpenuhi! ⚜️
          </div>
        )}
      </div>

      {/* Tombol Map Baru */}
      <button 
        onClick={fetchNewLevel}
        className="mt-2 flex items-center gap-3 px-8 py-4 bg-[#5e3b2e] text-[#f4ebd0] border-[3px] border-[#2c1c14] font-bold text-lg rounded-sm shadow-[6px_6px_0px_#2c1c14] hover:bg-[#4a2e23] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none z-10 uppercase tracking-wide"
      >
        <span>📜</span> Buka Peta Selanjutnya
      </button>

    </main>
  );
}