// Custom element
class RgBike extends HTMLElement {
  constructor() {
    super();
    console.log('rg-bike ctor')
  }
  connectedCallback() {
    console.log('rg-bike added to DOM');
  }
  start() {
    console.log('vroom');
  }
} // \ class

// New tag creation define ('tag', ClassInstance)
window.customElements.define('rg-bike', RgBike);