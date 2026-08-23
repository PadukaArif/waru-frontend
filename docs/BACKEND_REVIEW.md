# BACKEND REVIEW

## Overview

Dokumen ini digunakan untuk mencatat kondisi backend WARU berdasarkan implementasi yang sudah tersedia di repository.

Backend menjadi pusat:

- Authentication
- Authorization
- Business Logic
- Database Access
- Validation
- Security
- API
- Communication dengan frontend

Frontend tidak berkomunikasi langsung dengan database.

Flow utama:

Frontend
↓
API
↓
Backend
↓
MongoDB

---

# Backend Technology

Backend menggunakan:

- Bun
- Elysia
- TypeScript
- MongoDB
- JWT

Backend menggunakan struktur modular agar setiap fitur dapat dipisahkan dengan jelas.

---

# Backend Architecture

Struktur umum:

Request
↓
Route
↓
Validation
↓
Controller
↓
Service
↓
Database / External Service
↓
Response

Setiap layer memiliki tanggung jawab yang berbeda.

---

# Project Structure

Backend menggunakan struktur module.

Module yang sudah tersedia antara lain:

- Users
- Register
- Login
- Boss
- Cashier
- Kitchen

Struktur dapat berkembang mengikuti fitur WARU.

---

# Authentication

Authentication menggunakan:

Email + Password
↓
JWT

Flow login:

User
↓
Login
↓
Backend validasi email dan password
↓
Backend membuat JWT
↓
JWT dikirim ke frontend
↓
Frontend menggunakan JWT untuk request berikutnya

Password tidak pernah disimpan dalam bentuk plaintext.

---

# JWT Authentication Flow

JWT digunakan sebagai bukti bahwa request berasal dari user yang sudah melakukan authentication.

Flow:

Frontend
↓
Login
↓
Backend
↓
JWT
↓
Frontend menerima token
↓
Request ke API
↓
Authorization: Bearer <token>
↓
Backend memvalidasi JWT
↓
Request diterima / ditolak

Format header:

Authorization: Bearer <token>

Protected endpoint harus melakukan validasi JWT sebelum menjalankan business logic.

---

# Password Security

Password menggunakan hashing.

Flow:

Password
↓
Hashing
↓
passwordHash
↓
Database

Saat login:

Password Input
↓
Compare dengan passwordHash
↓
Valid / Invalid

Password asli tidak disimpan di database.

---

# JWT Secret

JWT secret disimpan menggunakan environment variable.

Secret tidak boleh ditulis langsung di source code.

Contoh:

JWT_SECRET=...

`.env` tidak boleh di-commit ke repository.

---

# Authorization

Authentication menjawab:

"Siapa user ini?"

Authorization menjawab:

"Apakah user ini boleh melakukan aksi tersebut?"

Role yang digunakan pada backend:

- boss
- cashier
- kitchen
- customer

Permission harus divalidasi di backend.

Frontend hanya digunakan untuk mengatur tampilan dan pengalaman pengguna.

Frontend bukan security layer utama.

---

# Role Access

## Boss

Boss memiliki akses terhadap fitur management dan monitoring sesuai permission yang diberikan backend.

## Cashier

Cashier digunakan untuk kebutuhan operasional kasir.

## Kitchen

Kitchen digunakan untuk kebutuhan operasional dapur.

## Customer

Customer menggunakan fitur pemesanan dan fitur yang tersedia untuk customer.

Permission setiap role harus tetap mengikuti ROLE_PERMISSION.md.

---

# Global Error Handler

Backend memiliki Global Error Handler.

Tujuannya:

- Menangani error secara konsisten.
- Menghindari response error yang berbeda-beda.
- Menghindari informasi internal server bocor ke client.
- Mempermudah debugging.

Flow:

Error
↓
Global Error Handler
↓
Standard Error Response

---

# Validation

Semua input dari client harus divalidasi oleh backend.

Validation digunakan untuk mencegah:

- Data tidak sesuai format.
- Field wajib kosong.
- Tipe data salah.
- Input tidak valid.
- Request tidak sesuai business rule.

Frontend boleh melakukan validation untuk UX.

Namun backend tetap melakukan validation sebagai security boundary.

---

# CORS

CORS digunakan untuk mengatur origin yang diperbolehkan mengakses API.

Arsitektur deployment:

Frontend:

https://waru.com

Backend:

https://api.waru.com

Flow:

Frontend
↓
api.waru.com
↓
Backend

Production CORS tidak boleh dibuat terlalu bebas.

---

# API Documentation

Backend menggunakan Swagger untuk membantu dokumentasi dan testing API.

Swagger membantu developer memahami:

- Endpoint
- HTTP Method
- Request
- Response
- Authentication

Swagger dapat digunakan sebagai referensi ketika frontend melakukan integrasi dengan backend.

---

# Logger

Backend menggunakan logger untuk membantu:

- Debugging
- Monitoring
- Error tracking
- Mengetahui aktivitas penting sistem

Logger tidak boleh mencatat data sensitif.

Tidak boleh mencatat:

- Password
- JWT Secret
- Database Credential
- Private Key
- Sensitive Token

---

# Pagination

Endpoint yang dapat menghasilkan banyak data menggunakan pagination.

Contoh:

?page=1&limit=10

Pagination digunakan untuk:

- Mengurangi ukuran response.
- Mengurangi penggunaan memory.
- Meningkatkan performance.
- Menghindari pengambilan data terlalu banyak sekaligus.

Backend tetap harus memberikan batas maksimum `limit`.

---

# Security Utilities

Backend memiliki utility untuk kebutuhan security.

Tujuannya agar logic security tidak ditulis berulang-ulang pada setiap module.

Security logic harus dibuat konsisten.

---

# Cookie

