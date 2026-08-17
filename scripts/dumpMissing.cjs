const fs = require('fs');
const content = fs.readFileSync('d:/ORISH/BaBa-Broker/Baba_Broker-master/index.html', 'utf-8');

const tStart = content.indexOf('<!-- Testimonial Section -->');
const tEnd = content.indexOf('<!-- Partnered Banks Section Start -->');
if (tStart > -1 && tEnd > -1) {
    fs.writeFileSync('d:/ORISH/BaBa-Broker/React/scripts/testim.html', content.substring(tStart, tEnd));
}

const bStart = content.indexOf('<!-- Partnered Banks Section Start -->');
const bEnd = content.indexOf('<!-- Partnered Banks Section End -->');
if (bStart > -1 && bEnd > -1) {
    fs.writeFileSync('d:/ORISH/BaBa-Broker/React/scripts/banks.html', content.substring(bStart, bEnd));
}

const rStart = content.indexOf('<!-- Real Estate Resources Start -->');
const rEnd = content.indexOf('<!-- Real Estate Resources End -->');
if (rStart > -1 && rEnd > -1) {
    fs.writeFileSync('d:/ORISH/BaBa-Broker/React/scripts/resources.html', content.substring(rStart, rEnd));
}

console.log("Done");
