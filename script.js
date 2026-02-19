const upload = document.getElementById('imageUpload');
const results = document.getElementById('results');

upload.addEventListener('change', function() {
    const file = upload.files[0];
    const reader= new FileReader();

    reader.onload = function(e) {
        const rawText = new TextDecoder('utf-8', {fatal: false}).decode(e.target.result);
        console.log("Raw data loaded, length:", rawText.length);
    };

    reader.readAsArrayBuffer(file);
});