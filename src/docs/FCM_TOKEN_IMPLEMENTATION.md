# FCM Token Storage Implementation Guide

## Overview
This implementation provides a complete solution for storing FCM tokens with uniqueness constraints across user email and platform combinations.

## Features Implemented

### 1. Uniqueness Constraints
- **Unique combination**: (user_id, platform) ensures each email can only have one token per platform
- **Platforms supported**: android, iOS, web
- **Upsert logic**: Automatically updates existing tokens instead of creating duplicates

### 2. API Endpoints

#### POST `/api/fcm-token`
- **Purpose**: Create or update FCM token
- **Body**: `{ token, email, platform }`
- **Response**: Returns created/updated token with action type

#### GET `/api/fcm-token`
- **Purpose**: Get token for specific email and optional platform
- **Query params**: `email` (required), `platform` (optional)

#### GET `/api/fcm-token?email=xxx` (GET_ALL)
- **Purpose**: Get all tokens for a user
- **Query params**: `email` (required)

#### PUT `/api/fcm-token`
- **Purpose**: Update existing token
- **Body**: `{ token, email, platform }`

#### DELETE `/api/fcm-token`
- **Purpose**: Remove token for specific email and platform
- **Body**: `{ email, platform }`

### 3. Database Schema
```sql
CREATE TABLE fcm_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token TEXT NOT NULL,
  platform ENUM('android', 'iOS', 'web') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_platform (user_id, platform)
);
```

### 4. Usage Examples

#### Store/Update Token
```javascript
// POST /api/fcm-token
{
  "token": "abc123...",
  "email": "user@example.com",
  "platform": "android"
}
```

#### Get Token
```javascript
// GET /api/fcm-token?email=user@example.com&platform=android
```

#### Delete Token
```javascript
// DELETE /api/fcm-token
{
  "email": "user@example.com",
  "platform": "android"
}
```

### 5. Error Handling
- **400**: Missing required fields or invalid email format
- **404**: Token not found
- **500**: Server/database errors

### 6. Migration
Run the SQL migration file to set up the database:
```bash
mysql -u your_user -p your_database < src/db/migrations/create_fcm_tokens_table.sql
```

## Key Benefits
1. **Uniqueness**: Each email can only have one token per platform
2. **Flexibility**: Supports multiple platforms (android, iOS, web)
3. **Performance**: Proper indexing for fast lookups
4. **Scalability**: Clean upsert logic prevents duplicates
5. **Complete CRUD**: Full set of endpoints for token management
