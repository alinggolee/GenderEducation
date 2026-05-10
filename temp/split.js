const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const files = [
    'alinggo-w1-practice.html',
    'alinggo-w2-w3-practice.html',
    'alinggo-w4-w6-practice.html',
    'alinggo-w7-w9-practice.html',
    'alinggo-w10-w12-practice.html',
    'alinggo-w13-w15-practice.html'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log('File not found:', filePath);
        return;
    }
    
    const html = fs.readFileSync(filePath, 'utf-8');
    
    if (file === 'alinggo-w1-practice.html') {
        const outDir = path.join(__dirname, '..', 'data', 'W1');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'guide.html'), html, 'utf-8');
        console.log('Wrote W1/guide.html');
        return;
    }
    
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const weekContents = document.querySelectorAll('.week-content');
    
    weekContents.forEach(contentDiv => {
        const id = contentDiv.id; // e.g. "week-w2"
        const weekMatch = id.match(/week-w(\d+)/);
        if (!weekMatch) return;
        
        const weekNum = weekMatch[1];
        const outDir = path.join(__dirname, '..', 'data', `W${weekNum}`);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        
        const weekDom = new JSDOM(html);
        const weekDoc = weekDom.window.document;
        
        const selector = weekDoc.querySelector('.week-selector');
        if (selector) selector.remove();
        
        // Update Title and H1 to be specific to this week
        const titleEl = weekDoc.querySelector('title');
        if (titleEl) {
            titleEl.textContent = `Alinggo W${weekNum} Teaching Practice`;
        }
        
        const h1El = weekDoc.querySelector('header h1');
        if (h1El) {
            h1El.textContent = `Week ${weekNum} Teaching Practice`;
        }
        
        const allContents = weekDoc.querySelectorAll('.week-content');
        allContents.forEach(div => {
            if (div.id === id) {
                div.classList.add('active');
            } else {
                div.remove();
            }
        });

        const outHtml = weekDom.serialize();
        fs.writeFileSync(path.join(outDir, 'guide.html'), outHtml, 'utf-8');
        console.log(`Wrote W${weekNum}/guide.html with updated title`);
    });
});
