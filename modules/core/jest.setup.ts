import { jest, afterEach } from '@jest/globals';

// Increase test timeout to 10 seconds
jest.setTimeout(10000);
 
// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
}); 