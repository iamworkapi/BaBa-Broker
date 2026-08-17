const fs = require('fs');
const path = require('path');
const dirs = ['src/pages', 'src/components'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      if (file.endsWith('.jsx')) {
        let content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
        content = content.replace(/->/g, '-&gt;');
        content = content.replace(/style=\{\{\s*background:\s*'url\('([^']+)'\)([^']*)'\s*\}\}/g, 'style={{ background: `url(\'$1\') $2` }}');
        
        // Let's also catch the case where the regex in my converter generated an invalid string literal:
        // background: 'url('./assets/img/about-banner.jpg') center/cover no-repeat'
        // That throws a SyntaxError in JS.
        content = content.replace(/background: 'url\('\.\/assets\/img\/about-banner\.jpg'\) center\/cover no-repeat'/g, 'background: "url(\'./assets/img/about-banner.jpg\') center/cover no-repeat"');
        
        fs.writeFileSync(path.join(dirPath, file), content);
      }
    });
  }
});
console.log('Fixed JSX syntax');
