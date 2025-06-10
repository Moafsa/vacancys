// This script tests the client profile API directly
// To run: node test-client-profile.js

const fetch = require('node-fetch');
const FormData = require('form-data');

// Replace with your valid JWT token
const TOKEN = 'your_jwt_token';
const API_URL = 'http://localhost:3000/api/v1/users/profile/client';

async function testClientProfileAPI() {
  try {
    console.log('Testing client profile API...');
    
    // Create FormData to simulate form submission
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('companyName', 'Test Company');
    formData.append('industry', 'Technology');
    formData.append('bio', 'This is a test biography');
    
    // Make the request to the API
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      },
      body: formData
    });
    
    console.log('Response status:', response.status);
    
    // Read response body
    const data = await response.text();
    
    try {
      // Try to parse as JSON
      const jsonData = JSON.parse(data);
      console.log('JSON response:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      // If not JSON, show as text
      console.log('Text response:', data);
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testClientProfileAPI(); 