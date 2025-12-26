# iLearn Backend API

Backend API cho nền tảng học tập cá nhân hóa, xây dựng với Express.js, TypeScript, PostgreSQL và Prisma ORM.

## 🎯 Tính năng

- ✅ Quản lý người dùng và xác thực (JWT)
- ✅ Courses/Lessons - Khóa học và bài giảng
- ✅ Flashcards - Thẻ ghi nhớ
- ✅ Quizzes/Tests - Trắc nghiệm và bài kiểm tra
- ✅ Learning Games - Trò chơi học tập đơn giản
- ✅ Progress Tracking - Theo dõi tiến độ học tập
- ✅ AI Content Generation - Tạo nội dung bằng AI (sẵn sàng tích hợp)

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS
- **Container**: Docker & Docker Compose

## 📁 Cấu trúc thư mục

```
ilearn-be/
├── prisma/
│   └── schema.prisma          # Prisma schema
├── src/
│   ├── config/
│   │   ├── constants.ts       # Constants và config
│   │   └── database.ts        # Database connection
│   ├── controllers/           # Request handlers
│   │   └── healthController.ts
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.ts           # Authentication
│   │   └── errorHandler.ts   # Error handling
│   ├── routes/               # API routes
│   │   └── index.ts
│   ├── services/             # Business logic
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── logger.ts         # Winston logger
│   │   └── responseHandler.ts
│   └── index.ts              # App entry point
├── .env                      # Environment variables
├── .env.example             # Environment template
├── docker-compose.yml       # Docker compose config
├── Dockerfile              # Docker image config
├── package.json
└── tsconfig.json
```

## 🚀 Bắt đầu

### Yêu cầu

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14 (hoặc dùng Docker)
- Docker & Docker Compose (tùy chọn)

### Cài đặt

1. **Clone repository và cài đặt dependencies**

```bash
cd ilearn-be
npm install
```

2. **Setup environment variables**

```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin của bạn
```

3. **Khởi động PostgreSQL**

Dùng Docker (khuyến nghị):
```bash
docker-compose up -d postgres
```

Hoặc cài đặt PostgreSQL local và tạo database:
```sql
CREATE DATABASE ilearn_db;
```

4. **Chạy Prisma migrations**

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Khởi động development server**

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

## 🐳 Docker

### Chạy toàn bộ stack với Docker Compose

```bash
# Khởi động cả database và app
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down

# Xóa volumes (cẩn thận - sẽ mất data!)
docker-compose down -v
```

## 📝 Scripts

```bash
# Development
npm run dev              # Chạy dev server với hot reload

# Build
npm run build           # Build TypeScript sang JavaScript

# Production
npm start              # Chạy production server

# Code Quality
npm run lint           # Chạy ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code với Prettier
npm run format:check   # Check formatting

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Chạy database migrations
npm run prisma:studio    # Mở Prisma Studio GUI

# Docker
npm run docker:up      # Khởi động Docker services
npm run docker:down    # Dừng Docker services
npm run docker:logs    # Xem Docker logs
```

## 🔐 Environment Variables

Xem file [.env.example](.env.example) để biết tất cả các biến môi trường cần thiết.

**Quan trọng**: 
- Đổi `JWT_SECRET` trong production
- Đổi database credentials trong production
- Cấu hình CORS cho đúng domain của frontend

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints chính

- **Health Check**: `GET /api/v1/health`
- **Users**: `/api/v1/users` (coming soon)
- **Courses**: `/api/v1/courses` (coming soon)
- **Flashcards**: `/api/v1/flashcards` (coming soon)
- **Quizzes**: `/api/v1/quizzes` (coming soon)

### Response Format

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 🗄 Database Schema

Database schema được định nghĩa trong [prisma/schema.prisma](prisma/schema.prisma)

Các model chính:
- **User**: Người dùng
- **Course**: Khóa học
- **Lesson**: Bài học trong khóa học
- **FlashcardSet**: Bộ flashcard
- **Flashcard**: Thẻ ghi nhớ
- **Quiz**: Bài trắc nghiệm
- **Question**: Câu hỏi
- **Progress**: Tiến độ học tập
- **GameScore**: Điểm số game
- **AIContentLog**: Log nội dung AI tạo

## 🔧 Development

### Thêm migration mới

```bash
# Sau khi sửa schema.prisma
npm run prisma:migrate
```

### Xem database với Prisma Studio

```bash
npm run prisma:studio
```

### Code Style

Project sử dụng:
- **ESLint** cho linting
- **Prettier** cho formatting
- **TypeScript strict mode**

Chạy kiểm tra trước khi commit:
```bash
npm run lint
npm run format:check
```

## 🚢 Production Deployment

### 1. Build Docker image

```bash
docker build -t ilearn-backend .
```

### 2. Chạy với Docker Compose (production mode)

```bash
# Sửa docker-compose.yml cho production
# Đổi NODE_ENV=production
# Sử dụng production database credentials
docker-compose up -d
```

### 3. Chạy migrations

```bash
docker-compose exec app npm run prisma:migrate
```

## 🎯 Roadmap

- [ ] Authentication & Authorization APIs
- [ ] Course Management APIs
- [ ] Flashcard APIs
- [ ] Quiz APIs
- [ ] Progress Tracking APIs
- [ ] AI Integration (OpenAI/Anthropic)
- [ ] File Upload (Images, PDFs)
- [ ] Email Notifications
- [ ] Caching (Redis)
- [ ] Rate Limiting
- [ ] API Documentation (Swagger)
- [ ] Unit & Integration Tests

## 📄 License

ISC

## 👥 Author

Kaito

---

**Happy Learning! 📚✨**
