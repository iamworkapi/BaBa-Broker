const fs = require('fs');
const path = require('path');

const dir = 'd:/ORISH/BaBa-Broker/React/src/pages/';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.jsx')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf-8');
        
        // Only strip if they import Navbar (to avoid messing up already cleaned files like Home.jsx)
        if (content.includes('import Navbar from')) {
            // Remove imports
            content = content.replace(/import Navbar from '[^']+';\n?/g, '');
            content = content.replace(/import Footer from '[^']+';\n?/g, '');
            content = content.replace(/import SharedModals from '[^']+';\n?/g, '');
            
            // Remove components
            content = content.replace(/<Navbar \/>\n?/g, '');
            content = content.replace(/<Footer \/>\n?/g, '');
            content = content.replace(/<SharedModals \/>\n?/g, '');
            
            // Remove the outer div wrapper if it exactly matches what Layout now provides
            content = content.replace(/<div className="bg-dark text-white font-sans overflow-hidden">/g, '<>');
            
            // The last </div> from the wrapper should be replaced by </>
            // This is slightly tricky. Instead of replacing the last </div>, 
            // since we replace the top with <>, we can just replace the last </div> with </>
            // by finding the last index.
            const lastDivIdx = content.lastIndexOf('</div>');
            if (lastDivIdx !== -1) {
                content = content.substring(0, lastDivIdx) + '</>' + content.substring(lastDivIdx + 6);
            }
            
            fs.writeFileSync(path.join(dir, file), content, 'utf-8');
            console.log(`Cleaned up ${file}`);
        }
    }
});
