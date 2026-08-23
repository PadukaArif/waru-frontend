# API CONTRACT

## Overview

Dokumen ini menjadi kontrak komunikasi antara Frontend dan Backend WARU.

API Contract digunakan sebagai acuan untuk:

* Frontend Development
* Backend Development
* API Integration
* Testing
* Debugging
* Code Walkthrough

Frontend tidak mengakses MongoDB secara langsung.

Flow:

Frontend
↓
REST API
↓
Backend
↓
MongoDB

Untuk kebutuhan realtime:

Frontend
↕
WebSocket
↕
Backend

---

# Backend Information

Technology:

* Bun
* Elysia
* TypeScript
* MongoDB

Production API:

https://api.waru.com

Development API:

http://localhost:3000

---

# Authentication

WARU menggunakan:

* Email & Password
* JWT

Flow:

Register / Login
↓
Backend melakukan validasi
↓
JWT dibuat
↓
JWT diberikan kepada client
↓
Client mengirim JWT pada protected request

Authorization Header:

```http
Authorization: Bearer <token>
```
