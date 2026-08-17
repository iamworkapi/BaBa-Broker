const fs = require('fs');
const path = require('path');
const dirs = ['src/pages', 'src/components'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      if (file.endsWith('.jsx')) {
        let content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
        content = content.replace(/>\}/g, '>{"}"}');
        fs.writeFileSync(path.join(dirPath, file), content);
      }
    });
  }
});
console.log('Fixed closing curly brace');
