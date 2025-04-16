const buscarBtn = document.getElementById('buscarBtn') as HTMLButtonElement;
const modal = document.getElementById('modal') as HTMLDivElement;
const confirmYes = document.getElementById('confirmYes') as HTMLButtonElement;
const confirmNo = document.getElementById('confirmNo') as HTMLButtonElement;

buscarBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

confirmNo.addEventListener('click', () => {
  modal.classList.add('hidden');
});

confirmYes.addEventListener('click', () => {
  // Puedes redirigir, reiniciar, o hacer otra lógica aquí.
  alert('Redirigiendo a la búsqueda...');
  modal.classList.add('hidden');
});