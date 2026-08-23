# USER FLOW

## Overview

Dokumen ini menjelaskan perjalanan setiap pengguna (Customer, Cashier, Kitchen, dan Owner) saat menggunakan sistem WARU. User Flow menjadi acuan utama dalam perancangan UI/UX, routing frontend, autentikasi, dan interaksi antar halaman.

---

# CUSTOMER FLOW

## Browse Menu

Customer dapat mengakses website tanpa login.

Flow:

Landing Page
↓
Explore Menu
↓
Menu Detail
↓
Add to Cart

Customer bebas melihat seluruh menu sebelum melakukan login.

---

## Authentication

Login diwajibkan ketika customer ingin melakukan checkout.

Metode login:

* Google Sign In
* Email & Password

Metode registrasi:

* Email & Password

Apabila login menggunakan Google, data profil seperti nama dan foto akan diambil secara otomatis. Untuk akun Email, sistem menggunakan avatar default yang dapat diubah kemudian.

---

## Checkout

Customer melakukan checkout dengan langkah berikut:

* Memilih tipe pesanan (Take Away / Pre Order)
* Memilih metode pembayaran (QRIS / Cash)
* Memastikan nama pengambil
* Konfirmasi pesanan

Nama pengambil secara default menggunakan nama akun, namun customer dapat mengubahnya apabila pesanan akan diambil oleh orang lain.

---

## Payment Flow

### QRIS

Checkout
↓
Bayar QRIS
↓
Cashier Verification
↓
Kitchen
↓
Ready to Pick Up

### Cash

Checkout
↓
Cashier Verification
↓
Kitchen
↓
Ready to Pick Up
↓
Bayar di Tempat
↓
Pesanan Diserahkan

---

## Order Tracking

Customer dapat melihat status pesanan secara real-time.

Status:

Pending
↓
Cooking
↓
Ready
↓
Completed

Customer menerima notifikasi pada setiap perubahan status.

---

## Order History

Customer dapat melihat seluruh riwayat pesanan.

Setiap pesanan menampilkan:

* Order Number
* Nama Pengambil
* Daftar Menu
* Total Harga
* Status
* Tanggal Pemesanan

Customer dapat membuka detail setiap pesanan.

---

## Rating & Review

Rating hanya dapat diberikan setelah pesanan Completed.

Setiap pesanan hanya dapat diberikan satu rating dan satu ulasan.

---

# CASHIER FLOW

Cashier login langsung menuju halaman Order Queue.

Cashier bertugas:

* Melihat pesanan baru
* Verifikasi pembayaran
* Mengubah status pembayaran
* Mengirim pesanan ke Kitchen
* Mengajukan Refund Request (apabila diperlukan)

Cashier tidak memiliki akses untuk:

* Mengubah menu
* Mengubah harga
* Mengakses laporan bisnis
* Mengakses Business Assistant

---

# KITCHEN FLOW

Kitchen login langsung menuju Today's Orders.

Kitchen hanya fokus pada operasional memasak.

Informasi yang ditampilkan:

* Nama Pengambil
* Order Number
* Daftar Menu
* Jumlah
* Catatan Khusus

Status pesanan:

Pending
↓
Cooking
↓
Ready
↓
Completed

Kitchen tidak dapat melewati urutan status.

Kitchen tidak memiliki akses terhadap transaksi maupun laporan.

---

# OWNER FLOW

Owner login menuju Dashboard.

Dashboard menampilkan ringkasan bisnis secara real-time.

Menu utama:

* Dashboard
* Orders
* Menu
* Inventory
* Promo
* Customer
* Analytics
* Business Assistant
* Settings

Owner memiliki akses penuh terhadap seluruh modul sistem.

Business Assistant tersedia sebagai:

* Ringkasan pada Dashboard
* Halaman khusus Business Assistant

Owner dapat mengekspor laporan dalam format:

* PDF
* Excel

---

# PROFILE FLOW

Customer dapat:

* Mengubah nama
* Mengubah foto profil
* Mengubah password (akun Email)
* Logout

Apabila menggunakan akun Google, informasi profil akan mengikuti akun Google.

---

# OFFLINE FLOW

Ketika koneksi internet terputus:

System menampilkan:

"You're Offline"

Sistem akan mencoba melakukan reconnect secara otomatis.

Apabila koneksi kembali:

"You're Online"

Seluruh data akan diperbarui secara otomatis.

---

# ORDER IDENTIFICATION

Setiap pesanan memiliki dua identitas.

Internal:

* UUID (Primary Key)

Public:

* Order Number (Unique)

Customer melihat:

Nama Pengambil
Order #0001

Order Number digunakan untuk mempermudah pencarian pesanan dan menghindari kesamaan nama pelanggan.

---

# User Experience Principles

* Customer dapat melihat menu tanpa login.
* Login hanya diperlukan saat checkout.
* Navigasi dibuat sesederhana mungkin.
* Status pesanan diperbarui secara real-time.
* Sistem memberikan feedback yang jelas pada setiap aksi pengguna.
* Halaman disusun berdasarkan kebutuhan masing-masing role.

---

# Deliverables

Dokumen ini menjadi referensi utama untuk:

* ROLE_PERMISSION.md
* SYSTEM_ARCHITECTURE.md
* FRONTEND_ROUTING.md

Seluruh desain UI dan navigasi wajib mengikuti User Flow ini.
