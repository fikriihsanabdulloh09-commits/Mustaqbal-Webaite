# update-progress.md

Description: Workflow untuk mencatat progres pengerjaan ke progress.md. Menjamin kontinuitas project agar AI tidak menulis ulang kode yang sudah ada dan selalu tahu tahap pengerjaan terakhir.

## Steps

1. Gunakan 'filesystem' untuk membaca isi file 'progress.md' di root directory.
2. Analisis perubahan terbaru yang baru saja kita lakukan pada kode (cek file yang baru dimodifikasi).
3. Update tabel 'Task Log' di 'progress.md' dengan detail: Tanggal hari ini, Task yang selesai, dan Next Step yang harus dilakukan.
4. Pastikan bagian 'Current Status' mencerminkan kondisi terakhir aplikasi (misal: "Admin user created").
5. Jangan menghapus log lama, cukup tambahkan di baris paling atas tabel log.