import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const docsDir = 'docs';
const nojekyllPath = join(docsDir, '.nojekyll');

try {
  // Ensure docs directory exists
  mkdirSync(docsDir, { recursive: true });
  // Create .nojekyll file
  writeFileSync(nojekyllPath, '');
  console.log('Created .nojekyll file in docs directory');
} catch (error) {
  console.error('Error creating .nojekyll file:', error);
  process.exit(1);
}

