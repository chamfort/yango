const { execSync } = require('child_process');
try {
  console.log('Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });
} catch (e) {
  console.error('Prisma generate failed:');
  process.exit(1);
}
