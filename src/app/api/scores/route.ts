import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'scores.json');

// Initialize DB if not exists
async function initDb() {
  try {
    await fs.access(dbPath);
  } catch (e) {
    await fs.writeFile(dbPath, JSON.stringify([]));
  }
}

export async function GET() {
  await initDb();
  const data = await fs.readFile(dbPath, 'utf8');
  const scores = JSON.parse(data);
  // Sort descending by score
  scores.sort((a: any, b: any) => b.score - a.score);
  return NextResponse.json(scores.slice(0, 50)); // Top 50
}

export async function POST(req: Request) {
  await initDb();
  const body = await req.json();
  const { name, email, score } = body;

  if (!name || typeof score !== 'number') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const data = await fs.readFile(dbPath, 'utf8');
  const scores = JSON.parse(data);

  const today = new Date().toISOString().split('T')[0];

  const newScore = {
    id: Date.now().toString(),
    name,
    email: email || '',
    score,
    date: today
  };

  scores.push(newScore);
  await fs.writeFile(dbPath, JSON.stringify(scores, null, 2));

  return NextResponse.json(newScore);
}
