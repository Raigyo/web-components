// Inheritances between components

// Custom element
class RgVehicle extends HTMLElement {
  constructor() {
    super();
    console.log('rg-vehicle ctor');
  }
  start() {
    console.log('starting');
  }
  stop() {
    console.log('stop');
  }
} // \ class
// New tag creation define ('tag', ClassInstance)
window.customElements.define('rg-vehicle', RgVehicle);

class RgPlane extends RgVehicle {
  contactTower() {
    console.log('allo... Here the plane...');
  }
}// \ class
// New tag creation define ('tag', ClassInstance)
window.customElements.define('rg-plane', RgPlane);