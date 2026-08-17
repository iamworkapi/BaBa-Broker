const fs = require('fs');

const filepath = 'd:/ORISH/BaBa-Broker/React/src/pages/Home.jsx';
const content = fs.readFileSync(filepath, 'utf-8');

function extractAndSave(startMarker, endMarker, componentName) {
    const startIdx = content.indexOf(startMarker);
    const endIdx = content.indexOf(endMarker);
    if (startIdx !== -1 && endIdx !== -1) {
        let sectionCode = content.substring(startIdx, endIdx + endMarker.length);
        if (!endMarker) {
             sectionCode = content.substring(startIdx, endIdx);
        }
        const comp = `import React from 'react';\n\nconst ${componentName} = () => {\n    return (\n        <>\n            ${sectionCode}\n        </>\n    );\n};\n\nexport default ${componentName};`;
        fs.writeFileSync(`d:/ORISH/BaBa-Broker/React/src/components/home/${componentName}.jsx`, comp, 'utf-8');
        console.log(`Extracted ${componentName}`);
    } else {
        console.log(`Could not extract ${componentName}`);
    }
}

extractAndSave('{/*  Browse By Budget Section Start  */}', '{/*  Browse By Budget Section End  */}', 'BrowseByBudgetSection');
extractAndSave('{/*  Collection Section Start  */}', '{/*  Collection Section End  */}', 'CollectionSection');
extractAndSave('{/*  Why Choose Us Section  */}', '{/*  Property Types Section Start  */}', 'WhyChooseUsSection');
extractAndSave('{/*  Property Types Section Start  */}', '{/*  Property Types Section End  */}', 'PropertyTypesSection');
extractAndSave('{/*  ===================== FEATURED PROPERTIES =====================  */}', '{/*  Propery Tokenization Section Start  */}', 'FeaturedPropertiesSection');
extractAndSave('{/*  Propery Tokenization Section Start  */}', '{/*  Propery Tokenization Section End  */}', 'PropertyTokenizationSection');
extractAndSave('{/*  5 level of security section start  */}', '{/*  5 level of security section end  */}', 'SecuritySection');
extractAndSave('{/*  Testimonial Section  */}', '{/*  Partnered Banks Section Start  */}', 'TestimonialSection');
extractAndSave('{/*  Partnered Banks Section Start  */}', '{/*  Partnered Banks Section End  */}', 'PartneredBanksSection');
extractAndSave('{/*  Real Estate Resources Start  */}', '{/*  Real Estate Resources End  */}', 'ResourcesSection');
