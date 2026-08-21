# Stable Checkpoint - August 21

**Latest Stable Commit Hash:** `a56a0af5fb045f891a9436cf64a7f1a15d22b887`
*(If the codebase breaks in the future, you can use `git reset --hard a56a0af` to revert to this exact working state).*

## Key Mechanics & Fixes to Remember

If another agent accidentally overwrites these files, here is the exact logic we implemented to make the game flawless:

### 1. The Vercel Caching Issue (API Routes)
*   **Files:** `src/app/api/questions/route.ts` & `src/app/api/scores/route.ts`
*   **The Fix:** Next.js heavily caches `GET` endpoints in production. We had to explicitly add `export const dynamic = 'force-dynamic';` at the top of these API routes to ensure the Single Player pool and the Global Leaderboard fetch real-time data from the Supabase database instead of freezing at the build-time state.

### 2. Single Player Anti-Repetition
*   **File:** `src/app/play/page.tsx`
*   **The Fix:** We completely removed the hardcoded `LOGOS` array import. The game now fetches from `/api/questions` dynamically. We implemented a system using browser `localStorage` (key: `mtcSeenLogos`) to track which UUIDs the player has already seen, filtering them out of the pool for consecutive "Play Again" rounds until the entire database is exhausted.
*   **Play Again Logic:** Safely resets the guess input (`setGuess('')`), score, and timer without remounting the page, ensuring a smooth transition back to the countdown while fetching a fresh batch of unseen logos.

### 3. Multiplayer Concurrent Guessing (Race Conditions)
*   **File:** `src/app/api/games/guess/route.ts`
*   **The Fix:** When an entire classroom submits a guess at the exact same millisecond, Supabase would overwrite scores. We fixed this using **Optimistic Locking** in a `while (retries > 0)` loop. The query uses `.eq('guesses', JSON.stringify(game.guesses))` so if two students submit simultaneously, one query safely bounces back, re-reads the updated state, and merges their points seamlessly.

### 4. Multiplayer "Ghost Kicking"
*   **File:** `src/app/join/page.tsx`
*   **The Fix:** Mobile keyboards often add trailing spaces (e.g., `"John "`). The API trimmed this, but the local React state did not, causing a mismatch that falsely triggered the "Host kicked you" logic. Fixed by ensuring strict `.trim().toLowerCase()` matching in the Supabase realtime subscription handler.

### 5. UI & Styling
*   **Admin Button:** Changed from `absolute` to `fixed` so it correctly anchors to the top-right of the viewport.
*   **MTC Promo Box:** Restored to the Brutalist Dark aesthetic (`bg-[#111]`, thin border) on the homepage, while keeping the full brutalist block aesthetic on the dedicated `/leaderboard` page.
*   **Game Over Screen:** Tightened paddings and margins specifically on mobile breakpoints (`sm:p-6`, etc.) so the final score doesn't overflow or require scrolling.
*   **Emojis:** Used base Noto Emojis (removing complex ZWJ/Skin-tone sequences like `1f937_1f3fd_200d_2642_fe0f` -> `1f937`) to ensure reliable image rendering from the Google Fonts CDN.

---
**Resources Noted:**
*   Animated Noto Emojis Reference: [https://googlefonts.github.io/noto-emoji-animation/](https://googlefonts.github.io/noto-emoji-animation/)
