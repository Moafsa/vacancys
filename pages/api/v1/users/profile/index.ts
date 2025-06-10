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
    console.log(`Processando ${req.method} requisição de perfil para usuário ${userId}`);
    
    switch (req.method) {
      case 'GET':
        try {
          console.log('Obtendo perfil para usuário:', userId);
          
          // Buscar perfil tanto de cliente quanto de freelancer
          const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              clientProfile: true,
              freelancerProfile: true,
              accountVerification: true
            }
          });
          
          if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
          }
          
          return res.status(200).json(user);
        } catch (error) {
          console.error('Erro ao obter perfil:', error);
          return res.status(500).json({ message: 'Erro ao obter perfil', error: error.message });
        }
        
      case 'PUT':
        try {
          console.log('Atualizando perfil para usuário:', userId);
          const { fields, files } = await parseRequest(req);
          console.log('Campos recebidos:', fields);
          
          // Atualizar campos de perfil em User
          const userProfileData = {
            name: fields.name,
            phone: fields.phone,
            location: fields.location,
            bio: fields.bio
          };
          // Converter string vazia para null e remover undefined
          Object.keys(userProfileData).forEach(key => {
            if (userProfileData[key] === undefined) {
              delete userProfileData[key];
            } else if (userProfileData[key] === '') {
              userProfileData[key] = null;
            }
          });
          
          // Processar avatar se fornecido
          if (files && files.avatar) {
            let avatarFile = files.avatar;
            if (Array.isArray(avatarFile)) {
              avatarFile = avatarFile[0];
            }
            console.log('Processando upload de avatar, estrutura do arquivo:', avatarFile);
            try {
              const savedFile = await saveFile(avatarFile);
              await prisma.user.update({
                where: { id: userId },
                data: { avatarUrl: savedFile.publicPath }
              });
            } catch (fileError) {
              console.error('Erro ao salvar arquivo de avatar:', fileError);
              // Continua sem atualizar avatar
            }
          }

          console.log('userProfileData final enviado ao Prisma:', userProfileData);

          // Atualizar User
          const updatedUser = await prisma.user.update({
              where: { id: userId },
            data: userProfileData
            });
          console.log('Resultado do prisma.user.update:', updatedUser);

          // Atualizar perfis específicos se necessário (freelancer/client)
          // ... manter lógica existente para freelancerProfile/clientProfile ...
          
          // Obter usuário completo com perfis
          const updatedUserWithProfiles = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              clientProfile: true,
              freelancerProfile: true,
              accountVerification: true
            }
          });
          
          return res.status(200).json(updatedUserWithProfiles);
        } catch (error) {
          console.error('Erro ao atualizar perfil:', error);
          return res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message });
        }
        
      default:
        return res.status(405).json({ message: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de perfil:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
} 