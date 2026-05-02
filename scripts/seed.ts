import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedDemoUser() {
  const email = 'demo@pandoralabs.ai';
  const password = 'demo1234';

  console.log('Creating demo user...');

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes('already exists') || error.message.includes('already registered')) {
        console.log('Demo user already exists. Updating password...');
        const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        const existingUser = usersData.users.find(u => u.email === email);
        if (existingUser) {
           const { error: updateError } = await supabase.auth.admin.updateUserById(
             existingUser.id,
             { password: password, email_confirm: true }
           );
           if (updateError) throw updateError;
           console.log('Successfully updated demo user password.');
        }
      } else {
        throw error;
      }
    } else {
      console.log('Successfully created demo user:', data.user.id);
    }
  } catch (err) {
    console.error('Error seeding demo user:', err);
    process.exit(1);
  }
}

seedDemoUser();
