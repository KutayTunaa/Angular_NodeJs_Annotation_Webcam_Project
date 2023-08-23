const fs = require('fs');
const path = require('path');

const photoDirectory = `photo_${Date.now()}.png`; // Fotoğrafların kaydedildiği dizin

// Dizini tarayarak
fs.readdir(photoDirectory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Fotoğraf dosyalarını filtreleme
  const photoFiles = files.filter(file => path.extname(file) === '.png');

  if (photoFiles.length > 0) {
    console.log('Saved Photos');
    photoFiles.forEach(file => {
      console.log(file);
    });
  } else {
    console.log('Not saved');
  }
});
