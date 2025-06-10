import { Router } from 'express';
import { PermissionService } from '../../../application/services/PermissionService';
import { RoleService } from '../../../application/services/RoleService';
import { UserRoleService } from '../../../application/services/UserRoleService';
import { UserPermissionService } from '../../../application/services/UserPermissionService';
import { Role } from '@prisma/client';

const router = Router();
const permissionService = new PermissionService();
const roleService = new RoleService();
const userRoleService = new UserRoleService();
const userPermissionService = new UserPermissionService();

// Permissions
router.get('/permissions', async (req, res) => {
  const permissions = await permissionService.getAll();
  res.json(permissions);
});

router.post('/permissions', async (req, res) => {
  const { name, description } = req.body;
  const permission = await permissionService.create(name, description);
  res.status(201).json(permission);
});

router.get('/permissions/:id', async (req, res) => {
  const permission = await permissionService.getById(req.params.id);
  if (!permission) return res.status(404).json({ error: 'Permission not found' });
  res.json(permission);
});

router.put('/permissions/:id', async (req, res) => {
  const permission = await permissionService.update(req.params.id, req.body);
  res.json(permission);
});

router.delete('/permissions/:id', async (req, res) => {
  const permission = await permissionService.delete(req.params.id);
  res.json(permission);
});

// Roles
router.get('/roles', async (req, res) => {
  const roles = await roleService.getAllRoles();
  res.json(roles);
});

router.get('/roles/:role/permissions', async (req, res) => {
  const permissions = await roleService.getPermissionsByRole(req.params.role as Role);
  res.json(permissions);
});

router.post('/roles/:role/permissions', async (req, res) => {
  const { permissionId } = req.body;
  const rp = await roleService.assignPermissionToRole(req.params.role as Role, permissionId);
  res.status(201).json(rp);
});

router.delete('/roles/:role/permissions/:permissionId', async (req, res) => {
  const rp = await roleService.removePermissionFromRole(req.params.role as Role, req.params.permissionId);
  res.json(rp);
});

// User Roles
router.get('/users/:id/roles', async (req, res) => {
  const roles = await userRoleService.getRolesOfUser(req.params.id);
  res.json(roles);
});

router.post('/users/:id/roles', async (req, res) => {
  const { role } = req.body;
  const ur = await userRoleService.assignRoleToUser(req.params.id, role);
  res.status(201).json(ur);
});

router.delete('/users/:id/roles/:role', async (req, res) => {
  const ur = await userRoleService.removeRoleFromUser(req.params.id, req.params.role as Role);
  res.json(ur);
});

// User Permissions
router.get('/users/:id/permissions', async (req, res) => {
  const permissions = await userPermissionService.getPermissionsOfUser(req.params.id);
  res.json(permissions);
});

router.post('/users/:id/permissions', async (req, res) => {
  const { permissionId } = req.body;
  const up = await userPermissionService.assignPermissionToUser(req.params.id, permissionId);
  res.status(201).json(up);
});

router.delete('/users/:id/permissions/:permissionId', async (req, res) => {
  const up = await userPermissionService.removePermissionFromUser(req.params.id, req.params.permissionId);
  res.json(up);
});

export default router; 