Backend memiliki dukungan cookie.

Jika cookie digunakan untuk authentication atau kebutuhan lain, konfigurasi security harus memperhatikan:

- HttpOnly
- Secure
- SameSite

Penggunaan cookie harus disesuaikan dengan arsitektur authentication yang digunakan.

Untuk authentication API utama WARU, JWT dikirim oleh frontend melalui:

Authorization: Bearer <token>

---

# Database

Database:

MongoDB

Frontend tidak memiliki akses langsung ke MongoDB.

Flow:

Frontend
↓
Backend API
↓
MongoDB

Database credential hanya berada pada environment backend.

---

# Current Backend Modules

Module yang sudah tersedia:

- Users
- Register
- Login
- Boss
- Cashier
- Kitchen

Module bisnis berikut merupakan bagian dari rancangan WARU dan dikembangkan sesuai tahap implementasi:

- Menu
- Order
- Payment
- Inventory
- Promo
- Review
- Notification
- Analytics
- Business Assistant

Dokumentasi tidak boleh menganggap module sudah selesai hanya karena sudah direncanakan.

Status harus mengikuti repository terbaru.

---

# Rate Limiting

Rate limiter digunakan untuk mengurangi risiko abuse terhadap API.

Endpoint prioritas:

- Login
- Register
- Public API
- Sensitive API

Tujuannya mengurangi:

- API spam
- Brute force
- Request berlebihan
- Abuse

Implementasi rate limiter harus mengikuti kondisi repository terbaru.

---

# WebSocket

WebSocket digunakan untuk fitur yang membutuhkan komunikasi realtime.

Contoh:

- Order status
- Notification
- Chat

Tidak semua request membutuhkan WebSocket.

Request biasa tetap menggunakan HTTP API.

---

# Business Rule

Business rule harus berada di backend.

Contoh:

Customer hanya dapat memberikan review setelah order Completed.

Frontend dapat membantu memberikan UX yang baik.

Namun backend tetap melakukan validasi akhir.

---

# Data Integrity

Backend bertanggung jawab memastikan data tetap valid.

Contoh:

Request
↓
Validation
↓
Authentication
↓
Authorization
↓
Business Rule
↓
Database Operation
↓
Response

Client tidak boleh dipercaya untuk menentukan data penting seperti:

- Total harga
- Discount final
- Role
- Permission
- Data transaksi final

---

# Error Response

Response error harus konsisten.

Minimal client mendapatkan:

- HTTP Status Code
- Success / Error status
- Message

Detail internal server tidak boleh diberikan kepada client.

---

# Environment Variables

Data sensitif menggunakan environment variable.

Contoh:

- DATABASE_URL
- JWT_SECRET
- SMTP credentials
- External service credentials

`.env` tidak boleh di-commit.

`.env.example` digunakan sebagai template konfigurasi.

---

# Backend Security Principles

Backend mengikuti prinsip:

1. Validate input.
2. Authenticate user.
3. Authorize user.
4. Validate business rule.
5. Process request.
6. Return safe response.

Security tidak hanya bergantung pada frontend.

---

# Backend Review Status

## Implemented / Available

- Bun
- Elysia
- TypeScript
- MongoDB
- JWT
- Authentication
- User Management
- Role Modules
- CORS
- Global Error Handler
- Logger
- Pagination
- Security Utility
- Cookie Support
- Swagger

## Perlu Diverifikasi / Dikembangkan

- Rate Limiter
- WebSocket Implementation
- Menu Module
- Order Module
- Inventory Module
- Payment Module
- Promo Module
- Review Module
- Notification Module
- Analytics
- Business Assistant

Status setiap item harus diperbarui berdasarkan repository terbaru.

---

# Code Walkthrough Requirement

Developer harus mampu menjelaskan:

- Mengapa menggunakan Bun.
- Mengapa menggunakan Elysia.
- Bagaimana request masuk ke backend.
- Bagaimana routing bekerja.
- Bagaimana validation bekerja.
- Bagaimana authentication bekerja.
- Bagaimana JWT dibuat.
- Bagaimana frontend mengirim JWT.
- Apa fungsi `Authorization: Bearer <token>`.
- Bagaimana backend memvalidasi JWT.
- Bagaimana authorization berdasarkan role bekerja.
- Bagaimana password diamankan.
- Bagaimana CORS bekerja.
- Bagaimana error ditangani.
- Bagaimana database diakses.
- Bagaimana pagination bekerja.
- Bagaimana logger digunakan.

Developer tidak cukup hanya mengetahui nama library.

Developer harus memahami alasan dan fungsi setiap bagian yang digunakan.

---

# Development Principle

Backend WARU tidak dibuat untuk terlihat paling kompleks.

Prioritas:

Correctness
↓
Security
↓
Performance
↓
Maintainability
↓
Understandability

Code harus tetap cukup sederhana sehingga developer dapat:

- Melakukan code walkthrough.
- Menjelaskan alur sistem.
- Melakukan debugging.
- Mengubah fitur.
- Menjawab pertanyaan juri.

---

# Final Principle

Backend WARU harus menjadi backend yang:

- Aman.
- Konsisten.
- Stabil.
- Efisien.
- Mudah dikembangkan.
- Mudah dipelajari.
- Mudah dijelaskan.

Tidak menggunakan teknologi atau arsitektur yang terlalu kompleks apabila kebutuhan sistem belum memerlukannya.

---

# Source of Truth

Status implementasi backend harus mengikuti repository backend WARU.

Dokumentasi tidak boleh mengklaim fitur sudah selesai apabila fitur tersebut belum tersedia pada source code.

Repository:

https://github.com/Dacuvis/waru-backend

Dokumen ini harus diperbarui apabila terdapat perubahan besar pada backend.