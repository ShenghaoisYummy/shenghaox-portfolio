import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface CheckImageResponse {
  exists: boolean;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckImageResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ exists: false });
  }

  const { imagePath } = req.query;

  if (!imagePath || typeof imagePath !== 'string') {
    return res.status(400).json({ exists: false });
  }

  try {
    // Remove leading slash and construct full path
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(process.cwd(), 'public', cleanPath);
    
    // Check if file exists
    const exists = fs.existsSync(fullPath);
    
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking image:', error);
    res.status(500).json({ exists: false });
  }
}