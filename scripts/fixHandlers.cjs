const fs = require('fs');
const path = require('path');

const dir = 'd:/ORISH/BaBa-Broker/React/src/components/home/';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.jsx')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf-8');
        content = content.replace(/onclick=/g, 'onClick=');
        content = content.replace(/onchange=/g, 'onChange=');
        content = content.replace(/onsubmit=/g, 'onSubmit=');
        fs.writeFileSync(path.join(dir, file), content, 'utf-8');
    }
});
console.log('Fixed event handlers in all components');
