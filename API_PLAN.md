# iLearn Backend - API Modules Plan

## 🎯 Phase 1: Authentication & User Management (PRIORITY)

### 1. Auth Module

**Endpoints:**

- `POST /api/v1/auth/register` - Đăng ký tài khoản mới
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Đăng xuất
- `POST /api/v1/auth/forgot-password` - Quên mật khẩu (gửi email/code)
- `POST /api/v1/auth/reset-password` - Reset mật khẩu với token
- `POST /api/v1/auth/change-password` - Đổi mật khẩu (khi đã login)
- `GET /api/v1/auth/me` - Lấy thông tin user hiện tại

### 2. User Module

**Endpoints:**

- `GET /api/v1/users` - Lấy danh sách users (Admin)
- `GET /api/v1/users/:id` - Lấy thông tin user
- `PUT /api/v1/users/:id` - Cập nhật profile
- `DELETE /api/v1/users/:id` - Xóa user (Admin)
- `PUT /api/v1/users/:id/avatar` - Upload avatar

---

## 🎯 Phase 2: Learning Content Management

### 3. Course Module

**Endpoints:**

- `GET /api/v1/courses` - Lấy danh sách khóa học (public + enrolled)
- `GET /api/v1/courses/:id` - Chi tiết khóa học
- `POST /api/v1/courses` - Tạo khóa học mới
- `PUT /api/v1/courses/:id` - Cập nhật khóa học
- `DELETE /api/v1/courses/:id` - Xóa khóa học
- `POST /api/v1/courses/:id/enroll` - Enroll vào khóa học
- `GET /api/v1/courses/:id/progress` - Tiến độ học của user

### 4. Lesson Module

**Endpoints:**

- `GET /api/v1/courses/:courseId/lessons` - Lấy danh sách bài học
- `GET /api/v1/lessons/:id` - Chi tiết bài học
- `POST /api/v1/courses/:courseId/lessons` - Tạo bài học mới
- `PUT /api/v1/lessons/:id` - Cập nhật bài học
- `DELETE /api/v1/lessons/:id` - Xóa bài học
- `POST /api/v1/lessons/:id/complete` - Đánh dấu hoàn thành

---

## 🎯 Phase 3: Flashcard System

### 5. Flashcard Module

**Endpoints:**

- `GET /api/v1/flashcards/sets` - Lấy danh sách flashcard sets
- `GET /api/v1/flashcards/sets/:id` - Chi tiết flashcard set
- `POST /api/v1/flashcards/sets` - Tạo flashcard set mới
- `PUT /api/v1/flashcards/sets/:id` - Cập nhật set
- `DELETE /api/v1/flashcards/sets/:id` - Xóa set
- `GET /api/v1/flashcards/sets/:setId/cards` - Lấy cards trong set
- `POST /api/v1/flashcards/sets/:setId/cards` - Thêm card vào set
- `PUT /api/v1/flashcards/:id` - Cập nhật card
- `DELETE /api/v1/flashcards/:id` - Xóa card
- `POST /api/v1/flashcards/sets/:setId/study` - Bắt đầu học flashcard

---

## 🎯 Phase 4: Quiz & Test System

### 6. Quiz Module

**Endpoints:**

- `GET /api/v1/quizzes` - Lấy danh sách quiz
- `GET /api/v1/quizzes/:id` - Chi tiết quiz
- `POST /api/v1/quizzes` - Tạo quiz mới
- `PUT /api/v1/quizzes/:id` - Cập nhật quiz
- `DELETE /api/v1/quizzes/:id` - Xóa quiz
- `POST /api/v1/quizzes/:id/start` - Bắt đầu làm quiz
- `POST /api/v1/quizzes/:id/submit` - Nộp bài quiz
- `GET /api/v1/quizzes/:id/results` - Xem kết quả quiz
- `GET /api/v1/quizzes/:id/attempts` - Lịch sử làm quiz

### 7. Question Module

**Endpoints:**

- `GET /api/v1/quizzes/:quizId/questions` - Lấy câu hỏi của quiz
- `POST /api/v1/quizzes/:quizId/questions` - Thêm câu hỏi
- `PUT /api/v1/questions/:id` - Cập nhật câu hỏi
- `DELETE /api/v1/questions/:id` - Xóa câu hỏi

---

## 🎯 Phase 5: Game System

### 8. Game Module

**Endpoints:**

- `GET /api/v1/games` - Lấy danh sách games
- `GET /api/v1/games/:type` - Chi tiết game type
- `POST /api/v1/games/:type/start` - Bắt đầu game
- `POST /api/v1/games/:type/score` - Lưu điểm
- `GET /api/v1/games/leaderboard` - Bảng xếp hạng
- `GET /api/v1/games/my-scores` - Điểm của user

---

## 🎯 Phase 6: AI Content Generation

### 9. AI Module

**Endpoints:**

- `POST /api/v1/ai/generate/lesson` - Generate lesson content
- `POST /api/v1/ai/generate/flashcards` - Generate flashcards
- `POST /api/v1/ai/generate/quiz` - Generate quiz questions
- `POST /api/v1/ai/improve/content` - Cải thiện nội dung
- `GET /api/v1/ai/usage` - Thống kê AI usage

---

## 🎯 Phase 7: Progress & Analytics

### 10. Progress Module

**Endpoints:**

- `GET /api/v1/progress/overview` - Tổng quan tiến độ
- `GET /api/v1/progress/courses/:courseId` - Tiến độ khóa học
- `GET /api/v1/progress/stats` - Thống kê học tập
- `GET /api/v1/progress/history` - Lịch sử học tập

---

## 📊 Implementation Priority

### PHASE 1 (Start Now) - Core Features:

1. ✅ Auth: Register, Login, Logout, Me
2. ✅ User: Get profile, Update profile
3. ✅ Auth: Forgot/Reset/Change password

### PHASE 2 - Content:

4. Course: CRUD + Enroll
5. Lesson: CRUD + Complete

### PHASE 3 - Practice:

6. Flashcard: CRUD + Study
7. Quiz: CRUD + Attempt

### PHASE 4 - Advanced:

8. Game system
9. AI generation
10. Analytics

---

## 🔧 Technical Notes

- **Authentication**: JWT-based (access + refresh tokens)
- **Authorization**: Role-based (USER, ADMIN)
- **Validation**: express-validator
- **File Upload**: For avatars, course thumbnails
- **Pagination**: All list endpoints
- **Search**: Full-text search for courses
- **AI Integration**: OpenAI/Anthropic API (optional, cost-effective)
