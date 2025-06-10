# Core API Examples

This document provides practical examples for interacting with the Core API using different tools and languages.

## 1. Health Check

### cURL

```bash
curl -X GET http://localhost:3000/api/core/status/health
```

### JavaScript (Fetch API)

```javascript
fetch('http://localhost:3000/api/core/status/health')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Python (Requests)

```python
import requests

response = requests.get('http://localhost:3000/api/core/status/health')
print(response.json())
```

## 2. User Authentication

### cURL

```bash
curl -X POST http://localhost:3000/api/core/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword"}'
```

### JavaScript (Fetch API)

```javascript
fetch('http://localhost:3000/api/core/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'yourpassword',
  }),
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    localStorage.setItem('token', data.token); // Save token for future requests
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Python (Requests)

```python
import requests

url = 'http://localhost:3000/api/core/auth/login'
data = {
    'email': 'user@example.com',
    'password': 'yourpassword'
}

response = requests.post(url, json=data)
response_data = response.json()
print(response_data)

# Save token for future requests
token = response_data.get('token')
```

## 3. Create User (Requires Authentication)

### cURL

```bash
curl -X POST http://localhost:3000/api/core/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "securepassword",
    "role": "USER"
  }'
```

### JavaScript (Fetch API)

```javascript
// Assuming token is already stored in localStorage
const token = localStorage.getItem('token');

fetch('http://localhost:3000/api/core/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: 'New User',
    email: 'newuser@example.com',
    password: 'securepassword',
    role: 'USER',
  }),
})
  .then(response => response.json())
  .then(data => console.log('User created:', data))
  .catch(error => console.error('Error:', error));
```

### Python (Requests)

```python
import requests

url = 'http://localhost:3000/api/core/users'
headers = {
    'Authorization': f'Bearer {token}'  # Use token from previous login
}
data = {
    'name': 'New User',
    'email': 'newuser@example.com',
    'password': 'securepassword',
    'role': 'USER'
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```

## 4. Get Event Service Metrics

### cURL

```bash
curl -X GET http://localhost:3000/api/core/events/metrics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### JavaScript (Fetch API)

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3000/api/core/events/metrics', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
  .then(response => response.json())
  .then(data => console.log('Metrics:', data))
  .catch(error => console.error('Error:', error));
```

### Python (Requests)

```python
import requests

url = 'http://localhost:3000/api/core/events/metrics'
headers = {
    'Authorization': f'Bearer {token}'
}

response = requests.get(url, headers=headers)
print(response.json())
```

## 5. Get Dead Letter Queue Event Types

### cURL

```bash
curl -X GET http://localhost:3000/api/core/events/dlq/types \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### JavaScript (Fetch API)

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3000/api/core/events/dlq/types', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
  .then(response => response.json())
  .then(data => console.log('DLQ Event Types:', data))
  .catch(error => console.error('Error:', error));
```

### Python (Requests)

```python
import requests

url = 'http://localhost:3000/api/core/events/dlq/types'
headers = {
    'Authorization': f'Bearer {token}'
}

response = requests.get(url, headers=headers)
print(response.json())
```

## 6. Get Dead Letter Queue Events by Type

### cURL

```bash
curl -X GET http://localhost:3000/api/core/events/dlq/ERROR_EVENT \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### JavaScript (Fetch API)

```javascript
const token = localStorage.getItem('token');
const eventType = 'ERROR_EVENT';

fetch(`http://localhost:3000/api/core/events/dlq/${eventType}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
  .then(response => response.json())
  .then(data => console.log('DLQ Events:', data))
  .catch(error => console.error('Error:', error));
```

### Python (Requests)

```python
import requests

event_type = 'ERROR_EVENT'
url = f'http://localhost:3000/api/core/events/dlq/{event_type}'
headers = {
    'Authorization': f'Bearer {token}'
}

response = requests.get(url, headers=headers)
print(response.json())
```

## 7. Reprocess Dead Letter Queue Event

### cURL

```bash
curl -X POST http://localhost:3000/api/core/events/dlq/ERROR_EVENT/123/reprocess \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### JavaScript (Fetch API)

```javascript
const token = localStorage.getItem('token');
const eventType = 'ERROR_EVENT';
const eventId = '123';

fetch(`http://localhost:3000/api/core/events/dlq/${eventType}/${eventId}/reprocess`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
  .then(response => response.json())
  .then(data => console.log('Reprocess Result:', data))
  .catch(error => console.error('Error:', error));
```

### Python (Requests)

```python
import requests

event_type = 'ERROR_EVENT'
event_id = '123'
url = f'http://localhost:3000/api/core/events/dlq/{event_type}/{event_id}/reprocess'
headers = {
    'Authorization': f'Bearer {token}'
}

response = requests.post(url, headers=headers)
print(response.json())
```

## 8. Purge Dead Letter Queue Events

### cURL

```bash
curl -X DELETE http://localhost:3000/api/core/events/dlq/ERROR_EVENT \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### JavaScript (Fetch API)

```javascript
const token = localStorage.getItem('token');
const eventType = 'ERROR_EVENT';

fetch(`http://localhost:3000/api/core/events/dlq/${eventType}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
  .then(response => response.json())
  .then(data => console.log('Purge Result:', data))
  .catch(error => console.error('Error:', error));
```

### Python (Requests)

```python
import requests

event_type = 'ERROR_EVENT'
url = f'http://localhost:3000/api/core/events/dlq/{event_type}'
headers = {
    'Authorization': f'Bearer {token}'
}

response = requests.delete(url, headers=headers)
print(response.json())
```

## Error Handling Examples

### JavaScript (Fetch API)

```javascript
fetch('http://localhost:3000/api/core/events/dlq/types', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.status === 'error') {
      console.error('API Error:', data.message);
      return;
    }
    console.log('Success:', data);
  })
  .catch(error => console.error('Error:', error));
```

### Python (Requests)

```python
import requests

try:
    url = 'http://localhost:3000/api/core/events/dlq/types'
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Raise exception for 4XX/5XX responses
    
    data = response.json()
    if data.get('status') == 'error':
        print(f"API Error: {data.get('message')}")
    else:
        print("Success:", data)
        
except requests.exceptions.HTTPError as http_err:
    print(f"HTTP Error: {http_err}")
except requests.exceptions.ConnectionError as conn_err:
    print(f"Connection Error: {conn_err}")
except requests.exceptions.Timeout as timeout_err:
    print(f"Timeout Error: {timeout_err}")
except requests.exceptions.RequestException as req_err:
    print(f"Request Error: {req_err}") 