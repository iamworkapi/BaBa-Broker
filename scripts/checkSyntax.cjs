const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

const dir = 'd:/ORISH/BaBa-Broker/React/src/components/home/';
const files = fs.readdirSync(dir);

let hasErrors = false;
files.forEach(file => {
    if (file.endsWith('.jsx')) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        try {
            parser.parse(content, {
                sourceType: 'module',
                plugins: ['jsx']
            });
        } catch (err) {
            hasErrors = true;
            console.error(`Syntax error in ${file}: ${err.message}`);
        }
    }
});

if (!hasErrors) {
    console.log('All JSX files passed syntax check!');
}
