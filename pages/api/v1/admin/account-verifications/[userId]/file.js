import { PrismaClient } from '@prisma/client';
import path from 'path';
import { unlink } from 'fs/promises';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId } = req.query;
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    // (Opcional: checar se é admin pelo token)
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
    // Logar ação admin
    console.log(`[AUDIT] ADMIN deleted ${fileType} for user ${userId} (status reset to PENDING)`);
    return res.status(200).json({ message: 'File deleted' });
  } catch (error) {
    console.error('Admin account verification file delete error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 