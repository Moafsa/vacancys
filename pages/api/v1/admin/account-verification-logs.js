import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Apenas GET permitido
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  // (Opcional: checar se é admin pelo token)
  try {
    const logPath = path.join(process.cwd(), 'verification_audit.log');
    if (!fs.existsSync(logPath)) {
      return res.status(200).json([]);
    }
    const lines = fs.readFileSync(logPath, 'utf-8').split('\n').filter(Boolean);
    const logs = lines.map(line => {
      const [timestamp, file, fileType, result, reason] = line.split(' | ');
      return { timestamp, file, fileType, result, reason };
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 