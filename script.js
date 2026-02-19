import { createC2pa } from 'https://cdn.jsdelivr.net/npm/c2pa@0.17.0/+esm';
const upload = document.getElementById('imageUpload');
const results = document.getElementById('results');
const c2pa = await createC2pa({
    workerSrc: new URL('https://cdn.jsdelivr.net/npm/c2pa@0.17.0/dist/c2pa.worker.min.js'),
    wasmSrc: new URL('https://cdn.jsdelivr.net/npm/c2pa@0.17.0/dist/assets/wasm/toolkit_bg.wasm'),
});

upload.addEventListener('change', async function() {
    const file = upload.files[0];
    results.innerHTML = '<p>Scanning..</p>';

    try{
        const { manifestStore } = await c2pa.read(file);

        if(!manifestStore) {
            results.innerHTML = '<p>No C2PA data found in this image.</p>';
            return;
        }

        const manifest = manifestStore.activeManifest;
        console.log('Full manifest:', manifest);
        console.log('Claim generator:', manifest?.claimGenerator);
        console.log('Assertions:', manifest?.assertions);
        console.log('All keys:', Object.keys(manifest || {}));
        const generatorName = manifest?.claimGenerator?.product || 'Not found';
        const assertions = manifest?.assertions?.get('c2pa.actions');
    
        results.innerHTML = `
            <p><strong>Generator:</strong> ${generatorName}</p>
            <p><strong>C2PA data:</strong> YES</p>
        `;
    } catch(err) {
        console.error(err);
        results.innerHTML = '<p>Error reading C2PA data: ' + err.message+'</p>';
    }
});