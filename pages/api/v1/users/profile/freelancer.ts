import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { saveFile, parseRequest } from '@lib/fileUpload';

const prisma = new PrismaClient();

// Configuração para upload de arquivos
export const config = {
  api: {
    bodyParser: false, // Desativamos o bodyParser para lidar com upload de arquivos
  },
};

export default async function handler(req, res) {
  // Verificar token JWT
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Não autorizado' });
  }
  
  try {
    const token = authHeader.replace('Bearer ', '');
    
    // Verificar token
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, jwtSecret);
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    
    const userId = decoded.userId;
    console.log(`Processando ${req.method} requisição de perfil de freelancer para usuário ${userId}`);
    
    switch (req.method) {
      case 'GET':
        try {
          // Obter perfil do freelancer
          const freelancerProfile = await prisma.freelancerProfile.findUnique({
            where: { userId }
          });
          
          if (!freelancerProfile) {
            return res.status(404).json({ message: 'Perfil de freelancer não encontrado' });
          }
          
          return res.status(200).json(freelancerProfile);
        } catch (error) {
          console.error('Erro ao obter perfil de freelancer:', error);
          return res.status(500).json({ message: 'Erro ao obter perfil de freelancer', error: error.message });
        }
        
      case 'PUT':
        try {
          let fields, files;
          if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
            // Parse manual do corpo JSON
            const buffers = [];
            for await (const chunk of req) { buffers.push(chunk); }
            const rawBody = Buffer.concat(buffers).toString('utf8');
            fields = JSON.parse(rawBody);
            files = {};
          } else if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
            const parsed = await parseRequest(req);
            fields = parsed.fields;
            files = parsed.files;
          } else {
            return res.status(415).json({ message: 'Unsupported Media Type' });
          }
          let skills = fields.skills || [];
          if (typeof skills === 'string') {
            try { skills = JSON.parse(skills); } catch (e) { skills = skills.split(',').map(s => s.trim()).filter(Boolean); }
          }
          const hourlyRate = fields.hourlyRate ? parseFloat(fields.hourlyRate) : undefined;
          const existingProfile = await prisma.freelancerProfile.findUnique({ where: { userId: String(userId) } });
          const data = {
            userId: String(userId),
            skills: Array.isArray(skills) && skills.length > 0 ? skills : [],
            hourlyRate: typeof hourlyRate === 'number' && !isNaN(hourlyRate) ? hourlyRate : null,
            availability: fields.availability || null,
            experienceYears: fields.experienceYears ? parseInt(fields.experienceYears) : null,
            englishLevel: fields.englishLevel || null,
            portfolioWebsite: fields.portfolioWebsite || null,
          };
          Object.keys(data).forEach(key => { if (data[key] === undefined || data[key] === null) { delete data[key]; } });
          let freelancerProfile;
          if (existingProfile) {
            freelancerProfile = await prisma.freelancerProfile.update({ where: { userId: String(userId) }, data });
          } else {
            freelancerProfile = await prisma.freelancerProfile.create({ data });
          }
          // Avatar e nome do usuário mantêm igual
          if (files && files.avatar) {
            let avatarFile = files.avatar;
            if (Array.isArray(avatarFile)) {
              avatarFile = avatarFile[0];
            }
            console.log('Processando upload de avatar de freelancer, estrutura do arquivo:', avatarFile);
            try {
              const savedFile = await saveFile(avatarFile);
              // Atualizar URL do avatar no User
              await prisma.user.update({
                where: { id: userId },
                data: { avatarUrl: savedFile.publicPath }
              });
            } catch (fileError) {
              console.error('Erro ao salvar arquivo de avatar:', fileError);
              // Continuar sem atualização de avatar
            }
          }
          if (fields.name) {
            await prisma.user.update({
              where: { id: userId },
              data: { name: fields.name }
            });
          }
          const user = await prisma.user.findUnique({ where: { id: userId }, include: { freelancerProfile: true } });
          return res.status(200).json(user);
        } catch (error) {
          console.error('Erro ao atualizar perfil de freelancer:', error);
          return res.status(500).json({ message: 'Erro ao atualizar perfil de freelancer', error: error.message });
        }
        
      case 'POST':
        try {
          let fields, files;
          if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
            // Parse manual do corpo JSON
            const buffers = [];
            for await (const chunk of req) { buffers.push(chunk); }
            const rawBody = Buffer.concat(buffers).toString('utf8');
            fields = JSON.parse(rawBody);
            files = {};
          } else if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
            const parsed = await parseRequest(req);
            fields = parsed.fields;
            files = parsed.files;
          } else {
            return res.status(415).json({ message: 'Unsupported Media Type' });
          }
          let skills = fields.skills || [];
          if (typeof skills === 'string') {
            try { skills = JSON.parse(skills); } catch (e) { skills = skills.split(',').map(s => s.trim()).filter(Boolean); }
          }
          const hourlyRate = fields.hourlyRate ? parseFloat(fields.hourlyRate) : undefined;
          const existingProfile = await prisma.freelancerProfile.findUnique({ where: { userId: String(userId) } });
          if (existingProfile) { return res.status(400).json({ message: 'Freelancer profile already exists' }); }
          const data = {
            userId: String(userId),
            skills: Array.isArray(skills) && skills.length > 0 ? skills : [],
            hourlyRate,
            availability: fields.availability,
            experienceYears: fields.experienceYears ? parseInt(fields.experienceYears) : null,
            englishLevel: fields.englishLevel,
            portfolioWebsite: fields.portfolioWebsite,
          };
          Object.keys(data).forEach(key => { if (data[key] === undefined || data[key] === null) { delete data[key]; } });
          let freelancerProfile = await prisma.freelancerProfile.create({ data });
          // Avatar e nome do usuário mantêm igual
          if (files && files.avatar) {
            console.log('Processando upload de avatar de freelancer para novo perfil');
            
            try {
              const savedFile = await saveFile(files.avatar);
              
              // Atualizar URL do avatar no User
              await prisma.user.update({
                where: { id: userId },
                data: { avatarUrl: savedFile.publicPath }
              });
            } catch (fileError) {
              console.error('Erro ao salvar arquivo de avatar:', fileError);
              // Continuar sem atualização de avatar
            }
          }
          await prisma.user.update({ where: { id: userId }, data: { role: 'USER' } });
          const user = await prisma.user.findUnique({ where: { id: userId }, include: { freelancerProfile: true } });
          return res.status(201).json(user);
        } catch (error) {
          console.error('Erro ao criar perfil de freelancer:', error);
          return res.status(500).json({ message: 'Erro ao criar perfil de freelancer', error: error.message });
        }
        
      default:
        return res.status(405).json({ message: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de perfil de freelancer:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
} 