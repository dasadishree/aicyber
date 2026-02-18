const upload = document.getElementById('imageUpload');
upload.addEventListener('change', function() {
    const file = upload.files[0];
    console.log('File selected:', file.name);
});