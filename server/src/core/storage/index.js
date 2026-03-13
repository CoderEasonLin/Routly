import fs from 'fs/promises';
import path from 'path';

const REQUEST_EXT = '.req.json';
const ENV_EXT = '.env.json';

/**
 * Reads a JSON file from disk and parses it.
 */
export async function readFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Writes an entity as a formatted JSON file.
 * For environment files, strips localValue and isSecret flags before peristing
 * the "shared" copy (the one that gets committed to git).
 */
export async function writeFile(filePath, data) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  let dataToWrite = data;

  // Strip sensitive environment variables for the committed file
  if (filePath.endsWith(ENV_EXT) && Array.isArray(data.variables)) {
    dataToWrite = {
      ...data,
      variables: data.variables.map(({ localValue, isSecret, ...rest }) => rest),
    };
  }

  await fs.writeFile(filePath, JSON.stringify(dataToWrite, null, 2), 'utf-8');
}

/**
 * Recursively builds a directory tree of requests and environments.
 */
export async function buildTree(dirPath, rootPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const children = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    // Use relative path only for display; pass absolute path for API calls
    const relPath = path.relative(rootPath, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      const subChildren = await buildTree(fullPath, rootPath);
      children.push({ name: entry.name, type: 'directory', path: fullPath, relPath, children: subChildren });
    } else if (entry.name.endsWith(REQUEST_EXT)) {
      children.push({ name: entry.name, type: 'file', entity_type: 'request', path: fullPath, relPath });
    } else if (entry.name.endsWith(ENV_EXT)) {
      children.push({ name: entry.name, type: 'file', entity_type: 'environment', path: fullPath, relPath });
    }
  }

  return children;
}
