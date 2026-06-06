# 🌍 Travel Explorer

<p align="center">
  <strong>Ứng dụng du lịch full-stack được xây dựng bằng React Native + Expo, Express và MongoDB.</strong>
</p>

<p align="center">
  Khám phá địa điểm, lưu yêu thích, đặt chuyến đi, xác thực OTP qua email và trò chuyện với AI Travel Assistant trong một trải nghiệm mobile hiện đại.
</p>

<p align="center">
  <img alt="Expo SDK 54" src="https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo" />
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=111" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=fff" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-%3E%3D20-339933?style=for-the-badge&logo=node.js&logoColor=fff" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=fff" />
</p>

---

## 🚀 Introduction

**Travel Explorer** là một travel mobile app được thiết kế theo hướng production-ready để showcase năng lực React Native, kiến trúc frontend sạch và backend REST API thực tế.

Project không chỉ dừng ở UI mockup. Ứng dụng đã có backend riêng để quản lý dữ liệu MongoDB, seed dữ liệu mẫu khi chạy lần đầu, xác thực tài khoản, OTP qua email, lưu địa điểm yêu thích, đặt chuyến đi và gợi ý du lịch bằng AI.

Frontend sử dụng **Expo Router** làm entry point, sau đó điều hướng qua custom navigator trong `src/navigation` để giữ thư mục `app/` tối giản và toàn bộ màn hình nằm trong `src/screens`.

---

## ✨ Features

- 🔐 **Authentication flow**
  - Đăng ký, đăng nhập, đăng xuất.
  - Gửi OTP xác thực email khi tạo tài khoản.
  - Quên mật khẩu qua OTP email.

- 🏠 **Travel discovery**
  - Trang chủ hiển thị địa điểm nổi bật, popular places và trip packages.
  - Tìm kiếm địa điểm theo tên, quốc gia, category.
  - Xem chi tiết địa điểm, gallery, rating, giá và mô tả.

- ❤️ **Favorites**
  - Lưu / bỏ lưu địa điểm yêu thích.
  - Đồng bộ favorite list theo user qua backend.

- 📅 **Booking**
  - Đặt chuyến đi theo địa điểm và số khách.
  - Chọn ngày đi bằng calendar picker trong app.
  - Chặn booking nếu ngày đi rỗng, sai định dạng hoặc không sau ngày hiện tại.
  - Backend validate lại ngày trước khi ghi DB.

- 🤖 **AI Travel Assistant**
  - Chat với AI để hỏi lịch trình, ngân sách, hành lý, điểm đến.
  - Backend route `/api/ai/travel` kết hợp AI provider và dữ liệu địa điểm trong DB.

- 👤 **Profile**
  - Xem hồ sơ, điểm thưởng, số chuyến đi, bucket list.
  - Sửa thông tin cá nhân.
  - Upload ảnh đại diện bằng `expo-image-picker`.
  - Gửi OTP khi user đổi email.

- 🌗 **Theme system**
  - Light mode / Dark mode.
  - Theme tập trung trong `src/theme`.

- 🌐 **Localization**
  - Hỗ trợ Tiếng Việt và English.
  - Translation tách trong `src/localization`.

- 🧩 **Reusable components**
  - Button, input, date picker, card, header, section, empty state, loading view.
  - Screen code gọn, UI logic được tách thành component.

---

## 🛠 Tech Stack

| Layer | Technology | Vai trò |
| --- | --- | --- |
| Mobile | Expo SDK 54 | Runtime và tooling cho React Native app |
| UI | React Native 0.81, React 19 | Xây dựng giao diện mobile |
| Language | TypeScript | Type-safe frontend |
| Navigation | Expo Router + custom NavigationContext | Entry route và điều hướng nội bộ |
| Icons | `@expo/vector-icons` | Icon system cho tab, button, input |
| Image | `expo-image`, `expo-image-picker` | Hiển thị ảnh và chọn avatar |
| State | React Context | App state, auth token, theme, language, booking, favorites |
| Backend | Node.js + Express | REST API |
| Database | MongoDB | Lưu users, sessions, places, bookings, notifications |
| Email | Nodemailer / Resend | Gửi OTP xác thực và khôi phục tài khoản |
| AI | AI provider qua backend service | Travel assistant |
| Build | EAS config | Android preview APK profile |

