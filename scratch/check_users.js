
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .limit(10);

  if (error) {
    console.error("Error fetching users:", error.message);
  } else {
    console.log("Users found:", JSON.stringify(data, null, 2));
  }
}

checkUsers();
