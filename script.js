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
    const hasTrainedAlgo = rawText.includes('trainedAlgorithmicMedia');
    const hasC2PA = rawText.includes('c2pa');
    const hasGemini = rawText.toLowerCase().includes('gemini');
    const hasChatGPT = rawText.toLowerCase().includes('chatgpt');

    results.innerHTML = `
        <p>trainedAlgorithmicMedia found: ${hasTrainedAlgo}</p>
        <p>C2PA data found: ${hasC2PA}</p>
        <p>Gemini found: ${hasGemini}</p>
        <p>ChatGPT found: ${hasChatGPT}</p>
    `;
}