const upload = document.getElementById('imageUpload');
const results = document.getElementById('results');

upload.addEventListener('change', function() {
    const file = upload.files[0];
    results.innerHTML = '<p>Scanning...</p>';

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
    const knownGenerators = ['ChatGPT', 'Gemini', 'DALL-E'];
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

    const metadataText = `trainedAlgorithmicMedia: ${hasTrainedAlgo}, C2PA: ${hasC2PA}, generator: ${generatorName}, sourceType: ${sourceType}`;
    const summary = await getSummary(metadataText);

    results.innerHTML = `
        <h2 class="results-title">Results</h2>
        <div class="verdict verdict--${isAI ? 'ai' : 'clean'}">${isAI ? "Likely AI Generated" : "No AI detected"}</div>
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
    const response = await fetch("http://localhost:3000/summarize", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ metadata: metadata})
    });
    const data = await response.json();
    return data.summary;
}