# BUSINESS FLOW

## Overview

Dokumen ini menjelaskan alur bisnis utama WARU, mulai dari pelanggan melakukan pemesanan hingga seluruh data diproses menjadi insight bisnis oleh Business Assistant.

Business Flow ini menjadi acuan utama dalam perancangan database, API, frontend, backend, dan Business Assistant.

---

# Main Business Flow

Customer
↓
Landing Page
↓
Explore Menu
↓
Menu Detail
↓
Add to Cart
↓
Login / Register
↓
Checkout
↓
Choose Order Type
(Take Away / Pre Order)
↓
Choose Payment Method
(QRIS / Cash)
↓
Payment
↓
Cashier Verification
↓
Stock Reserved
↓
Order Sent to Kitchen
↓
Kitchen Processing
↓
Ready to Pick Up
↓
Customer Picks Up Order
↓
Completed
↓
Customer Rating & Review
↓
Business Assistant Analysis
↓
Owner Dashboard Updated

---

# Customer Flow

Customer dapat menjelajahi seluruh menu tanpa harus login.

Login hanya diwajibkan ketika customer ingin melakukan checkout.

Setelah login berhasil, customer dapat:

* Melakukan pemesanan
* Melihat riwayat pesanan
* Melacak status pesanan
* Memberikan rating
* Menggunakan fitur Pre Order

---

# Order Types

## Take Away

Customer melakukan pemesanan.

Setelah status berubah menjadi Ready to Pick Up, customer datang ke WARU untuk mengambil pesanan.

---

## Pre Order

Customer memilih tanggal dan jam pengambilan.

Pesanan akan diproses mendekati waktu pengambilan sehingga makanan tetap dalam kondisi terbaik saat diambil.

---

# Payment Flow

Supported Payment

* QRIS
* Cash

Customer bebas memilih metode pembayaran.

Cashier bertugas melakukan verifikasi pembayaran sebelum pesanan diteruskan ke Kitchen.

---

# Cashier Flow

Cashier menerima pesanan baru.

Cashier melakukan:

* Verifikasi pembayaran
* Konfirmasi pesanan

Setelah pembayaran tervalidasi:

* Status pembayaran berubah menjadi Paid.
* Sistem melakukan Stock Reservation.
* Pesanan otomatis dikirim ke Kitchen.

---

# Kitchen Flow

Kitchen hanya fokus pada operasional.

Status pesanan:

Pending
↓
Cooking
↓
Ready
↓
Completed

Kitchen tidak memiliki akses untuk mengubah data transaksi maupun laporan bisnis.

---

# Inventory Flow

WARU menggunakan sistem Stock Reservation.

Alur:

Payment Success
↓
Reserve Stock
↓
Kitchen Cooking
↓
Stock Used

Jika pesanan dibatalkan sebelum diproses Kitchen, maka Stock Reservation akan dilepas secara otomatis.

Apabila stok tidak mencukupi, menu akan otomatis berubah menjadi Sold Out.

---

# Owner Flow

Owner memiliki akses penuh terhadap sistem.

Owner dapat:

* Melihat seluruh transaksi
* Mengelola menu
* Mengelola promo
* Mengelola stok
* Melihat laporan
* Mengakses Dashboard
* Menggunakan Business Assistant

Owner berfungsi sebagai monitoring dan pengambil keputusan, bukan sebagai pihak yang menyetujui pesanan.

---

# Promo Flow

Promo dibuat oleh Owner.

Promo memiliki:

* Tanggal mulai
* Tanggal berakhir

Sistem akan mengaktifkan dan menonaktifkan promo secara otomatis sesuai jadwal.

---

# Rating & Review Flow

Customer hanya dapat memberikan rating setelah status pesanan Completed.

Setiap pesanan hanya dapat diberi satu rating.

Rating akan digunakan sebagai salah satu sumber data Business Assistant.

---

# Notification Flow

Customer menerima notifikasi ketika:

* Pesanan diterima
* Pembayaran berhasil
* Pesanan sedang dimasak
* Pesanan siap diambil
* Pesanan selesai

Owner menerima notifikasi Business Assistant apabila terdapat insight penting, misalnya:

* Penjualan menurun
* Stok hampir habis
* Menu tertentu mengalami peningkatan penjualan
* Rekomendasi promo

---

# Cancellation Rules

Customer dapat membatalkan pesanan apabila:

* Kitchen belum mulai memasak.
* Pesanan belum diproses selama 10–15 menit.

Apabila pembatalan berhasil:

* Status pesanan berubah menjadi Cancelled.
* Stock Reservation dilepas.
* Dashboard diperbarui secara otomatis.

---

# Business Assistant

Business Assistant bekerja secara real-time.

Business Assistant membaca data dari:

* Transaksi
* Inventory
* Menu
* Rating
* Review
* Customer
* Laporan Penjualan

Business Assistant menghasilkan:

* Business Insight
* Smart Recommendation
* Smart Inventory
* Financial Summary
* Business Chat

Business Assistant tidak mengambil keputusan secara otomatis.

Seluruh rekomendasi tetap berada di bawah keputusan Owner.

---

# Business Rules

* Customer wajib login sebelum checkout.
* Customer bebas melihat menu tanpa login.
* Owner hanya memonitor operasional.
* Cashier melakukan verifikasi pembayaran.
* Kitchen hanya fokus pada proses memasak.
* Stok menggunakan sistem Stock Reservation.
* Promo aktif otomatis sesuai tanggal.
* Rating hanya setelah pesanan Completed.
* Business Assistant hanya memberikan insight dan rekomendasi.

---

# Deliverables

Dokumen ini menjadi referensi utama untuk:

* USER_FLOW.md
* ROLE_PERMISSION.md
* SYSTEM_ARCHITECTURE.md

Semua modul berikutnya wajib mengikuti Business Flow ini.
