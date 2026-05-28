const toggle = document.querySelector('.menu-toggle');
const menu   = document.querySelector('#menu-principal');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const abierto = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!abierto));
    menu.classList.toggle('abierto');
  });


  menu.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('abierto');
    });
  });


  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('abierto')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('abierto');
      toggle.focus();
    }
  });
}