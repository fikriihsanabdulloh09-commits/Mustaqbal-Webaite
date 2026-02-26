# sync-db.md

Menyelaraskan pemahaman AI dengan struktur database Supabase terbaru. Membaca file di supabase/migrations untuk mencegah konflik tabel atau error query.

## Steps

# Workflow: Database Context Sync
1. Scan seluruh folder 'supabase/migrations' menggunakan 'filesystem'.
2. Ringkas struktur tabel terbaru (terutama tabel 'admin_users' atau 'teachers' yang sedang dikerjakan).
3. Cek terminal menggunakan 'desktop-commander' untuk memastikan tidak ada migration yang error.
4. Laporkan ke user jika ada skema tabel yang bertabrakan dengan rencana fitur baru.