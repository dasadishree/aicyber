const upload = document.getElementById('imageUpload');
const results = document.getElementById('results');

upload.addEventListener('change', function() {
    const file = upload.files[0];
    const reader= new FileReader();

    reader.onload = function(e) {
        const rawText = new TextDecoder('utf-8', {fatal: false}).decode(e.target.result);
        console.log("Raw data loaded, length:", rawText.length);
        scanForAI(rawText);
    };
    reader.readAsArrayBuffer(file);
});

function scanForAI(rawText) {
    results.innerHTML = '<p>Scanning...</p>';

    //find value after keyword
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

    results.innerHTML = `
        <h2>Results</h2>
        <p><strong>Generator:</strong> ${generatorName || 'Not found'}</p>
        <p><strong>Software Agent:</strong> ${softwareAgent || 'Not found'}</p>
        <p><strong>Source Type:</strong> ${sourceType || 'Not found'}</p>
        <p><strong>trainedAlgorithmicMedia:</strong> ${hasTrainedAlgo ? 'YES' : 'NO'}</p>
        <p><strong>C2PA data present:</strong> ${hasC2PA ? 'YES' : 'NO'}</p>
    `;
}