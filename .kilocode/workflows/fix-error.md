# fix-error.md

Prosedur perbaikan bug otomatis. Menganalisis log terminal, mencari solusi di dokumentasi terbaru via Tavily, dan melakukan perbaikan file secara mandiri.

## Steps

1. Baca pesan error terakhir dari terminal Antigravity.
2. Gunakan 'tavily-search' untuk mencari solusi terbaru sesuai versi Next.js dan Supabase yang digunakan.
3. Cari file yang bermasalah di folder project menggunakan 'filesystem'.
4. Berikan saran perbaikan tanpa menghapus logika penting yang sudah ada.
5. Setelah diperbaiki, update 'progress.md' bahwa bug sudah selesai ditangani.