import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
    console.log("Logging in as admin...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'rakshakmaharashtra@gmail.com',
        password: 'Marathi@Admin123'
    });

    if (authError) {
        console.error("Login failed:", authError.message);
        return;
    }
    console.log("Logged in!", authData.user.id);

    console.log("Fetching shops...");
    const { data: shops, error: shopsError } = await supabase
        .from('shops')
        .select('*');

    if (shopsError) {
        console.error("Fetch failed:", shopsError.message);
        return;
    }

    console.log(`Found ${shops.length} total shops.`);
    console.log(`Pending shops: ${shops.filter(s => s.status === 'pending').length}`);
    console.log(`Approved shops: ${shops.filter(s => s.status === 'approved').length}`);
}

run();
