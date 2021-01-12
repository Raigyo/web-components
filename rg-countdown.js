// Custom element
class CountDown extends HTMLElement {
  constructor() {
    super();
    // data
    this._duration = 0;
    this._purpose = 'Countdown';
  }

  // return an array containing the names of the attributes you want to observe
  static get observedAttributes() {
    return ['duration', 'purpose'];çà
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attribute changed:', name, oldValue, newValue);
    if (name === 'duration') {
      this._setDuration(newValue);
    }

    if (name === 'purpose') {
        this._setPurpose(newValue);
    }
  }

} // \ class

// New tag creation define ('tag', ClassInstance)
window.customElements.define('rg-countdown', CountDown);