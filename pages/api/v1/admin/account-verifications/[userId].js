import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId } = req.query;
  if (req.method === 'GET') {
    try {
      const verification = await prisma.accountVerification.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              status: true,
              createdAt: true,
              // Adicione outros campos relevantes do usuário se necessário
            }
          }
        }
      });
      if (!verification) {
        return res.status(404).json({ message: 'Verification not found' });
      }
      return res.status(200).json(verification);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  if (req.method === 'POST') {
    const action = req.url.endsWith('/approve') ? 'approve' : req.url.endsWith('/reject') ? 'reject' : null;
    if (!action) return res.status(404).json({ message: 'Not found' });
    try {
      if (action === 'approve') {
        const verification = await prisma.accountVerification.update({
          where: { userId },
          data: { status: 'APPROVED', rejectionReason: null, approvedAt: new Date() }
        });
        return res.status(200).json(verification);
      } else if (action === 'reject') {
        const { reason } = req.body;
        const verification = await prisma.accountVerification.update({
          where: { userId },
          data: { status: 'REJECTED', rejectionReason: reason || 'Rejeitado pelo admin' }
        });
        return res.status(200).json(verification);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  if (req.method === 'PATCH') {
    try {
      // (Opcional: checar se é admin pelo token)
      const { action, fileType, reason } = req.body; // action: 'approve' ou 'reject', fileType obrigatório
      if (!['approve', 'reject'].includes(action) || !['document', 'proofOfAddress', 'selfie'].includes(fileType)) {
        return res.status(400).json({ message: 'Invalid action or fileType' });
      }
      const verification = await prisma.accountVerification.findUnique({ where: { userId } });
      if (!verification) return res.status(404).json({ message: 'Verification not found' });
      const updateData = {};
      const fs = await import('fs/promises');
      const path = await import('path');
      if (action === 'approve') {
        if (fileType === 'document') {
          updateData.documentStatus = 'APPROVED';
          updateData.documentRejectionReason = null;
        } else if (fileType === 'proofOfAddress') {
          updateData.proofOfAddressStatus = 'APPROVED';
          updateData.proofOfAddressRejectionReason = null;
        } else if (fileType === 'selfie') {
          updateData.selfieStatus = 'APPROVED';
          updateData.selfieRejectionReason = null;
        }
      } else {
        if (fileType === 'document') {
          updateData.documentStatus = 'REJECTED';
          updateData.documentRejectionReason = reason || 'Rejected by admin';
        } else if (fileType === 'proofOfAddress') {
          updateData.proofOfAddressStatus = 'REJECTED';
          updateData.proofOfAddressRejectionReason = reason || 'Rejected by admin';
        } else if (fileType === 'selfie') {
          // Excluir arquivo do disco se existir
          if (verification.selfieUrl) {
            const filePath = path.join(process.cwd(), 'public', verification.selfieUrl.replace(/^\/uploads\//, 'uploads/'));
            try { await fs.unlink(filePath); } catch (e) { /* ignora se já não existe */ }
          }
          updateData.selfieUrl = null;
          updateData.selfieStatus = 'PENDING';
          updateData.selfieRejectionReason = null;
        }
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
        newStatus = 'PENDING'; // Mantém PENDING mesmo se houver REJECTED, conforme regra
      }
      updateData.status = newStatus;
      if (newStatus === 'APPROVED') updateData.rejectionReason = null;
      const updated = await prisma.accountVerification.update({ where: { userId }, data: updateData });
      // Log detalhado
      if (fileType === 'selfie' && action === 'reject') {
        console.log(`[AUDIT] ADMIN rejected selfie for user ${userId} | Selfie deleted and status reset to PENDING.`);
      } else {
        console.log(`[AUDIT] ADMIN ${action}d ${fileType} for user ${userId}${action === 'reject' ? ' | Reason: ' + reason : ''}`);
      }
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
} 