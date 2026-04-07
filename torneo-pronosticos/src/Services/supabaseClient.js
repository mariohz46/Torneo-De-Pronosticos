
import { createClient } from '@supabase/supabase-js'

const subpabaseUrl = import.meta.env.VITE_projectURL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(subpabaseUrl,supabaseKey);

export default supabase;