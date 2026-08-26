import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vwpwbtqznaukrrtydsvs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3cHdidHF6bmF1a3JydHlkc3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzY1MTAsImV4cCI6MjEwMzMxMjUxMH0.dM1VC7RMHa_hCnhcM2tpYaPCrp39fUfzlP_jNOZaJw8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);