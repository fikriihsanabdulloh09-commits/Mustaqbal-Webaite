// Seed Database with Default Data
// Run with: node scripts/seed-database.js

require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Settings
    console.log('1️⃣  Seeding settings...');
    const settings = [
      {
        key: 'school_basic_info',
        value: {
          school_name: 'SMK Mustaqbal',
          tagline: 'Mencetak Generasi Unggul & Berakhlak Mulia',
          address: 'Jl. Pendidikan No. 123, Bandung, Jawa Barat 40123',
          phone: '022-1234567',
          email: 'info@smkmustaqbal.sch.id',
          whatsapp: '6281234567890',
          principal_name: 'Drs. H. Ahmad Hidayat, M.Pd',
          accreditation: 'A',
          npsn: '20219876',
          established_year: 2010
        },
        description: 'Informasi dasar sekolah'
      },
      {
        key: 'social_media_links',
        value: {
          instagram: 'https://instagram.com/smkmustaqbal',
          facebook: 'https://facebook.com/SMKMustaqbal',
          youtube: 'https://youtube.com/@SMKMustaqbalOfficial',
          tiktok: 'https://tiktok.com/@smkmustaqbal'
        },
        description: 'Link social media'
      }
    ];

    for (const setting of settings) {
      const { error } = await supabase
        .from('settings')
        .upsert(setting, { onConflict: 'key' });
      if (error) console.error('  Error:', error.message);
    }
    console.log('  ✅ Settings seeded\n');

    // 2. Categories
    console.log('2️⃣  Seeding categories...');
    const categories = [
      { name: 'Acara Sekolah', slug: 'acara-sekolah', description: 'Kegiatan sekolah', color: '#0d9488' },
      { name: 'Pengumuman', slug: 'pengumuman', description: 'Pengumuman penting', color: '#dc2626' },
      { name: 'Prestasi', slug: 'prestasi', description: 'Pencapaian siswa', color: '#f59e0b' },
      { name: 'Artikel', slug: 'artikel', description: 'Artikel pendidikan', color: '#3b82f6' }
    ];

    for (const category of categories) {
      const { error } = await supabase
        .from('categories')
        .upsert(category, { onConflict: 'slug' });
      if (error && !error.message.includes('duplicate')) {
        console.error('  Error:', error.message);
      }
    }
    console.log('  ✅ Categories seeded\n');

    // 3. Menu Links
    console.log('3️⃣  Seeding menu links...');
    const menuLinks = [
      { title: 'Beranda', href: '/', position: 1, icon: 'Home', is_active: true },
      { title: 'Program', href: '/program', position: 2, icon: 'GraduationCap', is_active: true },
      { title: 'Berita', href: '/berita', position: 3, icon: 'Newspaper', is_active: true },
      { title: 'Galeri', href: '/galeri', position: 4, icon: 'Images', is_active: true },
      { title: 'PPDB', href: '/ppdb', position: 5, icon: 'UserPlus', is_active: true },
      { title: 'Kontak', href: '/kontak', position: 6, icon: 'Phone', is_active: true }
    ];

    const { error: menuError } = await supabase
      .from('menu_links')
      .upsert(menuLinks, { onConflict: 'href', ignoreDuplicates: true });
    if (menuError) console.error('  Error:', menuError.message);
    console.log('  ✅ Menu links seeded\n');

    // 4. Achievements
    console.log('4️⃣  Seeding achievements...');
    const achievements = [
      {
        title: 'Juara 1 LKS Web Development Kota Bandung',
        slug: 'juara-1-lks-web-dev-2024',
        student_name: 'Ahmad Rizki Pratama',
        category: 'teknologi',
        level: 'kota',
        rank: 'Juara 1',
        year: 2024,
        event_date: '2024-08-15',
        description: 'Berhasil meraih juara 1 kompetisi web development dengan aplikasi e-commerce modern',
        image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
        is_featured: true
      },
      {
        title: 'Medali Emas OSN Informatika Provinsi',
        slug: 'medali-emas-osn-informatika-2024',
        student_name: 'Siti Nurhaliza',
        category: 'akademik',
        level: 'provinsi',
        rank: 'Medali Emas',
        year: 2024,
        event_date: '2024-05-20',
        description: 'Meraih medali emas OSN Informatika Jawa Barat',
        image_url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800',
        is_featured: true
      },
      {
        title: 'Best Innovation Award Robotics National',
        slug: 'best-innovation-robotics-2024',
        student_name: 'Tim Robotika SMK Mustaqbal',
        category: 'teknologi',
        level: 'nasional',
        rank: 'Best Innovation',
        year: 2024,
        event_date: '2024-10-05',
        description: 'Robot AI dengan obstacle avoidance terbaik se-Indonesia',
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        is_featured: true
      },
      {
        title: 'Juara 2 Hackathon Mobile App',
        slug: 'juara-2-hackathon-2023',
        student_name: 'Budi Santoso & Team',
        category: 'teknologi',
        level: 'nasional',
        rank: 'Juara 2',
        year: 2023,
        event_date: '2023-11-10',
        description: 'Aplikasi mobile untuk UMKM management',
        image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
        is_featured: false
      },
      {
        title: 'Juara 1 Design Competition 3D',
        slug: 'juara-1-design-3d-2024',
        student_name: 'Dewi Lestari',
        category: 'seni',
        level: 'nasional',
        rank: 'Juara 1',
        year: 2024,
        event_date: '2024-07-22',
        description: 'Desain produk furniture eco-friendly',
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        is_featured: false
      }
    ];

    for (const achievement of achievements) {
      const { error } = await supabase
        .from('achievements')
        .upsert(achievement, { onConflict: 'slug', ignoreDuplicates: true });
      if (error && !error.message.includes('duplicate')) {
        console.error('  Error:', error.message);
      }
    }
    console.log('  ✅ Achievements seeded\n');

    // 5. Events
    console.log('5️⃣  Seeding events...');
    const events = [
      {
        title: 'Open House & School Tour 2025',
        slug: 'open-house-2025',
        description: 'Kunjungi sekolah kami dan lihat fasilitas lengkap serta program unggulan',
        event_type: 'open-house',
        start_date: '2025-01-15T08:00:00Z',
        end_date: '2025-01-15T15:00:00Z',
        location: 'SMK Mustaqbal Campus',
        organizer: 'Panitia PPDB',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        is_published: true
      },
      {
        title: 'Workshop IoT for Students',
        slug: 'workshop-iot-2025',
        description: 'Pelatihan IoT menggunakan Arduino dan ESP32',
        event_type: 'workshop',
        start_date: '2025-01-20T09:00:00Z',
        end_date: '2025-01-20T16:00:00Z',
        location: 'Lab Robotika',
        organizer: 'Jurusan Teknik Otomasi',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        is_published: true
      },
      {
        title: 'Industry Visit to Tech Company',
        slug: 'industry-visit-jan-2025',
        description: 'Kunjungan industri ke perusahaan teknologi terkemuka',
        event_type: 'field-trip',
        start_date: '2025-02-10T07:00:00Z',
        end_date: '2025-02-10T17:00:00Z',
        location: 'Jakarta',
        organizer: 'Program Studi',
        image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        is_published: true
      }
    ];

    for (const event of events) {
      const { error } = await supabase
        .from('events')
        .upsert(event, { onConflict: 'slug', ignoreDuplicates: true });
      if (error && !error.message.includes('duplicate')) {
        console.error('  Error:', error.message);
      }
    }
    console.log('  ✅ Events seeded\n');

    // 6. Announcements
    console.log('6️⃣  Seeding announcements...');
    const announcements = [
      {
        title: 'Libur Semester Ganjil 2024/2025',
        content: 'Libur semester ganjil akan dimulai tanggal 20 Desember 2024 sampai 5 Januari 2025. Masuk kembali tanggal 6 Januari 2025.',
        priority: 'high',
        start_date: '2024-12-20T00:00:00Z',
        end_date: '2025-01-05T23:59:59Z',
        is_active: true
      },
      {
        title: 'Pendaftaran PPDB Gelombang 1 Dibuka',
        content: 'Pendaftaran PPDB gelombang 1 tahun ajaran 2025/2026 telah dibuka. Daftar sekarang dan dapatkan diskon biaya pendaftaran!',
        priority: 'high',
        start_date: '2025-01-01T00:00:00Z',
        end_date: '2025-03-31T23:59:59Z',
        link_url: '/ppdb',
        link_text: 'Daftar Sekarang',
        is_active: true
      },
      {
        title: 'Info Beasiswa Prestasi 2025',
        content: 'Tersedia beasiswa penuh untuk siswa berprestasi. Informasi lengkap hubungi bagian kesiswaan.',
        priority: 'normal',
        is_active: true
      }
    ];

    for (const announcement of announcements) {
      const { error } = await supabase
        .from('announcements')
        .insert(announcement);
      if (error && !error.message.includes('duplicate')) {
        console.error('  Error:', error.message);
      }
    }
    console.log('  ✅ Announcements seeded\n');

    // 7. Facilities
    console.log('7️⃣  Seeding facilities...');
    const facilities = [
      {
        name: 'Lab Komputer',
        slug: 'lab-komputer',
        description: 'Dilengkapi 40 unit komputer modern dengan spesifikasi tinggi untuk pembelajaran programming',
        category: 'laboratory',
        image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        specifications: {
          capacity: 40,
          features: ['AC', 'Proyektor', 'Whiteboard Digital', 'High-Speed Internet']
        },
        is_active: true,
        order_position: 1
      },
      {
        name: 'Lab Robotika & Otomasi',
        slug: 'lab-robotika',
        description: 'Laboratorium lengkap untuk praktek robotika, IoT, dan sistem otomasi industri',
        category: 'laboratory',
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        specifications: {
          capacity: 30,
          features: ['Robot Kit', 'Arduino & ESP32', 'PLC Trainer', '3D Printer']
        },
        is_active: true,
        order_position: 2
      },
      {
        name: 'Studio Multimedia & 3D Design',
        slug: 'studio-multimedia',
        description: 'Studio modern untuk desain grafis, video editing, dan 3D modeling',
        category: 'laboratory',
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        specifications: {
          capacity: 35,
          features: ['iMac Pro', 'Wacom Tablet', 'Green Screen', 'Professional Camera']
        },
        is_active: true,
        order_position: 3
      },
      {
        name: 'Workshop Elektronika',
        slug: 'workshop-elektronika',
        description: 'Workshop untuk praktek elektronika dan assembly',
        category: 'workshop',
        image_url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
        specifications: {
          capacity: 25,
          features: ['Soldering Station', 'Multimeter', 'Oscilloscope', 'Power Supply']
        },
        is_active: true,
        order_position: 4
      },
      {
        name: 'Perpustakaan Digital',
        slug: 'perpustakaan',
        description: 'Perpustakaan modern dengan koleksi buku lengkap dan akses digital library',
        category: 'library',
        image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
        specifications: {
          capacity: 100,
          features: ['10.000+ Books', 'E-Library Access', 'Study Rooms', 'Free WiFi']
        },
        is_active: true,
        order_position: 5
      }
    ];

    for (const facility of facilities) {
      const { error } = await supabase
        .from('facilities')
        .upsert(facility, { onConflict: 'slug', ignoreDuplicates: true });
      if (error && !error.message.includes('duplicate')) {
        console.error('  Error:', error.message);
      }
    }
    console.log('  ✅ Facilities seeded\n');

    // 8. More Testimonials
    console.log('8️⃣  Seeding additional testimonials...');
    const newTestimonials = [
      {
        name: 'Budi Santoso',
        program: 'Web Dev & Digital Marketing',
        graduation_year: 2023,
        current_position: 'Frontend Developer',
        company: 'Gojek',
        role: 'Alumni',
        testimonial_text: 'SMK Mustaqbal memberikan bekal skill programming yang sangat solid. Sekarang saya bekerja di Gojek sebagai Frontend Developer.',
        photo_url: 'https://i.pravatar.cc/150?img=12',
        rating: 5,
        is_featured: true
      },
      {
        name: 'Siti Rahmawati',
        program: 'Product Design & 3D',
        graduation_year: 2022,
        current_position: '3D Designer',
        company: 'Tokopedia',
        role: 'Alumni',
        testimonial_text: 'Belajar 3D modeling di SMK Mustaqbal sangat aplikatif. Guru-gurunya expert dan fasilitasnya lengkap.',
        photo_url: 'https://i.pravatar.cc/150?img=45',
        rating: 5,
        is_featured: true
      },
      {
        name: 'Andi Wijaya',
        program: 'IT Support & Network',
        graduation_year: 2023,
        current_position: 'Network Engineer',
        company: 'Telkom Indonesia',
        role: 'Alumni',
        testimonial_text: 'Program IT Support sangat membantu saya memahami networking dan troubleshooting. Langsung kerja setelah lulus!',
        photo_url: 'https://i.pravatar.cc/150?img=33',
        rating: 5,
        is_featured: true
      },
      {
        name: 'Rina Kusuma',
        program: 'Teknik Otomasi & Robotik',
        graduation_year: 2022,
        current_position: 'Automation Engineer',
        company: 'PT. Astra Manufacturing',
        role: 'Alumni',
        testimonial_text: 'Praktikum robotika yang intensif membuat saya siap bekerja di industri. Terima kasih SMK Mustaqbal!',
        photo_url: 'https://i.pravatar.cc/150?img=26',
        rating: 5,
        is_featured: false
      }
    ];

    for (const testimonial of newTestimonials) {
      const { error } = await supabase
        .from('testimonials')
        .insert(testimonial);
      if (error && !error.message.includes('duplicate')) {
        console.error('  Error:', error.message);
      }
    }
    console.log('  ✅ Testimonials seeded\n');

    console.log('✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   - Settings: 2 records');
    console.log('   - Categories: 4 records');
    console.log('   - Menu Links: 6 records');
    console.log('   - Achievements: 5 records');
    console.log('   - Events: 3 records');
    console.log('   - Announcements: 3 records');
    console.log('   - Facilities: 5 records');
    console.log('   - Testimonials: 4 new records');
    console.log('   Total: ~32 new records\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
