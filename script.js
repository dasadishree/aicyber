const upload = document.getElementById('imageUpload');
const results = document.getElementById('results');

upload.addEventListener('change', function() {
    const file = upload.files[0];
    document.getElementById('popup-overlay').style.display = 'flex';
    results.innerHTML = `
        <p>Scanning...</p>
        <div class="loading-bar">
            <div class="loading-bar-fill"></div>
        </div>
    `;

    const reader= new FileReader();

    reader.onload = async function(e) {
        const rawText = new TextDecoder('utf-8', {fatal: false}).decode(e.target.result);
        scanForAI(rawText);
    };
    reader.readAsArrayBuffer(file);
});

async function scanForAI(rawText) {
    // //find value after keyword
    function extractAfter(text, keyword, stopChar) {
        const idx = text.indexOf(keyword);
        if(idx===-1) return null;
        const start = idx+keyword.length;
        const chunk = text.substring(start, start+200);
        return chunk.replace(/[^\x20-\x7E]/g, '').trim().split(stopChar)[0].trim();
    }
    
    //key fields
    const knownGenerators = ['ChatGPT', 'Gemini', 'DALL-E', 'Midjourney', 'Stable Diffusion', 'Adobe Firefly', 'Ideogram', 'Runway', 'Leonardo'];
    const generatorName = knownGenerators.find(name => rawText.includes(name)) || null;
    const softwareAgent = extractAfter(rawText, 'softwareAgent":"', '"') || extractAfter(rawText, 'softwareAgent">', '<');
    const sourceType = extractAfter(rawText, 'digitalSourceType":"', '"') || extractAfter(rawText, 'digitalsourcetype/', '"') || extractAfter(rawText, 'DigitalSourceType">', '<');
    const hasTrainedAlgo = rawText.includes('trainedAlgorithmicMedia');
    const hasC2PA = rawText.includes('c2pa');
    const hasContentAuth = rawText.includes('contentauth');

    let isAI =false; 
    let reasons = [];

    if(generatorName) { isAI=true; reasons.push('Known AI generator: ' + generatorName); }
    if(hasTrainedAlgo) { isAI=true; reasons.push('trainedAlgorithmicMedia tag detected'); }
    if(hasC2PA) { reasons.push('C2PA provenance data present'); }
    if(hasContentAuth) { reasons.push('Content authenticity data found'); }

    if(!hasTrainedAlgo && !hasC2PA && !generatorName && !hasContentAuth){
        results.innerHTML = `
            <p>No AI metadata found in this image.</p>
            <p>This looks like a real photo! No C2PA provenance data or AI generator signals were detected.</p>    
        `;
    }

    const rawMetadataText = rawText.substring(1,5000);
    const metadataText = `Generator: ${generatorName || 'unknown'}, trainedAlgorithmicMedia: ${hasTrainedAlgo}, C2PA present: ${hasC2PA}, signals: ${reasons.join(', ')}`;
    const summary = await getSummary(rawMetadataText+metadataText);

    document.getElementById('popup-overlay').style.display = 'flex';

    results.innerHTML = `
        <h2 class="results-title">Results</h2>
        <div class="verdict verdict--${isAI ? 'ai' : 'clean'}">${isAI ? "Likely AI Generated" : "No AI detected"}</div>
        <p class="aisummary"><strong>AI Summary</strong> ${summary}</p>
        <details class="metadata-dropdown">
            <summary>Show metadata details</summary>
            <div class="metadata-content">
                <p><strong>Generator:</strong> ${generatorName || 'Not found'}</p>
                <p><strong>Software Agent:</strong> ${softwareAgent || 'Not found'}</p>
                <p><strong>Source Type:</strong> ${sourceType || 'Not found'}</p>
                <p><strong>trainedAlgorithmicMedia:</strong> ${hasTrainedAlgo ? 'YES' : 'NO'}</p>
                <p><strong>C2PA data present:</strong> ${hasC2PA ? 'YES' : 'NO'}</p>
                <p><strong>Signals found:</strong></p>
                <ul>${reasons.map(r => `<li>${r}</li>`).join('') || '<li>None</li>'}</ul>
            </div>
        </details>
    `;
}

async function getSummary(metadata){
    const response = await fetch("https://aicyber-4785.onrender.com/summarize", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ metadata: metadata})
    });
    const data = await response.json();
    return data.summary;
}

document.getElementById('closeBtn').addEventListener('click', closePopup);

function closePopup() {
    document.getElementById('popup-overlay').style.display = 'none';
}