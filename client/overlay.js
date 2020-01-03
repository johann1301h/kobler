class Overlay {
  constructor() {
    this.overlayNode = document.querySelector('#overlay');
  }

  showOverlay() {
    this.overlayNode.style.display = 'block';
  }

  hideOverlay() {
    this.overlayNode.style.display = 'none';
  }

  addClickListener(func) {
    this.overlayNode.addEventListener('click', func);
  }

}

export default Overlay;
