import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const router = Router();
const execAsync = promisify(exec);

/**
 * POST /api/dialog/open-folder
 * Uses the OS-native folder-picker dialog.
 * On Windows: PowerShell FolderBrowserDialog
 * On macOS: AppleScript choose folder
 */
router.post('/open-folder', async (_req, res, next) => {
  try {
    let selectedPath = null;

    if (process.platform === 'win32') {
      const script = `
        Add-Type -AssemblyName System.Windows.Forms;
        $d = New-Object System.Windows.Forms.FolderBrowserDialog;
        $d.Description = 'Select a Git workspace folder';
        if ($d.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
          Write-Output $d.SelectedPath
        }
      `;
      const { stdout } = await execAsync(`powershell -Command "${script.replace(/\n/g, ' ')}"`);
      selectedPath = stdout.trim() || null;
    } else if (process.platform === 'darwin') {
      const { stdout } = await execAsync(
        `osascript -e 'POSIX path of (choose folder with prompt "Select a Git workspace folder")'`
      );
      selectedPath = stdout.trim().replace(/\/$/, '') || null;
    } else {
      // Linux: try zenity or kdialog
      try {
        const { stdout } = await execAsync('zenity --file-selection --directory --title="Select workspace"');
        selectedPath = stdout.trim() || null;
      } catch {
        return res.status(501).json({ error: 'No folder dialog available on this Linux system. Install zenity.' });
      }
    }

    if (!selectedPath) {
      return res.json({ cancelled: true, path: null });
    }
    res.json({ cancelled: false, path: selectedPath });
  } catch (err) {
    next(err);
  }
});

export default router;
