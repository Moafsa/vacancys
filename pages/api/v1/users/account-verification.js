import { PrismaClient } from '@prisma/client';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { unlink } from 'fs/promises';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { saveFile, parseRequest } from '../../../../lib/fileUpload';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

async function verifyWithYolo(fileUrl, fileType, publicUrl) {
  const formData = new FormData();
  let fileBuffer;
  let fileName;
  const filePath = path.isAbsolute(fileUrl) ? fileUrl : path.join(process.cwd(), 'public', fileUrl);
  try {
    fileBuffer = await fs.readFile(filePath);
    fileName = path.basename(filePath);
  } catch (err) {
    // Se não encontrar o arquivo local, tenta baixar da URL pública
    if (publicUrl) {
      console.log('[DEBUG] Arquivo local não encontrado, baixando do MinIO:', publicUrl);
      const response = await fetch(publicUrl);
      if (!response.ok) throw new Error('Failed to fetch image from MinIO');
      fileBuffer = Buffer.from(await response.arrayBuffer());
      fileName = path.basename(publicUrl);
    } else {
      throw err;
    }
  }
  formData.append('file', fileBuffer, fileName);
  formData.append('fileType', fileType);

  // Adicione o header Authorization
  const headers = {
    ...formData.getHeaders(),
    Authorization: `Bearer ${process.env.YOLO_AUTH_TOKEN}`,
  };

  const yoloUrl = process.env.YOLO_URL || 'http://127.0.0.1:5001/verify';
  const res = await fetch(yoloUrl, {
    method: 'POST',
    body: formData,
    headers,
  });
  return await res.json();
}

