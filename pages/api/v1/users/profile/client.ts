import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../../../lib/middleware/auth';
import { ClientProfileService } from '../../../../../lib/services/clientProfileService';
import { parseRequest, saveFile } from '../../../../../lib/fileUpload';
import { prisma } from '../../../../../src/lib/prisma';

// Configure API to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize the client profile service
const clientProfileService = new ClientProfileService();

/**
 * Client profile handler with authentication
 */
async function clientProfileHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.userId as string;
    console.log(`Processing ${req.method} client profile request for user ${userId}`);
    
    switch (req.method) {
      case 'GET':
        await handleGetProfile(userId, res);
        break;
        
      case 'PUT':
        await handleUpdateProfile(userId, req, res);
        break;
        
      case 'POST':
        await handleCreateProfile(userId, req, res);
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'POST']);
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in client profile API:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Handle GET requests for client profile
 */
async function handleGetProfile(userId: string, res: NextApiResponse) {
  try {
    const clientProfile = await clientProfileService.getClientProfile(userId);
    res.status(200).json(clientProfile);
  } catch (error) {
    console.error('Error getting client profile:', error);
    if (error instanceof Error && error.message === 'Client profile not found') {
      res.status(404).json({ message: 'Client profile not found' });
    } else {
      res.status(500).json({ 
        message: 'Error getting client profile', 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

/**
 * Handle PUT requests to update client profile
 */
async function handleUpdateProfile(userId: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    let fields, files;
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      const buffers = [];
      for await (const chunk of req) { buffers.push(chunk); }
      const rawBody = Buffer.concat(buffers).toString('utf8');
      fields = JSON.parse(rawBody);
      files = {};
    } else {
      const parsed = await parseRequest(req);
      fields = parsed.fields;
      files = parsed.files;
    }
    const data = {
      userId: String(userId),
      companyName: fields.companyName,
      industry: fields.industry,
      companySize: fields.companySize,
      companyWebsite: fields.companyWebsite,
    };
    Object.keys(data).forEach(key => {
      if (data[key] === undefined || data[key] === null) {
        delete data[key];
      }
    });
    let clientProfile;
    let existingProfile = await prisma.clientProfile.findUnique({ where: { userId: String(userId) } });
    if (existingProfile) {
      clientProfile = await prisma.clientProfile.update({
        where: { userId: String(userId) },
        data
      });
    } else {
      clientProfile = await prisma.clientProfile.create({
        data
      });
    }
    // Avatar upload
    if (files && files.avatar) {
      let avatarFile = files.avatar;
      if (Array.isArray(avatarFile)) {
        avatarFile = avatarFile[0];
      }
      try {
        const savedFile = await saveFile(avatarFile);
        await prisma.user.update({
          where: { id: userId },
          data: { avatarUrl: savedFile.publicPath }
        });
      } catch (fileError) {
        console.error('Erro ao salvar arquivo de avatar:', fileError);
      }
    }
    res.status(200).json(clientProfile);
  } catch (error) {
    console.error('Error updating client profile:', error);
    res.status(500).json({ 
      message: 'Error updating client profile', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Handle POST requests to create client profile
 */
async function handleCreateProfile(userId: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    let fields, files;
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      const buffers = [];
      for await (const chunk of req) { buffers.push(chunk); }
      const rawBody = Buffer.concat(buffers).toString('utf8');
      fields = JSON.parse(rawBody);
      files = {};
    } else {
      const parsed = await parseRequest(req);
      fields = parsed.fields;
      files = parsed.files;
    }
    const data = {
      userId: String(userId),
      companyName: fields.companyName,
      industry: fields.industry,
      companySize: fields.companySize,
      companyWebsite: fields.companyWebsite,
    };
    Object.keys(data).forEach(key => {
      if (data[key] === undefined || data[key] === null) {
        delete data[key];
      }
    });
    let existingProfile = await prisma.clientProfile.findUnique({ where: { userId: String(userId) } });
    if (existingProfile) {
      return res.status(400).json({ message: 'Client profile already exists' });
    }
    const clientProfile = await prisma.clientProfile.create({ data });
    // Avatar upload
    if (files && files.avatar) {
      let avatarFile = files.avatar;
      if (Array.isArray(avatarFile)) {
        avatarFile = avatarFile[0];
      }
      try {
        const savedFile = await saveFile(avatarFile);
        await prisma.user.update({
          where: { id: userId },
          data: { avatarUrl: savedFile.publicPath }
        });
      } catch (fileError) {
        console.error('Erro ao salvar arquivo de avatar:', fileError);
      }
    }
    res.status(201).json(clientProfile);
  } catch (error) {
    console.error('Error creating client profile:', error);
    res.status(500).json({ 
      message: 'Error creating client profile', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// Export the handler with authentication middleware
export default withAuth(clientProfileHandler); 