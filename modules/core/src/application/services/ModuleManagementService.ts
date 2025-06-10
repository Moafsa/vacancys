import { ModuleInfo } from '../../infrastructure/moduleRegistry/types';
import { moduleRegistry } from '../../infrastructure/moduleRegistry';
import { ModuleAuditLogger } from '../../infrastructure/audit/ModuleAuditLogger';

export class ModuleManagementService {
  private auditLogger: ModuleAuditLogger;

  constructor() {
    this.auditLogger = new ModuleAuditLogger();
  }

  async getAllModules(): Promise<ModuleInfo[]> {
    return moduleRegistry.getAllModules();
  }

  async getModuleInfo(moduleName: string): Promise<ModuleInfo | null> {
    return moduleRegistry.getModule(moduleName) || null;
  }

  async getModuleAuditLogs(
    moduleName?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    return this.auditLogger.getModuleAuditLogs(moduleName, startDate, endDate);
  }
} 