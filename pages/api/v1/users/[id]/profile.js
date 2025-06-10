// API proxy for updating a user's profile
export default async function handler(req, res) {
  // Only allow PUT method
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  // Get the user ID from the URL
  const { id } = req.query;
  
  // Get the update data from the request body
  const updateData = req.body;

  try {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock updated user data
      const mockUpdatedUser = {
        id,
        name: updateData.name || 'User Name',
        email: `user${id}@example.com`,
        role: updateData.role || 'CLIENT',
        status: updateData.status || 'ACTIVE',
        lastLogin: '22/03/2023',
        createdAt: '01/01/2023',
        avatar: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
      };
      
      return res.status(200).json(mockUpdatedUser);
    } else {
      // In production, call the real API
      const response = await fetch(`${process.env.API_URL}/users/${id}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 