import { moduleUtils } from './utils/modules';
import { dockerUtils } from './utils/docker';
import { logger } from './utils/logger';

async function start() {
  try {
    // Ensure Docker networks exist
    await dockerUtils.ensureNetworks();

    // Get all modules
    const modules = moduleUtils.getModules();
    logger.info(`Found ${modules.length} modules to start`);

    // Start each module sequentially
    for (const moduleInfo of modules) {
      await moduleUtils.startModule(moduleInfo);
    }

    // Start Docker services
    await dockerUtils.startServices();

    // Check if services are running
    const servicesRunning = await dockerUtils.checkServices();
    if (!servicesRunning) {
      throw new Error('Failed to start services');
    }

    logger.success('All modules started successfully!');
  } catch (error) {
    logger.error('Failed to start modules', error);
    process.exit(1);
  }
}

start(); 