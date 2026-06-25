import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Mock user ID for development — replace with real auth later
export const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001'
