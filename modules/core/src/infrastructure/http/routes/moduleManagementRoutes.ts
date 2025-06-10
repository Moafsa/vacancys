import { Router } from 'express';
import { ModuleManagementService } from '../../../application/services/ModuleManagementService';
import { createValidateToken, requireRole } from '../middleware/auth';
import { UserRole } from '../../../domain/enums/UserRole';
import { UserRepository } from '../../repositories/UserRepository';
import { prisma } from '@lib/prisma';

const router = Router();
const moduleService = new ModuleManagementService();
const userRepository = new UserRepository(prisma);

// List all modules
router.get('/modules', createValidateToken(userRepository), requireRole([UserRole.ADMIN]), async (req, res) => {
  try {
    const modules = await moduleService.getAllModules();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list modules' });
  }
});

// Get module info
router.get('/modules/:name', createValidateToken(userRepository), requireRole([UserRole.ADMIN]), async (req, res) => {
  try {
    const module = await moduleService.getModuleInfo(req.params.name);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get module info' });
  }
});

// Get module status
// router.get('/modules/:name/status', createValidateToken(userRepository), requireRole([UserRole.ADMIN]), async (req, res) => {
//   try {
//     const status = await moduleService.getModuleStatus(req.params.name);
//     res.json(status);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to get module status' });
//   }
// });

// Get module audit logs
router.get('/modules/:name/audit-logs', createValidateToken(userRepository), requireRole([UserRole.ADMIN]), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const logs = await moduleService.getModuleAuditLogs(
      req.params.name,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get module audit logs' });
  }
});

// Activate module
// router.post('/modules/:name/activate', createValidateToken(userRepository), requireRole([UserRole.ADMIN]), async (req, res) => {
//   try {
//     await moduleService.activateModule(req.params.name, req.user!.userId);
//     res.json({ message: 'Module activated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to activate module' });
//   }
// });

// Deactivate module
// router.post('/modules/:name/deactivate', createValidateToken(userRepository), requireRole([UserRole.ADMIN]), async (req, res) => {
//   try {
//     await moduleService.deactivateModule(req.params.name, req.user!.userId);
//     res.json({ message: 'Module deactivated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to deactivate module' });
//   }
// });

export default router; 