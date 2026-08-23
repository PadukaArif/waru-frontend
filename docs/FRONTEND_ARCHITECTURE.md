# FRONTEND ARCHITECTURE

## Overview

Frontend WARU menggunakan arsitektur modular yang dirancang agar mudah dikembangkan, dipelihara, dan diintegrasikan dengan REST API serta WebSocket.

Frontend bertanggung jawab terhadap:

* User Interface
* User Experience
* Client State
* API Communication
* Authentication State
* Routing
* Realtime Updates
* Form Validation

Frontend tidak berkomunikasi langsung dengan MongoDB.

---

# Technology

Frontend menggunakan:

* Next.js
* React
* TypeScript
* Tailwind CSS

---

# Architecture

```text
User
↓
Next.js Application
↓
UI Components
↓
Pages / Routes
↓
Services
↓
REST API
↓
Backend
↓
MongoDB
```

Untuk realtime:

```text
Frontend
↕
WebSocket
↕
Backend
```

---

# Application Structure

Struktur frontend mengikuti konsep modular.

Contoh:

```text
waru-frontend/
│
├── app/
│   ├── page.tsx
│   ├── menu/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── profile/
│   │
│   └── admin/
│       ├── dashboard/
│       ├── orders/
│       ├── menu/
│       ├── inventory/
│       ├── promo/
│       ├── analytics/
│       └── assistant/
│
├── components/
│
├── services/
│
├── hooks/
│
├── lib/
│
└── types/
```

---

# Pages

## Public Pages

Customer dapat mengakses tanpa login:

* Landing Page
* Menu
* Menu Detail
* Cart

---

## Customer Pages

Membutuhkan authentication:

* Checkout
* Order Detail
* Order History
* Profile

---

## Internal Pages

Membutuhkan role tertentu:

* Cashier
* Kitchen
* Owner

Setiap role memiliki halaman dan permission masing-masing.

---

# Component Architecture

Komponen dibagi menjadi:

## UI Components

Komponen generik:

* Button
* Input
* Modal
* Card
* Badge
* Table
* Dropdown
* Toast

---

## Feature Components

Komponen berdasarkan fitur:

* MenuCard
* CartItem
* OrderCard
* PaymentSelector
* OrderStatus
* InventoryTable
* DashboardCard

---

## Layout Components

Contoh:

* Navbar
* Sidebar
* Footer
* DashboardLayout
* AdminLayout

---

# Services

Semua komunikasi API dikelompokkan berdasarkan modul.

Contoh:

```text
services/
├── auth.ts
├── menu.ts
├── order.ts
├── payment.ts
├── inventory.ts
├── promo.ts
├── customer.ts
└── analytics.ts
```

Komponen UI tidak melakukan fetch API secara langsung apabila request tersebut dapat ditempatkan pada service.

---

# Authentication

Authentication state disimpan pada client sesuai mekanisme authentication yang digunakan.

Frontend bertugas:

* Mengetahui authentication state
* Menampilkan UI sesuai role
* Mengarahkan user ke halaman yang sesuai
* Menangani expired session

Backend tetap menjadi sumber kebenaran untuk authentication dan authorization.

---

# Routing

Routing mengikuti struktur fitur.

Contoh:

```text
/menu
/menu/[id]

/cart
/checkout

/orders
/orders/[id]

/profile

/admin
/admin/orders
/admin/menu
/admin/inventory
/admin/promo
/admin/analytics
/admin/assistant
```

---

# Error Handling

Frontend harus memberikan feedback yang jelas ketika:

* API gagal
* Authentication gagal
* Authorization ditolak
* Data tidak ditemukan
* Network error
* Validation error

Error dari backend tidak boleh ditampilkan secara mentah apabila mengandung informasi internal.

---

# Loading State

Setiap halaman atau request asynchronous harus memiliki loading state.

Contoh:

* Skeleton
* Loading indicator
* Disabled button

User tidak boleh mendapatkan pengalaman seolah sistem tidak merespons.

---

# Empty State

Apabila data kosong, frontend harus menampilkan empty state.

Contoh:

```text
Belum ada pesanan.
```

bukan halaman kosong.

---

# Realtime

Data yang membutuhkan realtime update menggunakan WebSocket.

Contoh:

* Order status
* Kitchen queue
* Cashier queue
* Dashboard metrics
* Notification

REST API tetap digunakan untuk operasi CRUD dan data initial loading.

---

# Responsive Design

Frontend harus mendukung:

* Desktop
* Tablet
* Mobile

Design mengikuti prinsip:

* Premium
* Modern
* Minimalist
* Responsive

---

# Accessibility

Frontend harus memperhatikan:

* Semantic HTML
* Keyboard navigation
* Focus state
* Accessible labels
* Sufficient contrast
* Screen reader compatibility

---

# Performance

Frontend harus menghindari:

* Unnecessary API calls
* Unnecessary re-render
* Large client bundles
* Blocking UI

Data fetching harus dilakukan secara efisien.

---

# Principle

Frontend harus:

* Modular
* Maintainable
* Type-safe
* Responsive
* Accessible
* Consistent

Frontend tidak boleh mengandung business logic kritikal yang seharusnya dilakukan oleh backend.
