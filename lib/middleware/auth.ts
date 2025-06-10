import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

// Extend the NextApiRequest interface to include userId
declare module 'next' {
  interface NextApiRequest {
    userId?: string;
  }
}

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

/**
 * Authentication middleware for API routes
 * @param {ApiHandler} handler - The API route handler function
 * @returns {ApiHandler} - Middleware wrapped handler
 */
export const withAuth = (handler: ApiHandler): ApiHandler => async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  // Check for JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, jwtSecret);
    
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Add userId to request object
    req.userId = (decoded as { userId: string }).userId;
    
    // Call the original handler
    return handler(req, res);
  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}; 