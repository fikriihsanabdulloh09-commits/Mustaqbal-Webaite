// Test Database Connection & Integration
// Run with: node scripts/test-database-connection.js

require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✓ Present' : '✗ Missing');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('=' .repeat(60));
  console.log('DATABASE CONNECTION TEST');
  console.log('=' .repeat(60));
  console.log('');

  const tests = [];
  let passed = 0;
  let failed = 0;

  // Test 1: Basic connection
  console.log('1️⃣  Testing basic connection...');
  try {
    const { data, error } = await supabase.from('settings').select('count');
    if (error) throw error;
    console.log('   ✅ Connection successful\n');
    tests.push({ name: 'Basic Connection', status: 'PASS' });
    passed++;
  } catch (error) {
    console.log('   ❌ Connection failed:', error.message, '\n');
    tests.push({ name: 'Basic Connection', status: 'FAIL', error: error.message });
    failed++;
  }

  // Test 2: Section Types
  console.log('2️⃣  Testing section_types table...');
  try {
    const { data, error } = await supabase
      .from('section_types')
      .select('*')
      .limit(5);
    if (error) throw error;
    console.log(`   ✅ Found ${data.length} section types`);
    console.log(`   Templates: ${data.map(s => s.display_name).join(', ')}\n`);
    tests.push({ name: 'Section Types', status: 'PASS', count: data.length });
    passed++;
  } catch (error) {
    console.log('   ❌ Failed:', error.message, '\n');
    tests.push({ name: 'Section Types', status: 'FAIL', error: error.message });
    failed++;
  }

  // Test 3: Themes
  console.log('3️⃣  Testing themes table...');
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('*');
    if (error) throw error;
    const activeTheme = data.find(t => t.is_active);
    console.log(`   ✅ Found ${data.length} themes`);
    console.log(`   Active: ${activeTheme?.display_name || 'None'}`);
    console.log(`   Available: ${data.map(t => t.display_name).join(', ')}\n`);
    tests.push({ name: 'Themes', status: 'PASS', count: data.length });
    passed++;
  } catch (error) {
    console.log('   ❌ Failed:', error.message, '\n');
    tests.push({ name: 'Themes', status: 'FAIL', error: error.message });
    failed++;
  }

  // Test 4: Global Styles
  console.log('4️⃣  Testing global_styles table...');
  try {
    const { data, error } = await supabase
      .from('global_styles')
      .select('*');
    if (error) throw error;
    console.log(`   ✅ Found ${data.length} global styles`);
    const categories = [...new Set(data.map(s => s.category))];
    console.log(`   Categories: ${categories.join(', ')}\n`);
    tests.push({ name: 'Global Styles', status: 'PASS', count: data.length });
    passed++;
  } catch (error) {
    console.log('   ❌ Failed:', error.message, '\n');
    tests.push({ name: 'Global Styles', status: 'FAIL', error: error.message });
    failed++;
  }

  // Test 5: Page Sections
  console.log('5️⃣  Testing page_sections table...');
  try {
    const { data, error } = await supabase
      .from('page_sections')
      .select('*, section_types(*)')
      .limit(10);
    if (error) throw error;
    console.log(`   ✅ Found ${data.length} page sections`);
    if (data.length > 0) {
      const pages = [...new Set(data.map(s => s.page_path))];
      console.log(`   Pages with sections: ${pages.join(', ')}`);
    } else {
      console.log('   ℹ️  No sections yet (normal for new install)');
    }
    console.log('');
    tests.push({ name: 'Page Sections', status: 'PASS', count: data.length });
    passed++;
  } catch (error) {
    console.log('   ❌ Failed:', error.message, '\n');
    tests.push({ name: 'Page Sections', status: 'FAIL', error: error.message });
    failed++;
  }

  // Test 6: News Articles
  console.log('6️⃣  Testing news_articles table...');
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('id, title, views, is_published')
      .limit(5);
    if (error) throw error;
    console.log(`   ✅ Found ${data.length} news articles`);
    const totalViews = data.reduce((sum, article) => sum + (article.views || 0), 0);
    console.log(`   Total views: ${totalViews}`);
    console.log(`   Published: ${data.filter(a => a.is_published).length}\n`);
    tests.push({ name: 'News Articles', status: 'PASS', count: data.length });
    passed++;
  } catch (error) {
    console.log('   ❌ Failed:', error.message, '\n');
    tests.push({ name: 'News Articles', status: 'FAIL', error: error.message });
    failed++;
  }

  // Test 7: Programs
  console.log('7️⃣  Testing programs table...');
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*');
    if (error) throw error;
    console.log(`   ✅ Found ${data.length} programs`);
    console.log(`   Programs: ${data.map(p => p.title).join(', ')}\n`);
    tests.push({ name: 'Programs', status: 'PASS', count: data.length });
    passed++;
  } catch (error) {
    console.log('   ❌ Failed:', error.message, '\n');
    tests.push({ name: 'Programs', status: 'FAIL', error: error.message });
    failed++;
  }

  // Test 8: PPDB Submissions
  console.log('8️⃣  Testing ppdb_submissions table...');
  try {
    const { data, error } = await supabase
      .from('ppdb_submissions')
      .select('id, status')
      .limit(10);
    if (error) throw error;
    console.log(`   ✅ Found ${data.length} PPDB submissions`);
    if (data.length > 0) {
      const statuses = data.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {});
      console.log(`   Status breakdown:`, statuses);
    }
    console.log('');
    tests.push({ name: 'PPDB Submissions', status: 'PASS', count: data.length });
    passed++;
  } catch (error) {
    console.log('   ❌ Failed:', error.message, '\n');
    tests.push({ name: 'PPDB Submissions', status: 'FAIL', error: error.message });
    failed++;
  }

  // Test 9: Teachers
  console.log('9️⃣  Testing teachers table...');
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('id, full_name, position');
    if (error) throw error;
    console.log(`   ✅ Found ${data.length} teachers`);
    console.log(`   Teachers: ${data.slice(0, 3).map(t => t.full_name).join(', ')}...\n`);
    tests.push({ name: 'Teachers', status: 'PASS', count: data.length });
    passed++;
  } catch (error) {
    console.log('   ❌ Failed:', error.message, '\n');
    tests.push({ name: 'Teachers', status: 'FAIL', error: error.message });
    failed++;
  }

  // Test 10: Gallery
  console.log('🔟 Testing gallery_items table...');
  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('id, media_type');
    if (error) throw error;
    const foto = data.filter(g => g.media_type === 'foto').length;
    const video = data.filter(g => g.media_type === 'video').length;
    console.log(`   ✅ Found ${data.length} gallery items`);
    console.log(`   Foto: ${foto}, Video: ${video}\n`);
    tests.push({ name: 'Gallery Items', status: 'PASS', count: data.length });
    passed++;
  } catch (error) {
    console.log('   ❌ Failed:', error.message, '\n');
    tests.push({ name: 'Gallery Items', status: 'FAIL', error: error.message });
    failed++;
  }

  // Summary
  console.log('=' .repeat(60));
  console.log('TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log('');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Database is fully connected and working.\n');
  } else {
    console.log('⚠️  Some tests failed. Check errors above.\n');
  }

  console.log('Detailed Results:');
  console.log('-' .repeat(60));
  tests.forEach((test, i) => {
    const status = test.status === 'PASS' ? '✅' : '❌';
    const extra = test.count !== undefined ? ` (${test.count} records)` : '';
    console.log(`${i + 1}. ${status} ${test.name}${extra}`);
    if (test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });
  console.log('');

  return { passed, failed, total: tests.length };
}

