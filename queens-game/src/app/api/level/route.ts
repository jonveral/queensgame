import { NextResponse } from 'next/server';

export interface LevelData {
  size: number;
  regions: number[][];
}

// Kumpulan Map 9x9 (memiliki 9 area region)
const levels: LevelData[] = [
  {
    size: 9,
    regions: [
      [1, 1, 2, 2, 2, 2, 2, 3, 3],
      [1, 1, 1, 2, 4, 4, 2, 3, 3],
      [1, 5, 5, 2, 4, 4, 3, 3, 3],
      [1, 5, 5, 5, 6, 4, 4, 7, 7],
      [5, 5, 8, 5, 6, 6, 7, 7, 7],
      [8, 8, 8, 8, 6, 6, 6, 7, 7],
      [8, 9, 9, 8, 8, 6, 6, 7, 7],
      [9, 9, 9, 9, 9, 6, 6, 6, 7],
      [9, 9, 9, 9, 9, 9, 9, 9, 7]
    ]
  },
  {
    size: 9,
    regions: [
      [1, 1, 1, 2, 2, 3, 3, 3, 3],
      [1, 1, 2, 2, 2, 2, 4, 3, 3],
      [1, 5, 5, 2, 6, 6, 4, 4, 3],
      [5, 5, 5, 2, 6, 4, 4, 4, 4],
      [5, 5, 7, 7, 6, 6, 4, 8, 8],
      [5, 7, 7, 7, 6, 6, 8, 8, 8],
      [9, 9, 7, 7, 6, 8, 8, 8, 8],
      [9, 9, 7, 7, 6, 8, 8, 8, 8],
      [9, 9, 9, 9, 6, 6, 6, 6, 6]
    ]
  },
  {
    size: 9,
    regions: [
      [1, 1, 2, 2, 2, 2, 3, 3, 3],
      [1, 1, 1, 2, 4, 4, 3, 3, 3],
      [5, 1, 1, 4, 4, 4, 4, 6, 6],
      [5, 5, 1, 7, 7, 4, 6, 6, 6],
      [5, 5, 7, 7, 7, 4, 8, 6, 6],
      [5, 5, 7, 9, 9, 8, 8, 8, 8],
      [5, 5, 7, 9, 9, 9, 9, 8, 8],
      [5, 7, 7, 7, 7, 9, 9, 8, 8],
      [5, 5, 5, 5, 5, 9, 9, 9, 8]
    ]
  },
  {
    size: 9,
    regions: [
      [1, 1, 1, 1, 1, 2, 2, 2, 2],
      [3, 3, 3, 1, 1, 2, 4, 4, 2],
      [3, 3, 3, 1, 5, 5, 4, 4, 4],
      [3, 6, 3, 1, 5, 5, 4, 7, 7],
      [6, 6, 6, 1, 5, 5, 4, 7, 7],
      [6, 8, 6, 5, 5, 9, 9, 7, 7],
      [6, 8, 8, 8, 5, 9, 9, 9, 7],
      [6, 6, 8, 8, 5, 5, 9, 7, 7],
      [6, 6, 6, 6, 6, 6, 9, 9, 9]
    ]
  }
];

export async function GET() {
  const randomIndex = Math.floor(Math.random() * levels.length);
  const selectedLevel = levels[randomIndex];

  const response = NextResponse.json(selectedLevel);
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  
  return response;
}