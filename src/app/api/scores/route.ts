import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  const { data: scores, error } = await supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(scores);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, score } = body;

  if (!name || typeof score !== 'number') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];

  // 1. Insert the new score
  const { data: newScore, error: insertError } = await supabase
    .from('scores')
    .insert([{ name, email: email || '', score, date: today }])
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // 2. Calculate exact Rank (How many scores are strictly greater)
  const { count: higherCount } = await supabase
    .from('scores')
    .select('*', { count: 'exact', head: true })
    .gt('score', score);

  // 3. Get Total Participants
  const { count: totalCount } = await supabase
    .from('scores')
    .select('*', { count: 'exact', head: true });

  const rank = (higherCount || 0) + 1;
  const total = totalCount || 1;
  
  // 4. Calculate real percentile
  let percentile = 99;
  if (total > 1) {
    percentile = Math.floor(((total - rank) / total) * 100);
  }
  // Be nice to last place
  if (percentile <= 0) percentile = 1;

  return NextResponse.json({
    ...newScore,
    rank,
    percentile,
    total
  });
}
