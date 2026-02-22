require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

(async () => {
    console.log('Authenticating...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'testedit@example.com',
        password: 'password',
    });
    if (authError) return console.error('Auth error:', authError.message);

    console.log('User ID:', authData.user.id);
    const shopData = {
        name: 'CJS Test Shop',
        owner_name: 'Owner',
        category: 'Food',
        description: 'Testing',
        position: [19.0, 72.0],
        status: 'pending',
        submittedBy: 'Test User',
        submittedByEmail: 'testedit@example.com',
        submittedById: authData.user.id
    };

    console.log('Inserting shop...');
    const { data, error } = await supabase.from('shops').insert([shopData]).select().single();

    if (error) {
        console.error('INSERT ERROR CAPTURED:');
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log('Success:', data);
    }
})();
