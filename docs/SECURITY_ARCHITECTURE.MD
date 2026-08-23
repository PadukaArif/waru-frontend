# SECURITY ARCHITECTURE

## Overview

Dokumen ini menjelaskan prinsip dan mekanisme keamanan yang digunakan dalam sistem WARU.

Security dirancang untuk melindungi:

* Akun pengguna
* Data pelanggan
* Data transaksi
* Data menu
* Data inventory
* API
* Database
* Komunikasi realtime
* Infrastruktur server

Security menjadi tanggung jawab bersama antara Frontend, Backend, Database, dan Infrastructure.

---

# Security Principles

WARU menggunakan prinsip:

* Least Privilege
* Defense in Depth
* Input Validation
* Authentication
* Authorization
* Secure Communication
* Rate Limiting
* Error Handling
* Logging
* Data Protection

Security harus diterapkan tanpa membuat sistem menjadi unnecessarily complex.

---

# Authentication

Authentication digunakan untuk memastikan identitas pengguna.

Metode authentication:

* Email & Password
* Google Sign In

Customer dapat melihat menu tanpa login.

Authentication diperlukan untuk:

* Checkout
* Melihat riwayat pesanan
* Profile
* Role tertentu
* Dashboard internal

---

# Password Security

Password tidak boleh disimpan dalam bentuk plaintext.

Password diproses menggunakan:

```text
Password
↓
bcrypt
↓
Password Hash
↓
Database
```
