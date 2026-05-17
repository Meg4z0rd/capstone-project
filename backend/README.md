# LumiSkin Backend API

Backend untuk proyek **LumiSkin** - Capstone CC26-PSU356  
Stack: **Express.js + PostgreSQL + JWT**

---

## 📁 Struktur Folder

```
lumiskin-backend/
├── src/
│   ├── app.js                    # Entry point Express
│   ├── config/
│   │   ├── db.js                 # Koneksi PostgreSQL (pg Pool)
│   │   └── migrate.js            # Script buat tabel (jalankan sekali)
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Forgot Password
│   │   └── analysisController.js # Analisis kulit + riwayat
│   ├── middleware/
│   │   ├── auth.js               # Verifikasi JWT token
│   │   └── upload.js             # Multer file upload handler
│   ├── models/
│   │   ├── User.js               # Query tabel users
│   │   └── Analysis.js           # Query tabel analysis_history
│   ├── routes/
│   │   ├── auth.js               # /auth/*
│   │   └── analyze.js            # /analyze/*
│   └── utils/
│       ├── jwt.js                # Generate & verify token
│       └── response.js           # Format standar response API
└── uploads/                      # Folder penyimpanan foto wajah
```

---

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
# Edit .env sesuai konfigurasi PostgreSQL kamu
```

### 3. Buat database PostgreSQL
```sql
CREATE DATABASE lumiskin_db;
```

### 4. Jalankan migrasi (buat tabel)
```bash
npm run migrate
```

### 5. Jalankan server
```bash
npm run dev       # development (nodemon)
npm start         # production
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint              | Body                          | Auth |
|--------|-----------------------|-------------------------------|------|
| POST   | `/auth/register`      | `name, email, password`       | ❌   |
| POST   | `/auth/login`         | `email, password`             | ❌   |
| POST   | `/auth/forgot-password` | `email`                     | ❌   |
| GET    | `/auth/me`            | -                             | ✅   |

### Analisis
| Method | Endpoint              | Body                                         | Auth       |
|--------|-----------------------|----------------------------------------------|------------|
| POST   | `/analyze`            | `image (file/base64), skinType, concerns[]`  | Opsional   |
| GET    | `/analyze/history`    | -                                            | ✅         |
| GET    | `/analyze/history/:id`| -                                            | ✅         |

### Format Response
```json
{
  "success": true,
  "message": "Login berhasil!",
  "data": {
    "user": { "id": 1, "name": "...", "email": "..." },
    "token": "eyJ..."
  }
}
```

### Cara Kirim Token
```
Authorization: Bearer <token>
```

---

## 🔗 Integrasi ke Frontend

Di `frontend/src/services/api.js`, token sudah otomatis dikirim jika disimpan di localStorage.  
Pastikan `BASE_URL` di api.js sesuai: `http://localhost:5000`