---

## 📂 Project Structure

```txt
travel-app/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── data/
│   │   │   └── seedData.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errors.js
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── appContentRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── placeRoutes.js
│   │   │   ├── tripPackageRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   ├── emailService.js
│   │   │   ├── mongoClient.js
│   │   │   └── travelAiService.js
│   │   ├── store/
│   │   │   └── mongoStore.js
│   │   └── utils/
│   │       └── date.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── src/
│   │   ├── components/
│   │   │   ├── buttons/
│   │   │   ├── cards/
│   │   │   ├── common/
│   │   │   ├── headers/
│   │   │   ├── inputs/
│   │   │   └── sections/
│   │   ├── hooks/
│   │   ├── localization/
│   │   ├── navigation/
│   │   ├── screens/
│   │   │   ├── About/
│   │   │   ├── AiChat/
│   │   │   ├── Auth/
│   │   │   ├── Bookings/
│   │   │   ├── Details/
│   │   │   ├── FavoritePlaces/
│   │   │   ├── Home/
│   │   │   ├── Notification/
│   │   │   ├── Onboarding/
│   │   │   ├── PopularPlaces/
│   │   │   ├── Profile/
│   │   │   ├── Schedule/
│   │   │   └── Search/
│   │   ├── services/
│   │   ├── store/
│   │   ├── theme/
│   │   ├── types/
│   │   └── utils/
│   ├── app.json
│   ├── eas.json
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone project

```bash
git clone <your-repository-url>
cd travel-app
```

### 2. Cài backend dependencies

```bash
cd backend
npm install
```

Tạo file `.env` trong `backend/` dựa trên `.env.example`:

```env
PORT=4000
CORS_ORIGIN=*
URL_MONGO_DB=mongodb+srv://...
MONGO_DB_NAME=travel_app

AI_KEY=your_ai_key
AI_PROVIDER_URL=your_ai_provider_url
AI_MODEL=your_ai_model

MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_SERVICE=gmail
MAIL_TIMEOUT_MS=15000

KEY_RESEND_VERIFICATION_EMAIL=your_resend_key
RESEND_FROM_EMAIL=Travel Explorer <noreply@your-domain.com>
```

> Backend sẽ tự tạo indexes và seed dữ liệu mẫu vào MongoDB khi collection đang rỗng.

### 3. Cài frontend dependencies

```bash
cd ../frontend
npm install
```

Tạo file `.env` trong `frontend/`:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000/api
EXPO_PUBLIC_API_TIMEOUT_MS=10000
```

