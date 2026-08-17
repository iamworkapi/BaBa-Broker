const fs = require('fs');
const path = require('path');
const dirs = ['src/pages', 'src/components'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      if (file.endsWith('.jsx')) {
        let content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
        content = content.replace(/onclick=/g, 'onClick=');
        content = content.replace(/onClick="([^"]+)"/g, (match, p1) => {
            return `onClick={() => window.${p1}}`;
        });
        
        // Let's also make sure to remove any `onclick="openQuoteModal()"` from Navbar since we will let main.js handle it if we want, OR we use onClick hooks.
        // Actually window.openQuoteModal() should work if main.js is loaded in index.html.
        
        fs.writeFileSync(path.join(dirPath, file), content);
      }
    });
  }
});
console.log('Fixed onClick handlers');
