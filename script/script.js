function scrollSuave() {
  const linksInternos = document.querySelectorAll("a[href^='#']");

  function scrollToSection(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const section = document.querySelector(href);
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  linksInternos.forEach((link) => {
    link.addEventListener('click', scrollToSection);
  });
}

scrollSuave();

const typedTextSpan = document.querySelector('.typed-text');
const cursorSpan = document.querySelector('.cursor');

const textArray = ['<ERINALDO JUNIOR/>'];
const typingDelay = 100;
const erasingDelay = 100;
const newTextDelay = 1000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if (!cursorSpan.classList.contains('typing'))
      cursorSpan.classList.add('typing');
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    cursorSpan.classList.remove('typing');
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if (!cursorSpan.classList.contains('typing'))
      cursorSpan.classList.add('typing');
    typedTextSpan.textContent = textArray[textArrayIndex].substring(
      0,
      charIndex - 1,
    );
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    cursorSpan.classList.remove('typing');
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // On DOM Load initiate the effect
  if (textArray.length) setTimeout(type, newTextDelay + 250);
});

//////////////////////////////////////////////////////////

class Slide {
  constructor(slide, container) {
    this.slide = document.querySelector(slide);
    this.container = document.querySelector(container);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = 'slide-ativo';
    this.changeEvent = new Event('changeEvent');
  }

  transition(active) {
    this.slide.style.transition = active ? '.3s' : '';
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0`;
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.5;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    let moveType;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      moveType = 'mousemove';
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = 'touchmove';
    }
    this.container.addEventListener(moveType, this.onMove);
    this.transition(false);
  }

  onMove(event) {
    const pointerPosition =
      event.type === 'mousemove'
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const moveType = event.type === 'mouseup' ? 'mousemove' : 'touchmove';
    this.container.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    //// 1 função
    this.container.addEventListener('mousedown', this.onStart);
    this.container.addEventListener('touchstart', this.onStart);
    this.container.addEventListener('mouseup', this.onEnd);
    this.container.addEventListener('touchend', this.onEnd);
  }

  ///// slides config

  slidePosition(slide) {
    const margin = (this.container.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
    this.container.dispatchEvent(this.changeEvent);
  }

  changeActiveClass() {
    this.slideArray.forEach((item) =>
      item.element.classList.remove(this.activeClass),
    );
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 200);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = this.onResize.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }

  addArrow() {
    this.prevElement = document.querySelector('#prev');
    this.nextElement = document.querySelector('#next');
    this.addArrowEvent();
  }
  addArrowEvent() {
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }

  createControl() {
    const control = document.createElement('ul');
    control.dataset.control = 'slide';

    this.slideArray.forEach((item, index) => {
      control.innerHTML += `<li><a href ="#slide${index + 1}">${
        index + 1
      }</a></li>`;
    });

    const containerSlide = document.querySelector('.arrow-nav');
    containerSlide.appendChild(control);
    return control;
  }

  eventControl(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlide(index);
      this.activeControlItem();
    });
    this.container.addEventListener('changeEvent', this.activeControlItem);
  }

  addControl(customControl) {
    this.control =
      document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];
    this.controlArray.forEach(this.eventControl);
    this.activeControlItem();
  }

  activeControlItem() {
    this.controlArray.forEach((item) => item.classList.remove('active'));
    this.controlArray[this.index.active].classList.add('active');
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    this.changeSlide(1);
    this.addArrow();
    this.addControl('.custom-control');
    return this;
  }
}

const slide = new Slide('.slide', '.container-slide');
slide.init();

///////////////////////////////////////////////////////////////////////////

const menuLogo = document.querySelector('.logo-menu');
const menu = document.querySelector('.menu-mobile');

function ativarMenu(event) {
  event.preventDefault();
  menu.classList.toggle('menu-ativo');
}

menuLogo.addEventListener('click', ativarMenu);
