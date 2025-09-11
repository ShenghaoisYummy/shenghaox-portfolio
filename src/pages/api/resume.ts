import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const resumeDir = path.join(process.cwd(), 'public', 'resume');
    
    // Check if resume directory exists
    if (!fs.existsSync(resumeDir)) {
      return res.status(404).json({ message: 'Resume directory not found' });
    }

    // Read the resume directory
    const files = fs.readdirSync(resumeDir);
    
    // Find the first PDF file
    const pdfFile = files.find(file => 
      file.toLowerCase().endsWith('.pdf')
    );

    if (!pdfFile) {
      return res.status(404).json({ message: 'No PDF resume found' });
    }

    // Return the URL-encoded path to the resume
    const resumeUrl = `/resume/${encodeURIComponent(pdfFile)}`;
    
    res.status(200).json({ resumeUrl });
  } catch (error) {
    console.error('Error finding resume:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}