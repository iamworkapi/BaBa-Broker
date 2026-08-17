const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../Baba_Broker-master');
const destComponentsDir = path.join(__dirname, '../src/components');
const destPagesDir = path.join(__dirname, '../src/pages');

if (!fs.existsSync(destComponentsDir)) fs.mkdirSync(destComponentsDir, { recursive: true });
if (!fs.existsSync(destPagesDir)) fs.mkdirSync(destPagesDir, { recursive: true });

function extractSections(html) {
  const navMatch = html.match(/<!-- Navbar Section Start -->([\s\S]*?)<!-- Navbar Section End -->/);
  const footerMatch = html.match(/<!-- Footer Section Start -->([\s\S]*?)<!-- Footer Section End -->/);
  
  const promoMatch = html.match(/<!-- Welcome Promo Popup -->([\s\S]*?)<!-- Right Sidebar Drawer -->/);
  const sidebarMatch = html.match(/<!-- Right Sidebar Drawer -->([\s\S]*?)<!-- Get a Quote Modal -->/);
  const quoteMatch = html.match(/<!-- Get a Quote Modal -->([\s\S]*?)<script/);

  const nav = navMatch ? navMatch[1] : '';
  const footer = footerMatch ? footerMatch[1] : '';
  const promo = promoMatch ? promoMatch[1] : '';
  const sidebar = sidebarMatch ? sidebarMatch[1] : '';
  const quote = quoteMatch ? quoteMatch[1] : '';

  const bodyRegex = /<!-- Navbar Section End -->([\s\S]*?)<!-- Footer Section Start -->/;
  const bodyMatch = html.match(bodyRegex);
  
  let body = '';
  if (bodyMatch) {
    body = bodyMatch[1];
  } else {
    const bMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    body = bMatch ? bMatch[1] : html;
  }

  return { nav, footer, promo, sidebar, quote, body };
}

function convertToJsx(htmlStr) {
  if (!htmlStr) return '';
  let jsx = htmlStr;
  
  // class to className
  jsx = jsx.replace(/class=/g, 'className=');
  // for to htmlFor
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  // style strings
  // Note: we can't fully convert style="background:red" automatically with simple regex, but we can try to fix standard inline styles or just remove them if there are few.
  // There are some style attributes: style="font-size:5rem;", style="background:#1877f2;"
  // I will replace style="..." with style={{...}} roughly
  jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    let styles = p1.split(';').filter(s => s.trim()).map(s => {
      let [key, val] = s.split(':');
      if (!key || !val) return '';
      key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      val = val.trim();
      return `${key}: '${val}'`;
    }).join(', ');
    return `style={{ ${styles} }}`;
  });

  // Self closing tags
  jsx = jsx.replace(/<(img|input|br|hr|source)([^>]*?)(?<!\/)>/g, '<$1$2 />');
  
  // Comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  // A href links
  jsx = jsx.replace(/href="javascript:void\(0\)"/g, 'href="#"');
  jsx = jsx.replace(/href="javascript:void\(\)"/g, 'href="#"');

  return jsx;
}

const indexHtml = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf-8');
const indexSections = extractSections(indexHtml);

const navbarJsx = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nexport default function Navbar() {\n  return (\n    <>\n      ${convertToJsx(indexSections.nav)}\n    </>\n  );\n}\n`;
fs.writeFileSync(path.join(destComponentsDir, 'Navbar.jsx'), navbarJsx);

const footerJsx = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nexport default function Footer() {\n  return (\n    <>\n      ${convertToJsx(indexSections.footer)}\n    </>\n  );\n}\n`;
fs.writeFileSync(path.join(destComponentsDir, 'Footer.jsx'), footerJsx);

const modalsJsx = `import React from 'react';\n\nexport default function SharedModals() {\n  return (\n    <>\n      ${convertToJsx(indexSections.promo)}\n      ${convertToJsx(indexSections.sidebar)}\n      ${convertToJsx(indexSections.quote)}\n    </>\n  );\n}\n`;
fs.writeFileSync(path.join(destComponentsDir, 'SharedModals.jsx'), modalsJsx);

const pages = [
  { file: 'index.html', component: 'Home' },
  { file: 'about-us.html', component: 'AboutUs' },
  { file: 'about-us1.html', component: 'AboutUsAlternate' },
  { file: 'contact-us.html', component: 'ContactUs' },
  { file: 'auth.html', component: 'Auth' },
  { file: 'blank.html', component: 'Blank' },
  { file: 'investor.html', component: 'Investor' },
  { file: 'partners.html', component: 'Partners' },
  { file: 'properties.html', component: 'Properties' },
  { file: 'property-details.html', component: 'PropertyDetails' },
];

pages.forEach(page => {
  const filePath = path.join(srcDir, page.file);
  if (!fs.existsSync(filePath)) {
    console.log('Skipping', page.file, 'not found');
    return;
  }
  
  const html = fs.readFileSync(filePath, 'utf-8');
  let sections = extractSections(html);
  
  if (!sections.nav && !sections.footer) {
    const bMatch = html.match(/<body[^>]*>([\s\S]*?)<script/);
    if(bMatch) sections.body = bMatch[1];
  }
  
  let pageJsx = convertToJsx(sections.body);
  
  const componentContent = `import React from 'react';\n${page.file !== 'auth.html' && page.file !== 'blank.html' ? "import Navbar from '../components/Navbar';\nimport Footer from '../components/Footer';\nimport SharedModals from '../components/SharedModals';\n" : ""}\nexport default function ${page.component}() {\n  return (\n    <div className="bg-dark text-white font-sans overflow-hidden">\n      ${page.file !== 'auth.html' && page.file !== 'blank.html' ? '<Navbar />' : ''}\n      ${pageJsx}\n      ${page.file !== 'auth.html' && page.file !== 'blank.html' ? '<Footer />' : ''}\n      ${page.file !== 'auth.html' && page.file !== 'blank.html' ? '<SharedModals />' : ''}\n    </div>\n  );\n}\n`;
  
  fs.writeFileSync(path.join(destPagesDir, page.component + '.jsx'), componentContent);
  console.log('Generated', page.component);
});

console.log('Done!');
