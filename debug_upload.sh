#!/bin/bash

BASE_URL="http://localhost:8080/api"

# 1. Get a recipient ID
echo "Fetching recipients..."
RECIPIENTS=$(curl -s "$BASE_URL/admin/recipients")
# Extract first ID using grep/sed/awk since jq might not be available or reliable
RECIPIENT_ID=$(echo $RECIPIENTS | grep -o '"id":[0-9]*' | head -n 1 | grep -o '[0-9]*')

if [ -z "$RECIPIENT_ID" ]; then
  echo "No recipients found. Creating one..."
  # Create a user first
  USER_SIGNUP=$(curl -s -X POST "$BASE_URL/auth/user/signup" \
    -H "Content-Type: application/json" \
    -d '{
      "username": "debuguser_'$(date +%s)'",
      "email": "debug_'$(date +%s)'@example.com",
      "password": "password123",
      "role": "RECIPIENT"
    }')
  USER_ID=$(echo $USER_SIGNUP | grep -o '"id":[0-9]*' | head -n 1 | grep -o '[0-9]*')
  
  # Create recipient profile
  RECIPIENT_CREATE=$(curl -s -X POST "$BASE_URL/recipient/add" \
    -H "Content-Type: application/json" \
    -d '{
      "userId": '$USER_ID',
      "name": "Debug Recipient",
      "phone": "1234567890",
      "address": "Debug Address",
      "location": "Debug Location"
    }')
  RECIPIENT_ID=$(echo $RECIPIENT_CREATE | grep -o '"id":[0-9]*' | head -n 1 | grep -o '[0-9]*')
fi

echo "Using Recipient ID: $RECIPIENT_ID"

# 2. Create a Request
echo "Creating Request..."
REQUEST_RESPONSE=$(curl -s -X POST "$BASE_URL/request/add" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": '$RECIPIENT_ID',
    "title": "Debug Request",
    "description": "Debug Description",
    "type": "Veg",
    "location": "Debug Location",
    "address": "Debug Address",
    "latitude": 12.97,
    "longitude": 77.59
  }')

echo "Request Response: $REQUEST_RESPONSE"
REQUEST_ID=$(echo $REQUEST_RESPONSE | grep -o '"id":[0-9]*' | head -n 1 | grep -o '[0-9]*')

if [ -z "$REQUEST_ID" ]; then
  echo "Failed to create request."
  exit 1
fi

echo "Created Request ID: $REQUEST_ID"

# 3. Upload Photo
echo "Uploading Photo to Request $REQUEST_ID..."
UPLOAD_RESPONSE=$(curl -s -v -X POST "$BASE_URL/request/$REQUEST_ID/photo" \
  -F "photo=@dummy.jpg")

echo -e "\nUpload Response: $UPLOAD_RESPONSE"
