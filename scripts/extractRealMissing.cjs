const fs = require('fs');

const htmlFile = 'd:/ORISH/BaBa-Broker/Baba_Broker-master/index.html';
let content = fs.readFileSync(htmlFile, 'utf-8');

function htmlToJsx(html) {
    let jsx = html;
    jsx = jsx.replace(/class=/g, 'className=');
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    jsx = jsx.replace(/<!--(.*?)-->/gs, '{/*$1*/}');
    // Convert inline styles manually
    jsx = jsx.replace(/style=\"(.*?)\"/g, (match, p1) => {
        let styleObj = p1.split(';').filter(s => s.trim()).map(s => {
            let [k, v] = s.split(':');
            if(!k || !v) return '';
            k = k.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            return `${k}: '${v.trim().replace(/'/g, "\\'")}'`;
        }).join(', ');
        return `style={{ ${styleObj} }}`;
    });
    // Self close tags like img, input, hr, br
    jsx = jsx.replace(/<img([^>]+[^\/])>/g, '<img$1 />');
    jsx = jsx.replace(/<input([^>]+[^\/])>/g, '<input$1 />');
    jsx = jsx.replace(/<hr([^>]+[^\/])>/g, '<hr$1 />');
    jsx = jsx.replace(/<br([^>]+[^\/])>/g, '<br$1 />');
    return jsx;
}

function extractAndSave(startMarker, endMarker, componentName) {
    const startIdx = content.indexOf(startMarker);
    const endIdx = content.indexOf(endMarker);
    if (startIdx !== -1 && endIdx !== -1) {
        let sectionCode = content.substring(startIdx, endIdx + endMarker.length);
        if (!endMarker) {
             sectionCode = content.substring(startIdx, endIdx);
        }
        let jsxCode = htmlToJsx(sectionCode);
        const comp = `import React from 'react';\n\nconst ${componentName} = () => {\n    return (\n        <>\n            ${jsxCode}\n        </>\n    );\n};\n\nexport default ${componentName};`;
        fs.writeFileSync(`d:/ORISH/BaBa-Broker/React/src/components/home/${componentName}.jsx`, comp, 'utf-8');
        console.log(`Extracted ${componentName}`);
    } else {
        console.log(`Could not extract ${componentName}`);
    }
}

extractAndSave('<!-- We handle everything section start -->', '<!-- About Section Start -->', 'WeHandleEverythingSection');
extractAndSave('<!-- FAQ Section Start -->', '<!-- FAQ Section End -->', 'FAQSection');
extractAndSave('<!-- Contact us and Blog Section Start -->', '<!-- Contact us and Blog Section End -->', 'ContactUsAndBlogSection');

