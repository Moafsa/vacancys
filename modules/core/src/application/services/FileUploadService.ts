import { promises as fs } from 'fs';
import path from 'path';
// import { v4 as uuidv4 } from 'uuid'; // Removido pois não é mais usado
import { IncomingForm } from 'formidable';
import { Request } from 'express';
import { saveFile as s3SaveFile } from '@lib/fileUpload';
import type { FileInfo } from '@lib/fileUpload';

export interface FileUploadOptions {
  maxFileSize?: number;
  allowedTypes?: string[];
  uploadDir?: string;
}

export interface UploadedFile {
  filepath: string;
  originalFilename: string;
  mimetype: string;
  size: number;
  newFilename: string;
  publicPath: string;
}

export class FileUploadService {
  private defaultOptions: FileUploadOptions = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    uploadDir: path.join(process.cwd(), 'public', 'uploads')
  };

  constructor(private options: FileUploadOptions = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  async parseRequest(req: Request): Promise<{ fields: any; files: any }> {
    const uploadDir = this.options.uploadDir || this.defaultOptions.uploadDir!;

    try {
      // Ensure upload directory exists
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Error creating upload directory:', err);
    }

    const form = new IncomingForm({
      maxFileSize: this.options.maxFileSize || this.defaultOptions.maxFileSize,
      uploadDir: uploadDir,
      keepExtensions: true,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          return reject(err);
        }
        
        // Convert fields from arrays to single values
        const processedFields: Record<string, any> = {};
        Object.keys(fields).forEach(key => {
          processedFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
        });
        
        resolve({ fields: processedFields, files });
      });
    });
  }

  async saveFile(file: any): Promise<FileInfo> {
    return s3SaveFile(file);
  }

  async deleteFile(publicPath: string): Promise<void> {
    if (!publicPath || !publicPath.startsWith('/uploads/')) {
      throw new Error('Invalid file path');
    }

    const filename = publicPath.split('/').pop();
    const uploadDir = this.options.uploadDir || this.defaultOptions.uploadDir!;
    const filePath = path.join(uploadDir, filename);

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
} 