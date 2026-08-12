# WML Learn - Dashboard Instruktur LMS 🎓

[![Jira Key](https://img.shields.io/badge/Jira-WML--5-blue?style=for-the-badge&logo=jira)](https://mii-team-pvqkohd7.atlassian.net)
[![Status](https://img.shields.io/badge/Status-DRAFT-amber?style=for-the-badge)](https://github.com/makbarmii/wml-lms)
[![PRD](https://img.shields.io/badge/Confluence-WML--PRD-indigo?style=for-the-badge&logo=confluence)](https://mii-team-pvqkohd7.atlassian.net)

Aplikasi Single-Page (SPA) premium bertema gelap (*dark mode*) yang dirancang khusus untuk memfasilitasi peran pengajar/instruktur dalam membuat dan mengunggah draf modul kursus baru secara digital.

Aplikasi ini diimplementasikan untuk memenuhi fungsionalitas tiket Jira **WML-5** ("Pembuatan Modul Kursus Baru") dan mengikuti **Product Requirements Document (PRD)** lengkap pada space **WML** di Confluence.

---

## ✨ Fitur Utama

- 📊 **Metrik Dashboard Dinamis**: Menampilkan ringkasan jumlah total kursus, kursus aktif, dan draf kursus pengajar dengan animasi angka yang interaktif.
- 📂 **Filtering Status Kursus**: Memisahkan tampilan daftar kursus secara dinamis berdasarkan kategori Semua, Aktif, dan Draf tanpa memuat ulang halaman.
- 🧩 **Native `<dialog>` Modal**: Menggunakan elemen dialog HTML5 native dengan atribut `closedby="any"` dan fallback JavaScript untuk mendukung penutupan modal dengan klik luar (*light-dismiss*) dan tombol `Esc`.
- 🖲️ **Drag-and-Drop Dropzone**: Mengunggah berkas secara dinamis dengan deteksi tarik-lepas, visual ikon interaktif, dan validasi format berkas yang sangat ketat (Video wajib `.mp4` & Materi dokumen wajib `.pdf`).
- 🔄 **Simulasi Multi-Stage Upload Progress**: Animasi visual progress bar yang realistis menyimulasikan transmisi data ke Cloud Storage (S3/GCS) berurutan antara video MP4 lalu dokumen PDF.
- 💾 **Sinkronisasi LocalStorage**: Menyimpan data draf kursus baru secara aman ke dalam basis data mock lokal (`localStorage`) sehingga data tetap tersimpan saat halaman dimuat ulang.

---

## 🛠️ Susunan Teknologi

- **Struktur**: HTML5 Semantik lengkap dengan optimasi tag meta SEO
- **Gaya Tampilan**: Vanilla CSS modern bertema gelap pekat (*royal navy & slate*), dengan aksen gradasi violet elektrik, glassmorphism, dan responsivitas penuh (*Mobile-friendly*)
- **Logika Klien**: Vanilla JS murni (ES6+) dengan manipulasi DOM modern
- **Server Lokal**: Native Node.js HTTP server (zero-dependency)

---

## 🚀 Cara Menjalankan Secara Lokal

Sistem ini menyertakan web server statis zero-dependency yang memanfaatkan modul bawaan Node.js `http` sehingga dapat dijalankan secara instan tanpa menginstal modul tambahan dari npm.

1. Buka terminal Anda pada direktori proyek.
2. Jalankan perintah server:
   ```bash
   node server.js
   ```
3. Buka peramban (browser) Anda dan akses:
   [http://localhost:3000](http://localhost:3000)

---

## 📋 Struktur Berkas Proyek

```text
wml-lms/
├── index.html       # Struktur halaman dashboard utama & modal dialog
├── index.css        # Desain CSS variables, tema gelap premium & layout
├── app.js           # Manajemen state localstorage, drag-drop, & simulasi upload
├── server.js        # Server static lokal bawaan Node.js (Port 3000)
├── .gitignore       # Pengabaian pelacakan file Git lokal
└── README.md        # Panduan dokumentasi proyek ini
```

---

*Dikembangkan dengan penuh dedikasi sebagai solusi workshop LMS Workshop MSD.*
