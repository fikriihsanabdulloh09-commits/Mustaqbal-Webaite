// Create First Admin User
// Run with: node scripts/create-first-admin.js

require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('         CREATE FIRST ADMIN USER - CMS SEKOLAH            ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // Get user input
    console.log('📝 Masukkan informasi admin pertama:\n');

    const email = await question('Email: ');
    const password = await question('Password (min 6 karakter): ');
    const fullName = await question('Nama Lengkap: ');

    console.log('');
    console.log('⏳ Membuat admin user...\n');

    // Step 1: Sign up user (this will trigger auto-create in admin_users)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          full_name: fullName.trim(),
          role: 'admin' // This will be used by trigger
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️  User sudah terdaftar, mencoba promote ke admin...\n');

        // User exists, just promote to admin
        const { data: promoteData, error: promoteError } = await supabase.rpc('promote_to_admin', {
          user_email: email.trim()
        });

        if (promoteError) {
          throw new Error(`Gagal promote user: ${promoteError.message}`);
        }

        console.log('✅ User berhasil dipromote ke admin!');
      } else {
        throw authError;
      }
    } else {
      console.log('✅ User berhasil dibuat di auth.users');
      console.log(`   User ID: ${authData.user.id}`);

      // Wait a bit for trigger to execute
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify admin_users record was created
      const { data: adminCheck, error: checkError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (checkError) {
        console.log('⚠️  Peringatan: admin_users record belum dibuat otomatis');
        console.log('   Mencoba membuat manual...\n');

        // Manually create admin_users record
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({
            id: authData.user.id,
            email: email.trim(),
            full_name: fullName.trim(),
            role: 'admin'
          });

        if (insertError) {
          throw new Error(`Gagal membuat admin_users record: ${insertError.message}`);
        }

        console.log('✅ admin_users record berhasil dibuat manual');
      } else {
        console.log('✅ admin_users record otomatis dibuat');
        console.log(`   Role: ${adminCheck.role}`);

        // If role is not admin, promote
        if (adminCheck.role !== 'admin') {
          console.log('   Promoting to admin...');
          await supabase.rpc('promote_to_admin', { user_email: email.trim() });
          console.log('✅ Promoted to admin');
        }
      }
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                    🎉 BERHASIL!                           ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('Admin user berhasil dibuat dengan informasi:');
    console.log(`  Email: ${email}`);
    console.log(`  Nama: ${fullName}`);
    console.log(`  Role: admin`);
    console.log('');
    console.log('Anda sekarang bisa login ke CMS Admin:');
    console.log('  URL: http://localhost:3000/admin/login');
    console.log(`  Email: ${email}`);
    console.log(`  Password: (yang Anda masukkan)`);
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ ERROR:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Pastikan Supabase project aktif');
    console.error('2. Pastikan email confirmation DISABLED di Supabase Auth settings');
    console.error('3. Cek .env file sudah benar (NEXT_PUBLIC_SUPABASE_URL & KEY)');
    console.error('4. Pastikan migration sudah di-apply');
    console.error('');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Check connection first
async function checkConnection() {
  console.log('🔍 Checking database connection...\n');

  try {
    const { data, error } = await supabase.from('settings').select('count');
    if (error) throw error;
    console.log('✅ Database connected\n');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('   Check your .env file and Supabase project status\n');
    process.exit(1);
  }
}

async function main() {
  await checkConnection();
  await createAdmin();
}

main();
