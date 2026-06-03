# LumiSkin Backend API

Backend API untuk **LumiSkin** — Aplikasi Analisis Kulit & Konsultasi Skincare AI  
Capstone Project **CC26-PSU356** · Coding Camp 2026 powered by DBS Foundation

**Stack:** Express.js · PostgreSQL · Prisma ORM · JWT · Groq AI

---

## 📁 Struktur Folder

```
backend/
├── prisma/
│   ├── schema.prisma              # Database schema (Prisma ORM)
│   └── migrations/                # Migration files
├── src/
│   ├── app.js                     # Entry point Express + middleware
│   ├── config/
│   │   ├── passport.js            # Google OAuth strategy
│   │   └── prisma.js              # Prisma client instance
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Forgot/Reset Password, Profile
│   │   └── predicController.js    # Analisis kulit + riwayat
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication middleware
│   │   └── upload.js              # Multer file upload handler
│   ├── models/
│   │   ├── User.js                # User database queries
│   │   └── Analysis.js            # Analysis history queries
│   ├── routes/
│   │   ├── auth.js                # /auth/* routes
│   │   ├── analyze.js             # /analyze/* routes
│   │   └── chat.js                # /chat route (AI chat)
│   └── utils/
│       ├── email.js               # Nodemailer (reset password email)
│       ├── jwt.js                  # Generate & verify JWT token
│       ├── logger.js              # Pino logger (structured logging)
│       └── response.js            # Standar format response API
├── uploads/                       # Folder penyimpanan foto (git-ignored)
├── logs/                          # Log files (git-ignored)
├── .env                           # Environment variables (git-ignored)
├── .env.example                   # Template environment variables
├── package.json
└── package-lock.json
```

---

## 🚀 Cara Menjalankan

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Setup environment

```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lumiskin_db

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=12h
SESSION_SECRET=your_session_secret_here

# Groq AI (untuk fitur chat)
GROQ_API_KEY=gsk_xxxxx

# ML Model Server (untuk fitur analisis kulit)
ML_MODEL_URL=http://localhost:8000

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx

# Email (Gmail - gunakan App Password)
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM_NAME=LumiSkin
```

### 3. Setup database

```bash
# Buat database PostgreSQL
psql -U postgres -c "CREATE DATABASE lumiskin_db;"

# Jalankan migrasi Prisma
npm run migrate

# Generate Prisma client
npm run db:generate
```

### 4. Jalankan server

```bash
npm run dev       # development (nodemon + hot reload)
npm start         # production
```

Server berjalan di `http://localhost:5000`

---

## 📡 API Endpoints

### Auth

| Method | Endpoint                | Deskripsi                    | Auth |
|--------|-------------------------|------------------------------|------|
| POST   | `/auth/register`        | Daftar akun baru             | ❌   |
| POST   | `/auth/login`           | Login email + password       | ❌   |
| POST   | `/auth/forgot-password` | Kirim email reset password   | ❌   |
| POST   | `/auth/reset-password`  | Reset password dengan token  | ❌   |
| GET    | `/auth/me`              | Data user yang sedang login  | ✅   |
| PUT    | `/auth/update-profile`  | Update nama                  | ✅   |
| PUT    | `/auth/change-password` | Ubah password                | ✅   |
| GET    | `/auth/google`          | Login via Google OAuth       | ❌   |
| GET    | `/auth/google/callback` | Callback Google OAuth        | ❌   |

### Analisis Kulit

| Method | Endpoint               | Deskripsi                              | Auth       |
|--------|------------------------|----------------------------------------|------------|
| POST   | `/analyze`             | Analisis foto kulit via ML model       | Opsional   |
| GET    | `/analyze/history`     | Riwayat analisis user                  | ✅         |
| GET    | `/analyze/history/:id` | Detail analisis tertentu               | ✅         |

### Chat AI

| Method | Endpoint | Deskripsi                          | Auth |
|--------|----------|------------------------------------|------|
| POST   | `/chat`  | Chat konsultasi kulit dengan AI    | ✅   |

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "Cara mengatasi jerawat?" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Untuk mengatasi jerawat, kamu bisa..."
}
```

> **Catatan:** System prompt di-hardcode di backend. Frontend tidak perlu mengirim `system`.
> Model AI yang diizinkan: `llama-3.1-8b-instant`, `llama-3.3-70b-versatile`.

---

## 🔒 Keamanan

| Fitur | Detail |
|-------|--------|
| **Helmet** | Security headers otomatis |
| **Rate Limiting** | Login (10/15min), Register (5/jam), Chat (30/15min), Analyze (20/jam) |
| **JWT Authentication** | Token di header `Authorization: Bearer <token>` |
| **Password Hashing** | bcrypt dengan salt rounds 10 |
| **Input Validation** | express-validator di setiap endpoint |
| **System Prompt Protection** | Hardcoded di backend, tidak bisa diubah dari frontend |
| **Model Whitelist** | Hanya model AI tertentu yang diizinkan |
| **Role Filtering** | Messages dengan role selain `user`/`assistant` ditolak |
| **Log Redaction** | Password, token, cookie otomatis di-redact dari log |

---

## 📋 Format Response Standar

**Sukses:**
```json
{
  "success": true,
  "message": "Login berhasil!",
  "data": {
    "user": { "id": 1, "name": "John", "email": "john@mail.com" },
    "token": "eyJhbGciOi..."
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Email atau password salah."
}
```

---

## 🔗 Cara Kirim Token (untuk Frontend)

```js
fetch("http://localhost:5000/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>"
  },
  body: JSON.stringify({ messages: [...] })
});
```

Token didapat dari response `/auth/login` atau `/auth/google/callback`.

---

## 🛠️ NPM Scripts

| Script | Perintah | Keterangan |
|--------|----------|------------|
| `npm start` | `node src/app.js` | Jalankan di production |
| `npm run dev` | `nodemon src/app.js` | Development + hot reload |
| `npm run migrate` | `prisma migrate dev` | Jalankan migrasi DB |
| `npm run migrate:deploy` | `prisma migrate deploy` | Deploy migrasi ke production |
| `npm run db:generate` | `prisma generate` | Generate Prisma client |
| `npm run db:studio` | `prisma studio` | GUI browser database |

---

## 📦 Dependencies

| Package | Fungsi |
|---------|--------|
| `express` | Web framework |
| `@prisma/client` | ORM database |
| `bcryptjs` | Hash password |
| `jsonwebtoken` | JWT auth |
| `passport` + `passport-google-oauth20` | Google OAuth |
| `express-rate-limit` | Rate limiting |
| `helmet` | Security headers |
| `express-validator` | Input validation |
| `multer` | File upload |
| `nodemailer` | Kirim email |
| `pino` + `pino-http` | Structured logging |
| `cors` | Cross-origin resource sharing |
