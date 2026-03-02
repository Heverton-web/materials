import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('supabase_url');
  const localKey = localStorage.getItem('supabase_anon_key');
  
  return {
    url: import.meta.env.VITE_SUPABASE_URL || localUrl || 'https://placeholder-url.supabase.co',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || localKey || 'placeholder-key'
  };
};

const { url, key } = getSupabaseConfig();
export const supabase = createClient(url, key);

