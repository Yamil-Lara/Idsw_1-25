var buscarBtn = document.getElementById('buscarBtn');
var modal = document.getElementById('modal');
var confirmYes = document.getElementById('confirmYes');
var confirmNo = document.getElementById('confirmNo');
buscarBtn.addEventListener('click', function () {
    modal.classList.remove('hidden');
});
confirmNo.addEventListener('click', function () {
    modal.classList.add('hidden');
});
confirmYes.addEventListener('click', function () {
    // Puedes redirigir, reiniciar, o hacer otra lógica aquí.
    alert('Redirigiendo a la búsqueda...');
    modal.classList.add('hidden');
});