export default async function handler(req, res) {
  console.log('[DEBUG] Iniciando handler de verificação de conta, método:', req.method);
  if (req.method === 'DELETE') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const token = authHeader.replace('Bearer ', '');
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const userId = payload.userId;
      if (!userId) return res.status(401).json({ message: 'Invalid token' });
      const { fileType } = req.body; // 'document', 'proofOfAddress', 'selfie'
      if (!['document', 'proofOfAddress', 'selfie'].includes(fileType)) {
        return res.status(400).json({ message: 'Invalid fileType' });
      }
      const verification = await prisma.accountVerification.findUnique({ where: { userId } });
      if (!verification) return res.status(404).json({ message: 'Verification not found' });
      let fileUrl = null;
      if (fileType === 'document') fileUrl = verification.documentUrl;
      if (fileType === 'proofOfAddress') fileUrl = verification.proofOfAddressUrl;
      if (fileType === 'selfie') fileUrl = verification.selfieUrl;
      if (!fileUrl) return res.status(404).json({ message: 'File not found' });
      // Remover arquivo do disco
      const filePath = path.join(process.cwd(), 'public', fileUrl.replace(/^\/uploads\//, 'uploads/'));
      try { await unlink(filePath); } catch (e) { /* ignora se já não existe */ }
      // Atualizar registro
      const updateData = {};
      if (fileType === 'document') {
        updateData.documentUrl = null;
        updateData.documentStatus = 'PENDING';
        updateData.documentRejectionReason = null;
      }
      if (fileType === 'proofOfAddress') {
        updateData.proofOfAddressUrl = null;
        updateData.proofOfAddressStatus = 'PENDING';
        updateData.proofOfAddressRejectionReason = null;
      }
      if (fileType === 'selfie') {
        updateData.selfieUrl = null;
        updateData.selfieStatus = 'PENDING';
        updateData.selfieRejectionReason = null;
      }
      // Recalcular status geral
      const newStatuses = {
        documentStatus: updateData.documentStatus || verification.documentStatus,
        proofOfAddressStatus: updateData.proofOfAddressStatus || verification.proofOfAddressStatus,
        selfieStatus: updateData.selfieStatus || verification.selfieStatus,
      };
      let newStatus = 'APPROVED';
      if ([newStatuses.documentStatus, newStatuses.proofOfAddressStatus, newStatuses.selfieStatus].includes('PENDING')) {
        newStatus = 'PENDING';
      } else if ([newStatuses.documentStatus, newStatuses.proofOfAddressStatus, newStatuses.selfieStatus].includes('REJECTED')) {
        newStatus = 'PENDING';
      }
      updateData.status = newStatus;
      if (newStatus === 'APPROVED') updateData.rejectionReason = null;
      await prisma.accountVerification.update({ where: { userId }, data: updateData });
      // Logar ação
      console.log(`[AUDIT] User ${userId} deleted ${fileType} from account verification (status reset to PENDING).`);
      return res.status(200).json({ message: 'File deleted' });
    } catch (error) {
      console.error('Account verification file delete error:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    // Autenticação: espera header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Decodificar userId do token (simples, sem validação JWT para exemplo)
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = payload.userId;
    if (!userId) return res.status(401).json({ message: 'Invalid token' });

    console.log('[DEBUG] Chamando parseRequest para processar arquivos do formulário...');
    const { files } = await parseRequest(req);
    console.log('[DEBUG] Arquivos recebidos após parseRequest:', files);
    const documentFile = files.document;
    const proofFile = files.proofOfAddress;
    const selfieFile = files.selfie;
    // Permitir envio individual
    if (!documentFile && !proofFile && !selfieFile) {
      return res.status(400).json({ message: 'At least one file is required: document, proofOfAddress, or selfie' });
    }
    // Buscar registro existente
    const existing = await prisma.accountVerification.findUnique({ where: { userId } });
    let updateData = {};
    let documentUrl = existing?.documentUrl;
    let proofUrl = existing?.proofOfAddressUrl;
    let selfieUrl = existing?.selfieUrl;
    let documentStatus = existing?.documentStatus || 'PENDING';
    let documentRejectionReason = existing?.documentRejectionReason || null;
    let proofOfAddressStatus = existing?.proofOfAddressStatus || 'PENDING';
    let proofOfAddressRejectionReason = existing?.proofOfAddressRejectionReason || null;
    let selfieStatus = existing?.selfieStatus || 'PENDING';
    let selfieRejectionReason = existing?.selfieRejectionReason || null;
    // Atualizar apenas o arquivo enviado
    if (documentFile) {
      const docFile = Array.isArray(documentFile) ? documentFile[0] : documentFile;
      console.log('[DEBUG] Chamando YOLO com arquivo temporário local:', docFile.filepath);
      const documentResult = await verifyWithYolo(docFile.filepath, 'document');
      // Após YOLO, faz upload para o S3
      documentUrl = await saveFile(docFile);
      console.log('[DEBUG] Documento salvo no MinIO:', documentUrl);
      // Remover arquivo local após upload
      try { await fs.unlink(docFile.filepath); } catch (e) { /* ignora erro */ }
      documentStatus = documentResult.result === 'REJECTED' ? 'REJECTED' : 'APPROVED';
      documentRejectionReason = documentResult.result === 'REJECTED' ? (documentResult.reason || 'Document verification failed') : null;
      console.log('[DEBUG] Documento verificado pelo YOLO:', documentResult);
    }
    if (proofFile) {
      console.log('[DEBUG] Salvando comprovante de endereço no MinIO:', proofFile);
      proofUrl = await saveFile(Array.isArray(proofFile) ? proofFile[0] : proofFile);
      console.log('[DEBUG] Comprovante salvo no MinIO:', proofUrl);
      proofOfAddressStatus = 'APPROVED';
      proofOfAddressRejectionReason = null;
    }
    if (selfieFile) {
      const selfFile = Array.isArray(selfieFile) ? selfieFile[0] : selfieFile;
      console.log('[DEBUG] Chamando YOLO com selfie temporária local:', selfFile.filepath);
      const selfieResult = await verifyWithYolo(selfFile.filepath, 'selfie');
      // Após YOLO, faz upload para o S3
      selfieUrl = await saveFile(selfFile, '.jpg');
      console.log('[DEBUG] Selfie salva no MinIO:', selfieUrl);
      // Remover arquivo local após upload
      try { await fs.unlink(selfFile.filepath); } catch (e) { /* ignora erro */ }
      selfieStatus = selfieResult.result === 'REJECTED' ? 'REJECTED' : 'APPROVED';
      selfieRejectionReason = selfieResult.result === 'REJECTED' ? (selfieResult.reason || 'Selfie verification failed') : null;
      console.log('[DEBUG] Selfie verificada pelo YOLO:', selfieResult);
    }
    // Status geral
    let status = 'APPROVED';
    if ([documentStatus, proofOfAddressStatus, selfieStatus].includes('PENDING')) {
      status = 'PENDING';
    } else if ([documentStatus, proofOfAddressStatus, selfieStatus].includes('REJECTED')) {
      status = 'PENDING';
    }
    updateData = {
      documentUrl,
      proofOfAddressUrl: proofUrl,
      selfieUrl,
      documentStatus,
      documentRejectionReason,
      proofOfAddressStatus,
      proofOfAddressRejectionReason,
      selfieStatus,
      selfieRejectionReason,
      status,
      rejectionReason: null,
      submittedAt: new Date(),
    };
    console.log('[DEBUG] updateData final a ser salvo:', updateData);
    let verification;
    if (existing) {
      verification = await prisma.accountVerification.update({
        where: { userId },
        data: updateData,
      });
    } else {
      verification = await prisma.accountVerification.create({
        data: {
          userId,
          ...updateData,
        },
      });
    }
    console.log(`[AUDIT] YOLO verification for user ${userId}: status=${status}, documentStatus=${documentStatus}, selfieStatus=${selfieStatus}`);
    return res.status(200).json({ message: 'Verification submitted', verification });
  } catch (error) {
    console.error('[ERROR] Erro na verificação de conta:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
  }
} 