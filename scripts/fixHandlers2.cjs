const fs = require('fs');
const path = require('path');

const dir = 'd:/ORISH/BaBa-Broker/React/src/components/home/';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.jsx')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf-8');
        
        // Replace onClick="func()" with onClick={(event) => func()}
        content = content.replace(/onClick="([^"]+)"/g, 'onClick={(event) => { $1 }}');
        content = content.replace(/onChange="([^"]+)"/g, 'onChange={(event) => { $1 }}');
        content = content.replace(/onSubmit="([^"]+)"/g, 'onSubmit={(event) => { $1 }}');
        
        fs.writeFileSync(path.join(dir, file), content, 'utf-8');
    }
});
console.log('Fixed event handler braces in all components');
