const menuLogo = document.querySelector('.logo-menu');
const menu = document.querySelector('.menu-mobile');

function ativarMenu(event) {
  event.preventDefault();
  menu.classList.toggle('menu-ativo');
  menuLogo.classList.toggle('logo-ativa');
}

menuLogo.addEventListener('click', ativarMenu);
