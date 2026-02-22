import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vapdeptxhuubshvdswrp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhcGRlcHR4aHV1YnNodmRzd3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDQ1MDgsImV4cCI6MjA4Njk4MDUwOH0.M8xFa4C4xTcy1hUs6fOCGdlo6lpJd6VBF9K01NDKbfI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
