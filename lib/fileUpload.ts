import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import { NextApiRequest } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Constants
export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// S3 config from env
const S3_ENDPOINT = process.env.S3_ENDPOINT || '';
const S3_BUCKET = process.env.S3_BUCKET || '';
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || '';
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || '';
const S3_USE_SSL = process.env.S3_USE_SSL === 'true';

const s3 = new S3Client({
  region: 'us-east-1', // MinIO ignora a região, mas é obrigatório
  endpoint: `${S3_USE_SSL ? 'https' : 'http'}://${S3_ENDPOINT}`,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Types
export interface FileInfo {
  filepath: string;
  originalFilename?: string;
  mimetype?: string;
  size?: number;
  newFilename: string;
  publicPath: string;
}

export interface ParsedRequest {
  fields: {
    [key: string]: any;
  };
  files: {
    [key: string]: formidable.File | formidable.File[];
  };
}

/**
 * Saves an uploaded file to the uploads directory
 * @param {formidable.File} file - The file object from formidable
 * @returns {Promise<FileInfo>} - Information about the saved file
 */
export async function saveFile(file: formidable.File): Promise<FileInfo> {
  try {
    // Read file buffer
    const fileBuffer = await fs.readFile(file.filepath);
    const timestamp = Date.now();
    const filename = `${timestamp}-${uuidv4()}${path.extname(file.originalFilename || '.jpg')}`;

    // Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: filename,
      Body: fileBuffer,
      ContentType: file.mimetype || 'application/octet-stream',
      ACL: 'public-read',
    }));

    // Delete temporary file
    // try {
    //   await fs.unlink(file.filepath);
    // } catch (unlinkErr) {
    //   console.error('Error deleting temporary file:', unlinkErr);
    // }

    const publicPath = `${S3_USE_SSL ? 'https' : 'http'}://${S3_ENDPOINT}/${S3_BUCKET}/${filename}`;

    return {
      filepath: filename,
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size,
      newFilename: filename,
      publicPath,
    };
  } catch (error) {
    console.error('Error saving file to S3:', error);
    throw new Error(`Failed to save file to S3: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parses a multipart form request using formidable
 * @param {NextApiRequest} req - The request object
 * @returns {Promise<ParsedRequest>} - The parsed fields and files
 */
export function parseRequest(req: NextApiRequest): Promise<ParsedRequest> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return reject(err);
      }
      // Convert field arrays to single values
      const processedFields: { [key: string]: any } = {};
      Object.keys(fields).forEach(key => {
        processedFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      });
      resolve({ fields: processedFields, files });
    });
  });
} 