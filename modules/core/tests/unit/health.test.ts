import request from 'supertest';
import express from 'express';
import { app } from '../../src/app';

describe('Health Check Endpoint', () => {
  it('should return 200 and correct response structure', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
}); 