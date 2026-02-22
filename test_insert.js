import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'd:/marathi-shops-map/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSubmit() {
    // 1. Authenticate as the test user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'testedit@example.com',
        password: 'password',
    });

    if (authError) {
        console.error('Auth Error:', authError.message);
        return;
    }

    console.log('Logged in as:', authData.user.id);

    // 2. Try to insert a shop
    const shopData = {
        name: 'Node Script Test Shop',
        owner_name: 'Test Owner',
        category: 'Food',
        description: 'Testing the insert policy from node script',
        position: [19.0760, 72.8777],
        status: 'pending',
        submittedBy: 'Test Edit User',
        submittedByEmail: 'testedit@example.com',
        submittedById: authData.user.id
    };

    const { data, error } = await supabase
        .from('shops')
        .insert([shopData])
        .select()
        .single();

    if (error) {
        console.error('Insert Error:', error);
    } else {
        console.log('Inserted successfully:', data);
    }
}

testSubmit();