Nếu chạy trên điện thoại thật qua Expo Go, hãy thay `localhost` bằng IP LAN của máy đang chạy backend:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:4000/api
```

---

## ▶️ Usage

### Chạy backend

```bash
cd backend
npm run dev
```

API mặc định chạy tại:

```txt
http://localhost:4000/api
```

Kiểm tra health check:

```bash
curl http://localhost:4000/api/health
```

### Chạy mobile app

```bash
cd frontend
npx expo start
```

Sau khi Expo CLI mở, bạn có thể chạy bằng:

- Android Emulator
- iOS Simulator
- Expo Go trên điện thoại thật
- Web preview nếu cần kiểm tra nhanh UI

### Build Android preview APK

```bash
cd frontend
eas build --profile preview --platform android
```

---

## 🔌 API

Base URL:

```txt
http://localhost:4000/api
```

Protected endpoints sử dụng Bearer token:

```http
Authorization: Bearer <token-from-sign-in>
```

| Method | Endpoint | Auth | Mô tả |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Kiểm tra trạng thái API |
| `POST` | `/auth/sign-up` | No | Tạo tài khoản và gửi OTP email |
| `POST` | `/auth/sign-in` | No | Đăng nhập, trả về session token |
| `POST` | `/auth/forgot-password` | No | Gửi OTP khôi phục mật khẩu |
| `POST` | `/auth/verify-otp` | No | Xác thực OTP cho email/password reset |
| `POST` | `/auth/sign-out` | Yes | Xóa session hiện tại |
| `GET` | `/app-content` | No | Lấy onboarding slides, avatar mẫu, AI starter messages |
| `GET` | `/places` | No | Lấy danh sách địa điểm, hỗ trợ `search`, `popular`, `category`, `country` |
| `GET` | `/places/:placeId` | No | Lấy chi tiết địa điểm |
| `GET` | `/trip-packages` | No | Lấy gói du lịch, hỗ trợ filter theo `placeId` |
| `GET` | `/trip-packages/:packageId` | No | Lấy chi tiết gói du lịch |
| `GET` | `/notifications` | No | Lấy thông báo, hỗ trợ filter `status` |
| `DELETE` | `/notifications` | No | Xóa thông báo theo `status` hoặc toàn bộ |
| `GET` | `/users/me` | Yes | Lấy hồ sơ user hiện tại |
| `PATCH` | `/users/me` | Yes | Cập nhật hồ sơ, gửi OTP nếu đổi email |
| `GET` | `/users/me/favorites` | Yes | Lấy danh sách địa điểm yêu thích |
| `POST` | `/users/me/favorites/:placeId` | Yes | Thêm địa điểm yêu thích |
| `DELETE` | `/users/me/favorites/:placeId` | Yes | Xóa địa điểm yêu thích |
| `PATCH` | `/users/me/favorites/:placeId/toggle` | Yes | Toggle favorite |
| `GET` | `/bookings` | Yes | Lấy booking của user |
| `POST` | `/bookings` | Yes | Tạo booking, yêu cầu `placeId`, `guests`, `travelDate` |
| `POST` | `/ai/travel` | No | Gửi prompt tới AI Travel Assistant và trả về gợi ý địa điểm |

Ví dụ tạo booking:

```json
{
  "placeId": "place-bali",
  "guests": 2,
  "travelDate": "2026-06-07"
}
```

---

## 🧱 Architecture

### Frontend

- `frontend/app/_layout.tsx` và `frontend/app/index.tsx` là entry point của Expo Router.
- Toàn bộ UI thật nằm trong `frontend/src`.
- `src/navigation/AppNavigator.tsx` quyết định màn hình hiện tại dựa trên `NavigationContext`.
- `src/navigation/MainTabLayout.tsx` giữ bottom tab dùng chung ở các màn chính.
- `src/store/AppContext.tsx` quản lý:
  - auth token
  - user profile
  - theme mode
  - language
  - places, trip packages, notifications
  - favorites, bookings
  - AI chat messages
- `src/services/apiClient.ts` cấu hình API base URL, timeout và Bearer token.
- `src/services/travelApi.ts` gom toàn bộ request frontend tới backend.
- `src/components` tách UI reusable để screen không bị dài và không duplicate.

### Backend

- `backend/src/app.js` cấu hình Express app, CORS, JSON parser, routes và error handler.
- `backend/src/server.js` khởi động HTTP server.
- `backend/src/services/mongoClient.js` kết nối MongoDB, tạo indexes và seed dữ liệu mẫu.
- `backend/src/store/mongoStore.js` là data access layer cho users, places, bookings, favorites, notifications.
- `backend/src/routes` tách REST API theo domain.
- `backend/src/services/emailService.js` gửi OTP qua Nodemailer hoặc Resend.
- `backend/src/services/travelAiService.js` gọi AI provider, có fallback/local behavior khi cần.

### Data flow

```txt
Expo Screen
  → AppContext / hooks
  → travelApi
  → Express route
  → mongoStore
  → MongoDB
```

---

## 🧪 Future Improvements

- 🧾 Thêm test suite cho frontend components và backend routes.
- 🔒 Hash password bằng `bcrypt` và bổ sung rate limit cho OTP/auth endpoints.
- 🔁 Thêm refresh token hoặc session expiration policy.
- 💳 Tích hợp payment flow cho booking.
- 🗺️ Thêm bản đồ địa điểm bằng map provider.
- 🔔 Push notifications cho booking update và khuyến mãi.
- 📦 Offline cache cho places/favorites bằng local storage.
- 📊 Admin dashboard để quản lý địa điểm, gói du lịch và booking.
- 🚀 CI/CD pipeline cho lint, type-check, build preview APK.

---

## 👨‍💻 Author

**Nguyễn Tấn Nghị**