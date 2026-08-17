const fs = require('fs');
const path = require('path');

const dir = 'd:/ORISH/BaBa-Broker/React/src/components/home/';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.jsx')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf-8');
        
        // Fix plain <br>, <hr>, <img>, <input> without attributes
        content = content.replace(/<br>/g, '<br />');
        content = content.replace(/<hr>/g, '<hr />');
        content = content.replace(/<img>/g, '<img />');
        content = content.replace(/<input>/g, '<input />');
        
        // Also if we missed any with attributes that don't end in />
        // A simple way is to use a slightly better regex for unclosed tags, but it's risky if they are already closed.
        // Let's just manually fix the known ones we missed.
        
        // Fix unescaped braces in PropertyTokenizationSection (and others)
        // specifically `PropertyToken {`
        content = content.replace(/PropertyToken \{/g, 'PropertyToken {"{"}');
        // specifically the closing brace on a line by itself in code block
        content = content.replace(/<span className="ptok-code-line">\}<\/span>/g, '<span className="ptok-code-line">{"}"}</span>');

        fs.writeFileSync(path.join(dir, file), content, 'utf-8');
    }
});
console.log('Fixed syntax errors in JSX files');
