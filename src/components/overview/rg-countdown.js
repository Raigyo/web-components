class RgCountDown extends HTMLElement {
  constructor() {
    super();

    /* Shadow DOM elements (used to solve encapsulation
    problems by encupsulating each component instance in its own DOM and
    and so in this exemple be able to use several counters on the same page) */
    this._root = this.attachShadow({ mode: "open" });
    /* Now we can replace all 'document.' with 'this._root.' and also we have to use the root for
    CSS template */

    // DOM elements specific to the view
    this._btnStart = null;
    this._btnStop = null;
    this._currentValueParagraph = null;
    this._purposeTitle = null;

    // watched datas
    this._duration = 0;
    this._currentValue = 0;
    this._purpose = "Countdown";
    this._handle = -1;
    this._countDownRunning = false;
  }

  // Callback to create template
  connectedCallback() {
    console.log("rg-countdown connected");
    // create the view
    this._root.innerHTML = `
      <style>
          #txtCurrentValue {
              font-size: 24px;
              font-weight: bold;
          }
      </style>
      <div>
        <h2 id="purpose"></h2>
        <button id="btnStart">Start</button>
        <button id="btnStop">Stop</button>
        <span id="txtCurrentValue"></span>
      </div>
    `;

    this._btnStart = this._root.querySelector("#btnStart");
    this._btnStart.addEventListener("click", (event) => {
      console.log("click start");
      this._btnStart.innerText = "Pause";
      this._countDownRunning = !this._countDownRunning;
      if (this._countDownRunning === true) {
        this._startCountDown();
      } else {
        this._pauseCountDown();
      }
    });

    this._btnStop = this._root.querySelector("#btnStop");
    this._btnStop.addEventListener("click", (event) => {
      console.log("click stop");
      this._stopCountDown();
    });

    this._purposeTitle = this._root.querySelector("#purpose");
    // getAttribute: retrieve initial value
    this._purposeTitle.innerHTML =
      this.getAttribute("purpose") || this._purpose;

    this._currentValueParagraph = this._root.querySelector("#txtCurrentValue");
    this._currentValueParagraph.innerText = this._currentValue;
  }

  // observedAttributes: Getter for html attributes that we want to observe (returned as array)
  static get observedAttributes() {
    return ["duration", "purpose"];
  }

  /* attributeChangedCallback: Callback to observe values
   (called once by attribute each time values are changed) */
  attributeChangedCallback(name, oldValue, newValue) {
    /* prettier-ignore */
    console.log("RgCountDown attribute changed: ", name," / ", oldValue, " / ", newValue);
    if (name === "duration") {
      this._setDuration(newValue);
    }

    if (name === "purpose") {
      this._setPurpose(newValue);
    }
  }

  _setDuration(value) {
    if (value === null) return;
    this._duration = parseInt(value);
    this._currentValue = this._duration;
    if (this._currentValueParagraph) {
      this._currentValueParagraph.innerText = value;
    }
  }

  _setPurpose(value) {
    if (value === null) return;
    this._purpose = value;
    if (this._purposeTitle) {
      this._purposeTitle.innerHTML = value;
    }
  }

  _startCountDown() {
    if (this._currentValue === 0) return;
    this._handle = setInterval(() => {
      console.log("this._currentValue: ", this._currentValue);
      this._currentValue = this._currentValue - 1;
      this._currentValueParagraph.innerText = this._currentValue;
      if (this._currentValue === 0) {
        clearInterval(this._handle);
      }
    }, 1000);
  }

  _pauseCountDown() {
    this._btnStart.innerText = "Continue";
    clearInterval(this._handle);
    this._duration = this._currentValue;
  }

  _stopCountDown() {
    clearInterval(this._handle);
    this._countDownRunning = false;
    if (this.getAttribute("duration")) {
      // back to the initial value
      this._currentValue = parseInt(this.getAttribute("duration"));
    } else {
      this._currentValue = 0;
    }
    this._currentValueParagraph.innerText = this._currentValue;
    this._btnStart.innerText = "Start";
  }
} // end class
window.customElements.define("rg-countdown", RgCountDown);
