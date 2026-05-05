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

  // Palet warna vintage yang lebih harmonis dan elegan
  const regionColors: Record<number, string> = {
    1: "bg-[#e8dac1]", 2: "bg-[#d4c6a9]", 3: "bg-[#c4b597]",
    4: "bg-[#dcd1be]", 5: "bg-[#cfc1af]", 6: "bg-[#b8b2a1]",
    7: "bg-[#d6c2b5]", 8: "bg-[#c7bcb1]", 9: "bg-[#e0d2c5]"
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
      <div className="flex justify-center items-center h-screen bg-[#ece4d0] font-serif text-[#4a332a]">
        <div className="animate-pulse text-lg font-medium tracking-widest uppercase">
          Membuka Gulungan Peta...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f2ebe1] to-[#dfd3b8] font-serif flex flex-col items-center py-10 text-[#3e2723] overflow-x-hidden relative">
      
      {/* Efek Tekstur Kasar (Noise) - Sangat Halus */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

      {/* Header Judul (Diperkecil dan Lebih Elegan) */}
      <div className="text-center mb-8 z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-[#a69584] text-xl">⚜</span>
          <h1 className="text-2xl md:text-3xl font-black text-[#3b261d] tracking-[0.2em] uppercase">
            QueenAnakDewa
          </h1>
          <span className="text-[#a69584] text-xl">⚜</span>
        </div>
        <p className="text-xs md:text-sm font-medium text-[#6a4f40] max-w-sm px-4 italic leading-relaxed mx-auto">
          "Tempatkan 1 Ratu di setiap baris, kolom, dan wilayah. Para Ratu dilarang saling menatap, bahkan secara menyilang."
        </p>
      </div>

      {/* Kontrol Atas (Ramping dan Proporsional) */}
      <div className="flex gap-3 mb-6 z-10">
        <button 
          onClick={handleUndo} 
          disabled={history.length === 0}
          className={`flex items-center gap-1.5 px-4 py-1.5 border-2 border-[#4a332a] text-sm font-semibold rounded-sm transition-all shadow-sm
            ${history.length === 0 
              ? "bg-[#dcd1be] text-[#a09383] border-[#a09383] opacity-50 cursor-not-allowed" 
              : "bg-[#f2ebe1] text-[#4a332a] hover:bg-[#e8dac1] active:scale-95"}`}
        >
          <span className="text-base">↶</span> Urungkan
        </button>
        <button 
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#f2ebe1] text-[#802a2a] border-2 border-[#4a332a] text-sm font-semibold rounded-sm hover:bg-[#e8dac1] transition-all shadow-sm active:scale-95"
        >
          <span className="text-base">↻</span> Bersihkan
        </button>
      </div>

      {/* Grid Game Container (Bingkai Ramping) */}
      <div className="p-2 md:p-3 bg-[#c7bcb1] rounded shadow-lg border-2 border-[#4a332a] z-10">
        <div 
          className="grid border-[6px] border-[#1a100c] bg-[#1a100c]"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {board.map((row, r) =>
            row.map((cellValue, c) => {
              const regionId = regions[r][c];
              const isError = errors.has(`${r},${c}`);
              
              // Pembatas region dipertahankan TEBAL (4px)
              const borderTop = r === 0 || regions[r - 1][c] !== regionId ? "border-t-[4px] border-t-[#1a100c]" : "";
              const borderBottom = r === size - 1 || regions[r + 1][c] !== regionId ? "border-b-[4px] border-b-[#1a100c]" : "";
              const borderLeft = c === 0 || regions[r][c - 1] !== regionId ? "border-l-[4px] border-l-[#1a100c]" : "";
              const borderRight = c === size - 1 || regions[r][c + 1] !== regionId ? "border-r-[4px] border-r-[#1a100c]" : "";

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`
                    w-9 h-9 sm:w-11 sm:h-11 flex justify-center items-center text-lg sm:text-2xl cursor-pointer select-none transition-colors border border-[#a69986]/30 shadow-inner
                    ${regionColors[regionId]} 
                    ${borderTop} ${borderBottom} ${borderLeft} ${borderRight}
                    ${isError ? "bg-[#c66868] animate-pulse border-[#7a2828] z-10" : "hover:brightness-95"}
                  `}
                >
                  {cellValue === 1 && <span className="text-[#8c7b6d] font-bold opacity-80">✖</span>}
                  {cellValue === 2 && <span className="text-[#6b1e1e] drop-shadow-sm">♛</span>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Area Pesan Kemenangan (Lebih Kalem) */}
      <div className="h-12 mt-6 flex items-center justify-center z-10">
        {isWin && (
          <div className="animate-fade-in-up px-6 py-2 bg-[#4a332a] text-[#f2ebe1] font-semibold text-sm rounded shadow-md border border-[#2c1c14] tracking-wider uppercase">
            ⚜ Peta Telah Dipecahkan ⚜
          </div>
        )}
      </div>

      {/* Tombol Map Baru */}
      <button 
        onClick={fetchNewLevel}
        className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-[#4a332a] text-[#f2ebe1] border-2 border-[#2c1c14] text-sm font-semibold rounded shadow-md hover:bg-[#36241e] transition-all active:scale-95 z-10 uppercase tracking-wide"
      >
        <span>📜</span> Peta Selanjutnya
      </button>

      {/* Custom Keyframe untuk animasi menang yang halus */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
}