# API Key Implementation - Technical Reference

## Overview

This document describes the API key system implementation in IMBONI, allowing permanent authentication tokens for external integrations.

## Architecture

### Components

1. **Model:** [api-key.model.ts](backend/src/models/api-key.model.ts)
   - Stores hashed API keys in MongoDB
   - Tracks usage and expiration
   - Links keys to HR users

2. **Service:** [api-key.service.ts](backend/src/services/api-key.service.ts)
   - Key generation and hashing (bcryptjs with 12 salt rounds)
   - Verification logic
   - CRUD operations

3. **Routes:** [api-key.routes.ts](backend/src/routes/api-key.routes.ts)
   - REST endpoints for key management
   - Authentication required (JWT middleware)

4. **Middleware:** [api-key.ts](backend/src/middleware/api-key.ts)
   - API key validation from Authorization header
   - Sets `req.user` for downstream handlers

5. **Frontend:** [api-keys-manager.tsx](frontend/src/components/settings/api-keys-manager.tsx)
   - UI component in Settings page
   - Generate, list, revoke, delete keys

## API Endpoints

### Generate API Key
```
POST /api/api-keys
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "My Integration",
  "expiresAt": "2025-12-31T23:59:59Z"  // optional
}

Response 201:
{
  "message": "API key generated successfully...",
  "data": {
    "id": "67a1b2c3d4e5f6g7h8i9j0k1",
    "key": "imb_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "prefix": "imb_a1b2",
    "name": "My Integration",
    "createdAt": "2025-01-15T10:30:00Z",
    "expiresAt": null
  }
}
```

### List API Keys
```
GET /api/api-keys
Authorization: Bearer <JWT_TOKEN>

Response 200:
{
  "data": [
    {
      "id": "67a1b2c3d4e5f6g7h8i9j0k1",
      "name": "My Integration",
      "prefix": "imb_a1b2",
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00Z",
      "lastUsed": "2025-01-16T14:22:00Z",
      "expiresAt": null
    }
  ]
}
```

### Revoke API Key
```
PATCH /api/api-keys/:keyId/revoke
Authorization: Bearer <JWT_TOKEN>

Response 200:
{
  "message": "API key revoked successfully"
}
```

### Delete API Key
```
DELETE /api/api-keys/:keyId
Authorization: Bearer <JWT_TOKEN>

Response 200:
{
  "message": "API key deleted successfully"
}
```

## Authentication Flow

### Using API Key
```
1. Client makes request:
   GET /api/dashboard/overview
   Authorization: Bearer imb_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

2. Express receives request
   ↓
3. Route handler checks Authorization header
   ↓
4. Extract API key from "Bearer <key>" format
   ↓
5. Query MongoDB for key with matching prefix
   ↓
6. Compare provided key with stored hashed value using bcryptjs
   ↓
7. Check expiration status
   ↓
8. Update lastUsed timestamp
   ↓
9. Set req.user.id to key's hrId
   ↓
10. Request proceeds with authenticated context
```

## Key Generation Details

### Format
- **Prefix:** `imb_`
- **Random bytes:** 32 bytes (64 hex characters)
- **Total length:** ~71 characters

Example:
```
imb_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Security
- Raw key is **never stored** in database
- Only bcryptjs hash is stored (`bcryptjs.hash()` with 12 rounds)
- Raw key shown only once during generation
- Uses crypto-secure random generation (`crypto.randomBytes()`)

## Database Schema

```typescript
interface IApiKey {
  hrId: string;              // User ID who owns this key
  name: string;              // User-friendly name
  key: string;               // Hashed key (bcryptjs)
  prefix: string;            // First 8 chars for display
  lastUsed?: Date;           // When key was last used
  expiresAt?: Date;          // Optional expiration
  isActive: boolean;         // Can be revoked without deletion
  createdAt: Date;           // Auto-generated
  updatedAt: Date;           // Auto-generated
}
```

## Environment Variables

Add to `.env` if needed:
```env
# No additional env vars required
# API keys are stored in MongoDB
```

## Usage Examples

### Automated Screening (Node.js)
```javascript
const apiKey = process.env.IMBONI_API_KEY;

async function startScreening(jobId, candidateIds) {
  const response = await fetch(
    'https://api.imboni.com/api/screening',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId,
        candidateIds
      })
    }
  );
  return response.json();
}
```

### Dashboard Integration (Python)
```python
import requests
import os

API_KEY = os.getenv('IMBONI_API_KEY')
BASE_URL = 'https://api.imboni.com'

def get_dashboard_data():
    headers = {'Authorization': f'Bearer {API_KEY}'}
    response = requests.get(
        f'{BASE_URL}/api/dashboard/overview',
        headers=headers
    )
    return response.json()
```

### Cross-PC Portability
```bash
# PC 1: Generate key and save
IMBONI_API_KEY=imb_xxxx
# Run integrations

# PC 2: Use same key
export IMBONI_API_KEY=imb_xxxx
# Same integrations work without re-auth!
```

## Error Handling

### Invalid Key
```
Response 401:
{
  "error": "Invalid or expired API key"
}
```

### Missing Authorization Header
```
Response 401:
{
  "error": "Missing or invalid Authorization header"
}
```

### Expired Key
```
Response 401:
{
  "error": "Invalid or expired API key"
}
```

## Performance Considerations

- API key lookup uses **indexed prefix field** for fast retrieval
- Only one database query per API key validation
- Hashing is done once during generation (not per-request)
- lastUsed timestamp updated async (doesn't block response)

## Security Considerations

1. **Key Prefix in Logs:** Only first 8 characters are visible in logs/UI
2. **Rate Limiting:** Consider implementing rate limiting per API key
3. **Revocation:** Immediate effect (next request fails)
4. **Expiration:** Optional TTL support for time-limited integrations
5. **Audit Trail:** All API key operations logged via req.user context

## Future Enhancements

- [ ] Rate limiting per API key
- [ ] Scoped permissions (read-only, write-only, etc.)
- [ ] IP whitelisting
- [ ] API key rotation policies
- [ ] Usage analytics dashboard
- [ ] Webhook delivery with API key
