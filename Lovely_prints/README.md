
# 📘 Lovely Prints – Backend API Documentation

Campus Digital Print Service
Backend: **Node.js + Express + Supabase + Razorpay**

---

## 🌐 Base URL

```txt
http://localhost:3000/api
```

All requests (except auth + public shop listing) require:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 👥 Roles

| Role         | Description                      |
| ------------ | -------------------------------- |
| `student`    | Places orders, uploads documents |
| `shop_owner` | Manages shop, pricing, orders    |
| `admin`      | (future use)                     |

Role is stored in **Supabase Auth → user_metadata.role**
Backend enforces roles using middleware.

---

# 🔐 Authentication

## 1️⃣ Register

**POST** `/auth/register`

```json
{
  "name": "Student One",
  "email": "student@gmail.com",
  "password": "password123",
  "role": "student"
}
```

**Response**

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## 2️⃣ Login

**POST** `/auth/login`

```json
{
  "email": "student@gmail.com",
  "password": "password123"
}
```

**Response**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "JWT_TOKEN",
    "user": {
      "id": "uuid",
      "role": "student"
    }
  }
}
```

➡️ **Frontend**: Store `access_token` in memory / localStorage.

---

## 3️⃣ Get Current User

**GET** `/auth/me`

🔒 Requires token

**Response**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@gmail.com",
      "role": "student"
    }
  }
}
```

---

# 🏪 Shops (Public + Student)

## 4️⃣ Get All Active Shops

**GET** `/shops`

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "shop_uuid",
      "shop_name": "Lovely Prints",
      "block": "A Block"
    }
  ]
}
```

---

## 5️⃣ Get Shop Details

**GET** `/shops/:shopId`

---

## 6️⃣ Get Shop Print Options (Student)

**GET** `/shops/:shopId/options`

**Response**

```json
{
  "success": true,
  "data": {
    "paper_types": [
      { "id": "uuid", "name": "A4", "base_price": 1 }
    ],
    "color_modes": [
      { "id": "uuid", "name": "BW", "extra_price": 0 }
    ],
    "finish_types": [
      { "id": "uuid", "name": "Glossy", "extra_price": 2 }
    ]
  }
}
```

➡️ **Frontend**:
Populate dropdowns / radio buttons from this API.
**Never calculate prices on frontend.**

---

# 🎓 Student APIs

## 7️⃣ Create Order

**POST** `/students/orders`

🔒 Role: `student`

```json
{
  "shop_id": "shop_uuid",
  "description": "Print my resume"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": "order_uuid",
    "order_no": 2,
    "status": "pending",
    "is_paid": false
  }
}
```

---

## 8️⃣ Upload File

**POST** `/files/upload`

Form-Data:

* `file`: PDF / DOC / Image

**Response**

```json
{
  "success": true,
  "data": {
    "fileKey": "uploads/1765993757539-resume.pdf"
  }
}
```

---

## 9️⃣ Attach Document to Order

**POST** `/students/orders/:orderId/documents`

```json
{
  "fileKey": "uploads/1765993757539-resume.pdf",
  "fileName": "resume.pdf",
  "page_count": 2,
  "copies": 3,
  "paper_type_id": "uuid",
  "color_mode_id": "uuid",
  "finish_type_id": "uuid"
}
```

**Response**

```json
{
  "success": true,
  "message": "Document added successfully",
  "data": {
    "total_price": 6
  }
}
```

➡️ **Backend**:

* Calculates document price
* Updates order total via trigger

---

## 🔁 Get Student Orders

**GET** `/students/orders`

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "order_uuid",
      "order_no": 2,
      "status": "ready",
      "is_paid": true,
      "total_price": 12,
      "documents": [...]
    }
  ]
}
```

➡️ **Frontend**:
Poll / refresh after status changes.

---

# 💳 Payments (Razorpay – Single Merchant Mode)

## 10️⃣ Create Payment Order

**POST** `/payments/create-order`

```json
{
  "orderId": "order_uuid"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": "razorpay_order_id",
    "amount": 9600,
    "currency": "INR"
  }
}
```

➡️ **Frontend**:

* Use Razorpay Checkout
* Collect `payment_id`, `signature`

---

## 11️⃣ Verify Payment

**POST** `/payments/verify`

```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature",
  "orderId": "order_uuid"
}
```

**Response**

```json
{
  "success": true,
  "message": "Payment successful"
}
```

➡️ Backend:

* Verifies signature
* Marks payment success
* Sets:

  * `orders.is_paid = true`
  * `orders.status = confirmed`

---

# 🏪 Shop Owner APIs (UPDATED)

---

## 12️⃣ Get Shop Orders (Owner Scoped)

**GET** `/shops/me/orders`

🔒 Role: `shop_owner`
🔐 Shop is derived from **access token** (no shopId required)

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "order_uuid",
      "order_no": 2,
      "status": "confirmed",
      "student_id": "student_uuid",
      "student": {
        "name": "Rahul Sharma"
      },
      "documents": [
        {
          "id": "document_uuid",
          "file_name": "resume.pdf",
          "page_count": 2,
          "copies": 3,
          "total_price": 12,
          "paper_types": { "name": "A4" },
          "color_modes": { "name": "BW" },
          "finish_types": { "name": "Glossy" }
        }
      ]
    }
  ]
}
```

### 🧠 Notes

* Shop ownership is resolved via `shops.owner_id = auth.uid()`
* Student name is fetched via secure server-side join
* Uses **service role internally** to bypass RLS safely

---

## 13️⃣ Update Order Status (FINAL)

**PUT** `/orders/:orderId/status`

🔒 Role: `shop_owner`

```json
{
  "status": "ready"
}
```

### Allowed Status Flow

```txt
pending → confirmed → printing → ready → completed
```

**Response**

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": "order_uuid",
    "status": "ready"
  }
}
```

### 🧠 Backend Behavior

* Validates status transition
* Uses RLS to ensure shop owner owns the order
* Reflected instantly in student dashboard

---

## 14️⃣ Secure Document Download (UPDATED)

**GET** `/documents/:documentId/download`

🔒 Access:

* Student → owns the order
* Shop Owner → owns the shop

**Response**

```json
{
  "success": true,
  "data": {
    "url": "SIGNED_S3_URL"
  }
}
```

⏱️ URL expires in **5 minutes**

### ⚠️ Important

* ❌ Document URLs are **never stored or exposed directly**
* ✅ Signed URLs are generated **per request**
* ✅ Secure by design

---

# 🧠 Important Design Notes (UPDATED)

* ❌ Frontend never calculates price
* ❌ Frontend never uses direct file URLs
* ✅ Pricing controlled by shop owner
* ✅ Shop ownership derived from token
* ✅ RLS + role middleware both active
* ✅ Orders scoped per shop owner
* ✅ Secure downloads only
* ✅ Payments verified server-side
* ✅ Status transitions validated on backend




# ⚠️ Error Format (Standard)

```json
{
  "success": false,
  "message": "Access denied"
}
```

Frontend should:

* Show toast
* Redirect if 401/403

---

## 🧩 Frontend Service Mapping

| Service File        | Responsibility      |
| ------------------- | ------------------- |
| `authService.js`    | login, register, me |
| `studentService.js` | orders, documents   |
| `shopService.js`    | orders, pricing     |
| `api.js`            | axios + token       |
---

Updated readme