# COMMUNICATION FLOW

## Overview

Dokumen ini menjelaskan komunikasi antar komponen dalam sistem WARU.

Komponen utama:

* Frontend
* Backend
* MongoDB
* WebSocket
* Business Assistant
* External Services

Frontend tidak mengakses database secara langsung.

---

# Standard Communication

Flow utama:

```text
Frontend
↓
REST API
↓
Backend
↓
MongoDB
```

Response:

```text
MongoDB
↓
Backend
↓
REST API
↓
Frontend
```

---

# Authentication Communication

```text
Frontend
↓
Login Request
↓
Backend
↓
Validate Credentials
↓
Generate JWT
↓
Frontend
```

Request protected:

```http
Authorization: Bearer <token>
```

Backend melakukan:

1. Validate JWT
2. Identify user
3. Check role
4. Execute request
5. Return response

---

# Menu Communication

```text
Frontend
↓
GET /menu
↓
Backend
↓
Menu Model
↓
MongoDB
↓
Backend
↓
Frontend
```

Untuk admin:

```text
Admin Frontend
↓
POST /menu
↓
Backend
↓
Authorization
↓
Menu Controller
↓
Menu Model
↓
MongoDB
```

---

# Order Communication

Customer membuat order:

```text
Customer
↓
Checkout
↓
POST /orders
↓
Backend
↓
Validate Order
↓
Create Order
↓
MongoDB
```

Setelah order berhasil:

```text
Backend
↓
Order Created
↓
Cashier Queue
```

---

# Payment Communication

Payment:

```text
Customer
↓
Checkout
↓
Payment Method
↓
Backend
↓
Payment
↓
Order
```

Payment status digunakan untuk menentukan apakah order dapat diproses.

Supported payment:

* QRIS
* Cash

---

# Kitchen Communication

```text
Cashier
↓
Payment Verified
↓
Order Status
↓
Kitchen
```

Kitchen mengubah status:

```text
Pending
↓
Cooking
↓
Ready
↓
Completed
```

Perubahan status dikirim ke frontend melalui WebSocket apabila realtime tersedia.

---

# Inventory Communication

```text
Order
↓
Payment Success
↓
Stock Reservation
↓
Inventory
```

Ketika order dibatalkan:

```text
Order Cancelled
↓
Release Stock Reservation
↓
Inventory Updated
```

---

# WebSocket Communication

WebSocket digunakan untuk komunikasi realtime.

Contoh event:

```text
order.created
order.updated
order.status_changed

payment.updated

inventory.updated

notification.created
```

Flow:

```text
Backend
↓
WebSocket Event
↓
Connected Clients
↓
UI Update
```

---

# Notification Communication

Backend membuat notification berdasarkan event.

Contoh:

```text
Order Status Changed
↓
Notification Service
↓
WebSocket
↓
Frontend
```

Customer dapat menerima informasi perubahan status tanpa melakukan refresh manual.

---

# Business Assistant Communication

Business Assistant mengambil data operasional dari backend.

Flow:

```text
Owner
↓
Business Assistant
↓
Backend
↓
Operational Data
↓
Business Assistant
↓
Insight / Recommendation
↓
Owner
```

Business Assistant tidak mengakses MongoDB secara langsung.

---

# Error Communication

Apabila terjadi error:

```text
Frontend
↓
Request
↓
Backend
↓
Error
↓
HTTP Response
↓
Frontend
↓
User Feedback
```

Backend harus mengembalikan error response yang konsisten.

Frontend menampilkan pesan yang mudah dipahami user.

---

# HTTP Status

Response menggunakan HTTP status yang sesuai.

Contoh:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

---

# Communication Principle

* Frontend tidak mengakses database langsung.
* Business logic berada di backend.
* Authentication dilakukan backend.
* Authorization dilakukan backend.
* REST API digunakan untuk request/response.
* WebSocket digunakan untuk realtime.
* Error response harus konsisten.
* Semua komunikasi harus menggunakan secure connection pada production.
