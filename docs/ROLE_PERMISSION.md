# ROLE & PERMISSION

## Overview

WARU menggunakan Role Based Access Control (RBAC).

Setiap user memiliki role yang menentukan akses terhadap fitur dan data sistem.

Role utama:

* Customer
* Cashier
* Kitchen
* Owner

---

# CUSTOMER

Customer adalah pengguna yang melakukan pemesanan.

## Permissions

Customer dapat:

* Melihat menu
* Melihat detail menu
* Menambahkan menu ke cart
* Melakukan checkout
* Melakukan pembayaran
* Melihat status pesanan
* Melihat riwayat pesanan
* Memberikan rating
* Memberikan review
* Mengubah profile

Customer tidak dapat:

* Mengelola menu
* Mengelola inventory
* Mengelola promo
* Mengubah status pesanan secara manual
* Mengakses dashboard internal
* Mengakses laporan bisnis
* Mengakses Business Assistant internal

---

# CASHIER

Cashier bertanggung jawab terhadap transaksi dan verifikasi pembayaran.

## Permissions

Cashier dapat:

* Melihat order queue
* Melihat detail order
* Melakukan verifikasi pembayaran
* Mengubah status pembayaran
* Mengirim order ke Kitchen
* Melihat informasi transaksi
* Mengajukan refund request

Cashier tidak dapat:

* Mengubah menu
* Mengubah harga
* Mengelola inventory
* Mengelola promo
* Mengakses laporan bisnis
* Mengakses Business Assistant

---

# KITCHEN

Kitchen bertanggung jawab terhadap proses produksi makanan.

## Permissions

Kitchen dapat:

* Melihat Today's Orders
* Melihat detail order
* Melihat item pesanan
* Melihat catatan khusus
* Mengubah status proses memasak

Status yang dapat diubah:

Pending
↓
Cooking
↓
Ready
↓
Completed

Kitchen tidak dapat:

* Mengubah harga
* Mengubah menu
* Mengubah inventory secara manual
* Mengakses transaksi
* Mengakses laporan bisnis
* Mengakses Business Assistant

---

# OWNER

Owner memiliki akses penuh terhadap sistem.

## Permissions

Owner dapat:

* Mengakses dashboard
* Mengelola order
* Mengelola menu
* Mengelola inventory
* Mengelola promo
* Melihat customer
* Melihat analytics
* Mengakses Business Assistant
* Melihat laporan
* Mengekspor laporan
* Mengelola settings

Owner dapat mengakses seluruh data operasional WARU.

---

# PERMISSION MATRIX

| Feature            | Customer | Cashier | Kitchen | Owner |
| ------------------ | -------: | ------: | ------: | ----: |
| View Menu          |        ✓ |       ✓ |       ✓ |     ✓ |
| Checkout           |        ✓ |       - |       - |     - |
| Payment            |        ✓ |       ✓ |       - |     ✓ |
| Order Queue        |        - |       ✓ |       ✓ |     ✓ |
| Order Management   |      Own |       ✓ | Limited |     ✓ |
| Menu Management    |        - |       - |       - |     ✓ |
| Inventory          |        - |       - | Limited |     ✓ |
| Promo              |        - |       - |       - |     ✓ |
| Customer Data      |      Own | Limited |       - |     ✓ |
| Analytics          |        - |       - |       - |     ✓ |
| Business Assistant |        - |       - |       - |     ✓ |
| Reports            |        - |       - |       - |     ✓ |
| Settings           |      Own |       - |       - |     ✓ |

---

# Authentication Rules

Role harus ditentukan oleh backend.

Frontend tidak boleh menentukan role berdasarkan input user.

Flow:

Login
↓
Backend Authentication
↓
JWT
↓
JWT contains user identity / role
↓
Backend Authorization
↓
Request Allowed / Denied

Backend menjadi sumber kebenaran utama untuk authorization.

---

# Security Rules

User tidak boleh mengakses endpoint yang tidak sesuai dengan role.

Contoh:

Customer mencoba:

```http
POST /menu
```

Backend harus menolak request tersebut.

Authorization harus dilakukan di backend walaupun frontend sudah menyembunyikan menu atau tombol tertentu.

---

# Principle

Frontend permission digunakan untuk User Experience.

Backend permission digunakan untuk Security.

Frontend hiding ≠ Security.

Backend Authorization = Security.