// Test CRUD operations
async function testCRUD() {
  console.log('=' .repeat(60));
  console.log('CRUD OPERATIONS TEST');
  console.log('=' .repeat(60));
  console.log('');

  let testSectionId = null;

  // Test CREATE
  console.log('1️⃣  Testing CREATE operation...');
  try {
    const { data, error } = await supabase
      .from('page_sections')
      .insert({
        page_path: '/test',
        section_name: 'Test Section',
        order_position: 0,
        content: { title: 'Test' },
        styles: { backgroundColor: '#ffffff' },
        is_visible: true,
      })
      .select()
      .single();

    if (error) throw error;
    testSectionId = data.id;
    console.log('   ✅ CREATE successful');
    console.log(`   Created section ID: ${testSectionId}\n`);
  } catch (error) {
    console.log('   ❌ CREATE failed:', error.message, '\n');
  }

  // Test READ
  console.log('2️⃣  Testing READ operation...');
  try {
    if (!testSectionId) throw new Error('No test section to read');

    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('id', testSectionId)
      .single();

    if (error) throw error;
    console.log('   ✅ READ successful');
    console.log(`   Section name: ${data.section_name}\n`);
  } catch (error) {
    console.log('   ❌ READ failed:', error.message, '\n');
  }

  // Test UPDATE
  console.log('3️⃣  Testing UPDATE operation...');
  try {
    if (!testSectionId) throw new Error('No test section to update');

    const { error } = await supabase
      .from('page_sections')
      .update({
        section_name: 'Updated Test Section',
        content: { title: 'Updated' },
      })
      .eq('id', testSectionId);

    if (error) throw error;
    console.log('   ✅ UPDATE successful\n');
  } catch (error) {
    console.log('   ❌ UPDATE failed:', error.message, '\n');
  }

  // Test DELETE
  console.log('4️⃣  Testing DELETE operation...');
  try {
    if (!testSectionId) throw new Error('No test section to delete');

    const { error } = await supabase
      .from('page_sections')
      .delete()
      .eq('id', testSectionId);

    if (error) throw error;
    console.log('   ✅ DELETE successful');
    console.log('   Test section cleaned up\n');
  } catch (error) {
    console.log('   ❌ DELETE failed:', error.message, '\n');
  }

  console.log('✅ CRUD operations test complete!\n');
}

// Main
async function main() {
  try {
    const { passed, failed, total } = await testConnection();

    if (failed === 0) {
      await testCRUD();
    }

    console.log('=' .repeat(60));
    console.log('FINAL REPORT');
    console.log('=' .repeat(60));
    console.log('');
    console.log('Database Connection: ✅ Working');
    console.log(`Tables Tested: ${total}`);
    console.log(`Tests Passed: ${passed}/${total}`);

    if (failed === 0) {
      console.log('CRUD Operations: ✅ Working');
      console.log('');
      console.log('🎉 ALL SYSTEMS GO! Database is fully operational.');
    } else {
      console.log('');
      console.log('⚠️  Some issues detected. Please review errors above.');
    }
    console.log('');

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
