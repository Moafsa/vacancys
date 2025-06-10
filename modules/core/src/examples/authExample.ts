import express from 'express';
import { requireServiceAuth } from '../auth/serviceAuth';
import { ModuleClient } from '../http/moduleClient';

// Extend Express Request type to include serviceModule
declare global {
  namespace Express {
    interface Request {
      serviceModule: {
        id: string;
        permissions: string[];
      };
    }
  }
}

// Example of protecting a route with service authentication
const app = express();

// Protected route that requires specific permission
app.get('/protected-resource', 
  requireServiceAuth('resource.read'), 
  (req, res) => {
    // Access the authenticated module info
    const { id: moduleId, permissions } = req.serviceModule;
    
    res.json({
      message: 'Access granted',
      moduleId,
      permissions
    });
  }
);

// Example of making authenticated requests to another module
const vacancyClient = new ModuleClient({
  moduleId: 'core-module',
  baseURL: 'http://localhost:3002', // Vacancy module URL
  permissions: ['vacancy.read', 'vacancy.write']
});

// Example function that makes an authenticated request
async function getVacancies() {
  try {
    const vacancies = await vacancyClient.get('/vacancies');
    return vacancies;
  } catch (error) {
    console.error('Failed to fetch vacancies:', error);
    throw error;
  }
}

// Example function that creates a vacancy
async function createVacancy(vacancyData: any) {
  try {
    const newVacancy = await vacancyClient.post('/vacancies', vacancyData);
    return newVacancy;
  } catch (error) {
    console.error('Failed to create vacancy:', error);
    throw error;
  }
}

export const examples = {
  getVacancies,
  createVacancy
}; 