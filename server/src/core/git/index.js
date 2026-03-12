import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Run a git command in a specified workspace directory.
 * @param {string} workspacePath - Absolute path to the git repo
 * @param {string} cmd - git subcommand (e.g. 'status --porcelain')
 */
async function runGit(workspacePath, cmd) {
  console.log(`[git] ${cmd} in ${workspacePath}`);
  const { stdout, stderr } = await execAsync(`git ${cmd}`, {
    cwd: workspacePath,
  });
  if (stderr) console.warn(`[git stderr] ${stderr}`);
  return stdout.trim();
}

export async function gitStatus(workspacePath) {
  const raw = await runGit(workspacePath, 'status --porcelain -b');
  const lines = raw.split('\n').filter(Boolean);
  const branchLine = lines[0] || '';
  const branch = branchLine.replace('## ', '').split('...')[0];

  const staged = [];
  const unstaged = [];
  const untracked = [];

  for (const line of lines.slice(1)) {
    const xy = line.slice(0, 2);
    const filePath = line.slice(3).trim();
    if (xy[0] !== ' ' && xy[0] !== '?') staged.push(filePath);
    if (xy[1] === 'M' || xy[1] === 'D') unstaged.push(filePath);
    if (xy === '??') untracked.push(filePath);
  }

  return {
    branch,
    hasChanges: staged.length + unstaged.length + untracked.length > 0,
    staged,
    unstaged,
    untracked,
  };
}

export async function gitAdd(workspacePath, files = '.') {
  const targets = Array.isArray(files) ? files.join(' ') : files;
  return runGit(workspacePath, `add ${targets}`);
}

export async function gitCommit(workspacePath, message) {
  return runGit(workspacePath, `commit -m "${message.replace(/"/g, '\\"')}"`);
}

export async function gitLog(workspacePath, limit = 20) {
  const raw = await runGit(
    workspacePath,
    `log --pretty=format:"%H|%an|%ae|%aI|%s" -${limit}`
  );
  if (!raw) return [];
  return raw.split('\n').map((line) => {
    const [hash, author, email, date, ...msgParts] = line.split('|');
    return { hash, author, email, date, message: msgParts.join('|') };
  });
}

export async function gitPush(workspacePath) {
  return runGit(workspacePath, 'push');
}

export async function gitPull(workspacePath) {
  return runGit(workspacePath, 'pull');
}

export async function gitBranches(workspacePath) {
  const raw = await runGit(workspacePath, 'branch -a');
  return raw.split('\n').map((b) => b.replace('* ', '').trim()).filter(Boolean);
}
