# Permanent API Keys - User Guide

## Overview

Permanent API Keys allow HR users to authenticate with the IMBONI API from external applications and integrations without needing to re-login. Once generated, these keys persist and work across different machines, making it ideal for:

- Integrating with third-party HR systems
- Automating candidate screening workflows
- Building custom dashboards or reports
- Moving projects between PCs (no re-authentication needed)

## How to Generate an API Key

### Step 1: Login to Dashboard
- Create an account or login with your HR credentials
- Navigate to **Settings** in the main menu

### Step 2: API Keys Section
- Scroll down to the **"Permanent API Keys"** section
- Click **"Generate Key"** button

### Step 3: Name Your Key
- Enter a descriptive name (e.g., "Integration 1", "Automation Server", "My PC")
- Click **"Generate"**

### Step 4: Save Your Key
- ⚠️ **IMPORTANT:** Your API key will only be shown once
- Copy it to a secure location (password manager, `.env` file, etc.)
- Click **"Done"** when you've saved it

## Using Your API Key

### Format
```
Authorization: Bearer imb_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Example cURL
```bash
curl -X GET https://api.imboni.com/api/api-keys \
  -H "Authorization: Bearer imb_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Example Node.js
```javascript
const response = await fetch('https://api.imboni.com/api/dashboard/overview', {
  headers: {
    'Authorization': `Bearer ${process.env.IMBONI_API_KEY}`
  }
});
const data = await response.json();
```

### Example Python
```python
import requests

headers = {
    'Authorization': f'Bearer {api_key}'
}

response = requests.get(
    'https://api.imboni.com/api/dashboard/overview',
    headers=headers
)
data = response.json()
```

## Available Endpoints with API Keys

All authenticated endpoints work with API keys:

- `GET /api/dashboard/overview` - Get dashboard metrics
- `GET /api/screening-results` - Fetch screening results
- `GET /api/jobs` - List jobs
- `POST /api/screening` - Start new screening
- `GET /api/candidates` - List candidates
- And all other API endpoints

## Managing API Keys

### View All Keys
Go to **Settings > Permanent API Keys** to see:
- Key name
- First 8 characters (prefix) of the key
- Creation date
- Last used date
- Active status

### Revoke a Key
1. Click **"Revoke"** next to the key you want to deactivate
2. The key will stop working immediately
3. You can re-activate it later if needed

### Delete a Key
1. Click **"Delete"** (trash icon) next to the key
2. The key is permanently deleted (cannot be recovered)

## Security Best Practices

✅ **DO:**
- Store keys in environment variables (`.env` files)
- Use different keys for different integrations
- Revoke keys when no longer needed
- Use `.gitignore` to prevent committing keys to version control
- Rotate keys periodically

❌ **DON'T:**
- Share your API key with others
- Commit keys to public repositories
- Store keys in plain text in code
- Use the same key across multiple machines permanently
- Share keys in chat or emails

## Example `.env` File
```env
IMBONI_API_KEY=imb_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
IMBONI_API_URL=https://api.imboni.com
```

## Moving Projects Between PCs

1. **On Original PC:** Generate an API Key (Settings > Generate Key)
2. **Save the Key:** Copy it to a secure location
3. **On New PC:** 
   - Create a `.env` file with your API key
   - Use the same key in your code/integrations
   - No re-authentication needed - it just works!

## Troubleshooting

### "Invalid API Key" Error
- Check that you copied the full key correctly
- Verify the key hasn't been revoked
- Confirm the `Authorization: Bearer ` prefix is correct

### Key Not Working After Moving PCs
- Verify you're using the exact same API key (check the prefix)
- Check that the key is active (not revoked)
- Ensure proper `Authorization` header format

### Lost Your Key
- If you lost the key during generation, you must **delete** the old key and **generate a new one**
- Keys cannot be recovered once lost

## Support

For issues or questions:
- Contact: support@imboni.com
- Check: Settings > API Keys section for troubleshooting
- Review: This guide and security best practices
