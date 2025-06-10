// API proxy for deactivating a user
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  // Get the user ID from the URL
  const { id } = req.query;

  try {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock deactivated user data
      const mockDeactivatedUser = {
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`,
        role: 'CLIENT',
        status: 'INACTIVE',
        lastLogin: '22/03/2023',
        createdAt: '01/01/2023',
        avatar: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
      };
      
      return res.status(200).json(mockDeactivatedUser);
    } else {
      // In production, call the real API
      const response = await fetch(`${process.env.API_URL}/users/${id}/deactivate`, {
        method: 'POST',
        headers: {
          'Authorization': token
        }
      });
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error(`Error deactivating user ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 