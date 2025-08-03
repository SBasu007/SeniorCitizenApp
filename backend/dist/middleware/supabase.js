import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}
/**
 * This is the supabase client that is used to interact with the supabase database.
 * @param supabaseUrl - The url of the supabase database.
 * @param supabaseKey - The key of the supabase database.
 * @exports supabase client
 */
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
