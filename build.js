const { exec } = require('child_process');
const path = require('path');

console.log('Starting custom build process...');

// Generate Prisma client first
exec('npx prisma generate', (error, stdout, stderr) => {
  if (error) {
    console.error('Prisma generate error:', error);
    process.exit(1);
  }
  console.log('Prisma client generated successfully');
  
  // Then build Next.js
  exec('npx next build', (error, stdout, stderr) => {
    if (error) {
      console.error('Next.js build error:', error);
      console.error('stderr:', stderr);
      process.exit(1);
    }
    console.log('Next.js build completed successfully');
    console.log(stdout);
  });
}); 