import path from 'path';
import fs from 'fs';

export const IMAGES_DIR = 'public/';

export const deleteImage = (imageName: string): void => {
  try {
    fs.rmSync(path.join(IMAGES_DIR, imageName), {
      force: true,
    });
  } catch (error) {
    console.log(`failed to delete image with name: ${imageName}`);
  }
};
