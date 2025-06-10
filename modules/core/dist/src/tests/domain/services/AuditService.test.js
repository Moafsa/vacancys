"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuditService_1 = require("../../../domain/services/AuditService");
const AuditLog_1 = require("../../../domain/entities/AuditLog");
describe('AuditService', () => {
    let auditService;
    let mockAuditLogRepository;
    beforeEach(() => {
        mockAuditLogRepository = {
            create: jest.fn(),
            findByUserId: jest.fn(),
            findByAction: jest.fn(),
            findByDateRange: jest.fn(),
            findLatest: jest.fn(),
            deleteOldLogs: jest.fn()
        };
        auditService = new AuditService_1.AuditService(mockAuditLogRepository);
    });
    describe('logAction', () => {
        it('should create an audit log entry', async () => {
            const userId = 'user123';
            const action = AuditLog_1.AuditActionType.LOGIN;
            const details = 'User logged in';
            const ipAddress = '127.0.0.1';
            const userAgent = 'Mozilla/5.0';
            const metadata = { additional: 'info' };
            await auditService.logAction(userId, action, details, ipAddress, userAgent, metadata);
            expect(mockAuditLogRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                userId,
                action,
                details,
                ipAddress,
                userAgent,
                metadata
            }));
        });
    });
    describe('getUserAuditHistory', () => {
        it('should return audit logs for a specific user', async () => {
            const userId = 'user123';
            const mockLogs = [
                AuditLog_1.AuditLog.create({
                    userId,
                    action: AuditLog_1.AuditActionType.LOGIN,
                    details: 'Login attempt',
                    ipAddress: '127.0.0.1',
                    userAgent: 'Mozilla/5.0'
                })
            ];
            mockAuditLogRepository.findByUserId.mockResolvedValue(mockLogs);
            const result = await auditService.getUserAuditHistory(userId);
            expect(result).toEqual(mockLogs);
            expect(mockAuditLogRepository.findByUserId).toHaveBeenCalledWith(userId);
        });
    });
    describe('getActionHistory', () => {
        it('should return audit logs for a specific action', async () => {
            const action = AuditLog_1.AuditActionType.LOGIN;
            const mockLogs = [
                AuditLog_1.AuditLog.create({
                    userId: 'user123',
                    action,
                    details: 'Login attempt',
                    ipAddress: '127.0.0.1',
                    userAgent: 'Mozilla/5.0'
                })
            ];
            mockAuditLogRepository.findByAction.mockResolvedValue(mockLogs);
            const result = await auditService.getActionHistory(action);
            expect(result).toEqual(mockLogs);
            expect(mockAuditLogRepository.findByAction).toHaveBeenCalledWith(action);
        });
    });
    describe('getAuditHistoryByDateRange', () => {
        it('should return audit logs within a date range', async () => {
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-01-31');
            const mockLogs = [
                AuditLog_1.AuditLog.create({
                    userId: 'user123',
                    action: AuditLog_1.AuditActionType.LOGIN,
                    details: 'Login attempt',
                    ipAddress: '127.0.0.1',
                    userAgent: 'Mozilla/5.0',
                    timestamp: new Date('2024-01-15')
                })
            ];
            mockAuditLogRepository.findByDateRange.mockResolvedValue(mockLogs);
            const result = await auditService.getAuditHistoryByDateRange(startDate, endDate);
            expect(result).toEqual(mockLogs);
            expect(mockAuditLogRepository.findByDateRange).toHaveBeenCalledWith(startDate, endDate);
        });
    });
    describe('getLatestAuditLogs', () => {
        it('should return the latest audit logs with default limit', async () => {
            const mockLogs = [
                AuditLog_1.AuditLog.create({
                    userId: 'user123',
                    action: AuditLog_1.AuditActionType.LOGIN,
                    details: 'Login attempt',
                    ipAddress: '127.0.0.1',
                    userAgent: 'Mozilla/5.0'
                })
            ];
            mockAuditLogRepository.findLatest.mockResolvedValue(mockLogs);
            const result = await auditService.getLatestAuditLogs();
            expect(result).toEqual(mockLogs);
            expect(mockAuditLogRepository.findLatest).toHaveBeenCalledWith(100);
        });
        it('should return the latest audit logs with custom limit', async () => {
            const limit = 50;
            const mockLogs = [
                AuditLog_1.AuditLog.create({
                    userId: 'user123',
                    action: AuditLog_1.AuditActionType.LOGIN,
                    details: 'Login attempt',
                    ipAddress: '127.0.0.1',
                    userAgent: 'Mozilla/5.0'
                })
            ];
            mockAuditLogRepository.findLatest.mockResolvedValue(mockLogs);
            const result = await auditService.getLatestAuditLogs(limit);
            expect(result).toEqual(mockLogs);
            expect(mockAuditLogRepository.findLatest).toHaveBeenCalledWith(limit);
        });
    });
    describe('cleanupOldLogs', () => {
        it('should delete old logs with default retention period', async () => {
            await auditService.cleanupOldLogs();
            expect(mockAuditLogRepository.deleteOldLogs).toHaveBeenCalledWith(90);
        });
        it('should delete old logs with custom retention period', async () => {
            const daysToKeep = 30;
            await auditService.cleanupOldLogs(daysToKeep);
            expect(mockAuditLogRepository.deleteOldLogs).toHaveBeenCalledWith(daysToKeep);
        });
    });
});
//# sourceMappingURL=AuditService.test.js.map