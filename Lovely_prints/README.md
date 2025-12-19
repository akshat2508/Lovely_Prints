

# 📘 Campus Digital Print Service – API Documentation

This document defines **all backend APIs**, expected **request/response formats**, **authentication rules**, and **frontend usage flows** for the Campus Digital Print Service system.

---

## 🔐 Authentication & Authorization

### 🔑 Auth Mechanism

* Authentication is handled via **Supabase JWT**
* After login/signup, frontend must store the `access_token`
* Every protected API call must include:

```
Authorization: Bearer <access_token>
```

---

### 👤 User Roles

Roles are stored in:

```
user.user_metadata.role
```

Possible values:

* `student`
* `shop_owner`
* `admin`

Frontend **must route UI based on role**.

---

## 🔑 Auth APIs

### Register

```http
POST /api/auth/register
```

**Body**

```json
{
  "email": "user@email.com",
  "password": "password",
  "name": "Student Name",
  "role": "student"
}
```

---

### Login

```http
POST /api/auth/login
```

**Response**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "user_metadata": {
        "role": "student"
      }
    },
    "session": {
      "access_token": "JWT_TOKEN"
    }
  }
}
```

---

### Get Current User

```http
GET /api/auth/me
```

**Headers**

```
Authorization: Bearer <token>
```

---

## 🏪 Shop APIs (Public + Shop Owner)

### Get All Shops (Public)

```http
GET /api/shops
```

---

### Get Shop by ID

```http
GET /api/shops/:id
```

---

### Get Shop Print Options (Public)

```http
GET /api/shops/:shopId/options
```

**Response**

```json
{
  "paper_types": [],
  "color_modes": [],
  "finish_types": []
}
```

---

### Get Shop Orders (Shop Owner Only)

```http
GET /api/shops/:id/orders
```

**Headers**

```
Authorization: Bearer <token>
```

---

### Update Order Status (Shop Owner)

```http
PATCH /api/shops/orders/:orderId/status
```

**Body**

```json
{
  "status": "printing"
}
```

Allowed statuses:

* pending
* confirmed
* printing
* ready
* completed
* cancelled

---

## 🧍 Student APIs

### Get Student Profile

```http
GET /api/students/profile
```

---

### Update Student Profile

```http
PUT /api/students/profile
```

---

### Create Order

```http
POST /api/students/orders
```

**Body**

```json
{
  "shop_id": "uuid",
  "description": "Optional notes"
}
```

---

### Get Student Orders

```http
GET /api/students/orders
```

**Response**

```json
{
  "data": [
    {
      "id": "orderId",
      "status": "pending",
      "total_price": 12,
      "shops": {
        "shop_name": "Lovely Prints",
        "block": "A Block"
      },
      "documents": []
    }
  ]
}
```

---

## 📄 Document & File APIs

### Upload File

```http
POST /api/files/upload
```

**FormData**

```
file: PDF / DOC / JPG / PNG
```

**Response**

```json
{
  "fileKey": "uploads/filename.pdf"
}
```

---

### Add Document to Order

```http
POST /api/students/orders/:orderId/documents
```

**Body**

```json
{
  "fileKey": "uploads/file.pdf",
  "fileName": "resume.pdf",
  "page_count": 2,
  "copies": 3,
  "paper_type_id": "uuid",
  "color_mode_id": "uuid",
  "finish_type_id": "uuid"
}
```

⚠️ **Frontend must NOT calculate price**
Price is computed by backend triggers.

---

### Download Document (Student / Shop Owner)

```http
GET /api/documents/:documentId/download
```

**Response**

```json
{
  "url": "SIGNED_S3_URL"
}
```

---

## 🧾 Pricing Configuration APIs (Shop Owner)

### Paper Types

```http
POST /api/shops/:shopId/paper-types
```

```json
{
  "name": "A4",
  "base_price": 2
}
```

---

### Color Modes

```http
POST /api/shops/:shopId/color-modes
```

```json
{
  "name": "Color",
  "extra_price": 5
}
```

---

### Finish Types

```http
POST /api/shops/:shopId/finish-types
```

```json
{
  "name": "Glossy",
  "extra_price": 3
}
```

---

## 🔁 Application Flow Summary

### 🎓 Student Flow

1. Login
2. View shops
3. Select shop
4. Fetch shop print options
5. Create order
6. Upload file
7. Attach document with configuration
8. Track order status

---

### 🏪 Shop Owner Flow

1. Login
2. Configure pricing options
3. View incoming orders
4. Download documents
5. Update order status
6. Mark orders ready/completed

---

## ⚠️ Important Rules (Frontend Must Follow)

* ❌ Never calculate prices in frontend
* ✅ Always send Bearer token
* ❌ Never trust client-side role
* ✅ Read role from `user_metadata`
* ❌ Do not hardcode print configs

---

## 🧩 Frontend Service Mapping

| Service File        | Responsibility      |
| ------------------- | ------------------- |
| `authService.js`    | login, register, me |
| `studentService.js` | orders, documents   |
| `shopService.js`    | orders, pricing     |
| `api.js`            | axios + token       |

---
