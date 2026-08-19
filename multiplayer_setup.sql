-- Create the active_game table to store the master multiplayer state
CREATE TABLE IF NOT EXISTS public.active_game (
  id integer PRIMARY KEY DEFAULT 1,
  status text NOT NULL DEFAULT 'waiting', -- 'waiting', 'playing', 'finished'
  round integer NOT NULL DEFAULT 0,       -- which question number out of 10
  logos jsonb NOT NULL DEFAULT '[]'::jsonb -- the 10 shuffled logos for the match
);

-- Insert the single master row that all players will connect to
INSERT INTO public.active_game (id, status, round, logos) 
VALUES (1, 'waiting', 0, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Enable Realtime so WebSockets can listen to changes on this table instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_game;

ALTER TABLE public.active_game ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the game state
CREATE POLICY "Allow anonymous read access to active_game"
  ON public.active_game
  FOR SELECT
  TO anon
  USING (true);

-- Allow admins to update the game state (we will restrict this properly later, but keeping it open for dev)
CREATE POLICY "Allow anonymous update to active_game"
  ON public.active_game
  FOR UPDATE
  TO anon
  USING (true);
