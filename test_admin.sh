#!/bin/bash

BASE_URL="http://localhost:8080/api/admin"

echo "Testing Admin Stats..."
curl -s "$BASE_URL/stats"
echo -e "\n"

echo "Testing List Donors..."
curl -s "$BASE_URL/donors"
echo -e "\n"

echo "Testing List Recipients..."
curl -s "$BASE_URL/recipients"
echo -e "\n"

echo "Testing List Volunteers..."
curl -s "$BASE_URL/volunteers"
echo -e "\n"

echo "Testing List Requests..."
curl -s "$BASE_URL/requests"
echo -e "\n"

echo "Testing List Donations..."
curl -s "$BASE_URL/donations"
echo -e "\n"

# Note: Update status tests would require valid IDs. 
# I'll skip them for this automated script or use IDs from the list if I could parse them.
