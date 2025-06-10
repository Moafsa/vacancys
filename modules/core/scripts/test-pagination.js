/**
 * Script to verify pagination API endpoint
 * Run with: node scripts/test-pagination.js
 */

const http = require('http');

console.log('Testing pagination API endpoint...');

// Create test options
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/core/events/dlq/ERROR_EVENT?page=2&limit=10',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test_token'
  }
};

// Make the request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('RESPONSE:');
    try {
      const jsonResponse = JSON.parse(data);
      console.log(JSON.stringify(jsonResponse, null, 2));
      
      // Verify pagination data
      if (jsonResponse.pagination) {
        console.log('\nPagination test PASSED! ✅');
        console.log('Pagination metadata found in response.');
      } else {
        console.log('\nPagination test FAILED! ❌');
        console.log('No pagination metadata in response.');
      }
    } catch (e) {
      console.error('Error parsing JSON:', e);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// End the request
req.end();

console.log('Request sent, waiting for response...'); 