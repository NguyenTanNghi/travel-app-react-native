# Travel App Backend

Express REST API for the Expo travel app.

## Run

```bash
npm install
npm run dev
```

The API defaults to `http://localhost:4000/api`.

## Database

All API data is read from and written to MongoDB through `URL_MONGO_DB`.

```env
URL_MONGO_DB=mongodb+srv://...
MONGO_DB_NAME=travel_app
```

On first startup, the backend seeds base travel content into MongoDB only when those collections are empty.

## Email OTP

Set these in `.env`:

```env
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_SERVICE=gmail
```

`MAIL_PASSWORD` should be an app password when using Gmail.

## Main Endpoints

- `GET /api/health`
- `POST /api/auth/sign-in`
- `POST /api/auth/sign-up` sends an account verification OTP email
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `GET /api/app-content`
- `GET /api/places?search=&popular=true&category=&country=`
- `GET /api/places/:placeId`
- `GET /api/trip-packages`
- `GET /api/schedule`
- `GET /api/notifications?status=recent`
- `DELETE /api/notifications?status=recent`
- `GET /api/users/me`
- `PATCH /api/users/me` sends an OTP email when `email` changes
- `GET /api/users/me/favorites`
- `POST /api/users/me/favorites/:placeId`
- `DELETE /api/users/me/favorites/:placeId`
- `POST /api/bookings`
- `POST /api/ai/travel`

Protected endpoints require:

```http
Authorization: Bearer <token-from-sign-in>
```
