#!/bin/bash

BASE_URL="http://localhost:8080/api"

# 1. Test User Signup
echo "Testing User Signup..."
curl -X POST "$BASE_URL/auth/user/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
echo -e "\n"

# 2. Test User Login
echo "Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/user/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }')
echo "Login Response: $LOGIN_RESPONSE"
USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
echo "User ID: $USER_ID"
echo -e "\n"

# 3. Test User Update (Lat/Long)
echo "Testing User Update (Lat/Long)..."
curl -X PUT "$BASE_URL/auth/user/$USER_ID/update?latitude=12.9716&longitude=77.5946"
echo -e "\n"

# 4. Test Donation Create (Multipart)
echo "Testing Donation Create..."
curl -X POST "$BASE_URL/donation/add" \
  -F "donorId=1" \
  -F "title=Test Donation" \
  -F "description=Test Description" \
  -F "type=Food" \
  -F "location=Bangalore" \
  -F "address=MG Road" \
  -F "latitude=12.9716" \
  -F "longitude=77.5946"
echo -e "\n"

# 5. Test Request Create (Multipart)
echo "Testing Request Create..."
curl -X POST "$BASE_URL/request/add" \
  -F "userId=$USER_ID" \
  -F "title=Test Request" \
  -F "description=Need Food" \
  -F "amount=10.0" \
  -F "location=Bangalore" \
  -F "address=Indiranagar" \
  -F "latitude=12.9716" \
  -F "longitude=77.5946"
echo -e "\n"

# 6. Test Recipient Create (Multipart)
echo "Testing Recipient Create..."
curl -X POST "$BASE_URL/recipient/add" \
  -F "userId=$USER_ID" \
  -F "name=Test Recipient" \
  -F "age=30" \
  -F "address=Koramangala" \
  -F "organizationName=Test Org" \
  -F "pan=ABCDE1234F" \
  -F "aadhaar=123456789012" \
  -F "phone=9876543210" \
  -F "email=recipient@example.com" \
  -F "location=Bangalore" \
  -F "latitude=12.9716" \
  -F "longitude=77.5946"
echo -e "\n"

# 7. Test Donor Create (Multipart)
echo "Testing Donor Create..."
curl -X POST "$BASE_URL/donor/add" \
  -F "name=Test Donor" \
  -F "age=35" \
  -F "address=Whitefield" \
  -F "organizationName=Donor Org" \
  -F "pan=FGHIJ5678K" \
  -F "aadhaar=987654321098" \
  -F "phone=9123456789" \
  -F "email=donor@example.com" \
  -F "location=Bangalore" \
  -F "latitude=12.9716" \
  -F "longitude=77.5946" \
  -F "organizationCertificate=@/dev/null" \
  -F "photo=@/dev/null" \
  -F "signature=@/dev/null"
echo -e "\n"

# 8. Test Volunteer Create (Multipart)
echo "Testing Volunteer Create..."
curl -X POST "$BASE_URL/volunteer/add" \
  -F "name=Test Volunteer" \
  -F "email=volunteer@example.com" \
  -F "phone=8888888888" \
  -F "address=Jayanagar" \
  -F "location=Bangalore" \
  -F "latitude=12.9716" \
  -F "longitude=77.5946" \
  -F "aadhaarCard=112233445566" \
  -F "panCard=LMNOP9012Q" \
  -F "availability=Weekends" \
  -F "skills=Driving" \
  -F "reason=Help" \
  -F "emergencyContactPhone=7777777777"
echo -e "\n"
