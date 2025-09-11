import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Try multiple possible paths for different deployment environments
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'resume'),
      path.join(process.cwd(), '.next', 'static', 'chunks', 'pages', 'public', 'resume'),
      path.join('/var/task', 'public', 'resume'),
      path.join(__dirname, '..', '..', '..', 'public', 'resume')
    ];

    let resumeDir = '';
    let files: string[] = [];

    // Find the correct path that exists
    for (const possiblePath of possiblePaths) {
      try {
        if (fs.existsSync(possiblePath)) {
          resumeDir = possiblePath;
          files = fs.readdirSync(possiblePath);
          break;
        }
      } catch (error) {
        // Continue to next path
        continue;
      }
    }

    // If no directory found, fall back to known filename
    if (!resumeDir || files.length === 0) {
      console.log('No resume directory found, using fallback');
      return res.status(200).json({ 
        resumeUrl: `/resume/Resume%20(Austin%20Xu%20for%20Full-Stack%20+%20AI%20Developer%2025-08-25).pdf` 
      });
    }

    // Find the first PDF file
    const pdfFile = files.find(file => 
      file.toLowerCase().endsWith('.pdf')
    );

    if (!pdfFile) {
      console.log('No PDF found in directory, using fallback');
      return res.status(200).json({ 
        resumeUrl: `/resume/Resume%20(Austin%20Xu%20for%20Full-Stack%20+%20AI%20Developer%2025-08-25).pdf` 
      });
    }

    // Return the URL-encoded path to the resume
    const resumeUrl = `/resume/${encodeURIComponent(pdfFile)}`;
    
    res.status(200).json({ resumeUrl });
  } catch (error) {
    console.error('Error finding resume:', error);
    // Fallback to known filename
    res.status(200).json({ 
      resumeUrl: `/resume/Resume%20(Austin%20Xu%20for%20Full-Stack%20+%20AI%20Developer%2025-08-25).pdf` 
    });
  }
}