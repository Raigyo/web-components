class RgCountDown extends HTMLElement {
  constructor() {
    super();

    // DOM elements
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
    this.innerHTML = `
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

    this._btnStart = document.querySelector("#btnStart");
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

    this._btnStop = document.querySelector("#btnStop");
    this._btnStop.addEventListener("click", (event) => {
      console.log("click stop");
      this._stopCountDown();
    });

    this._purposeTitle = document.querySelector("#purpose");
    this._purposeTitle.innerHTML =
      this.getAttribute("purpose") || this._purpose;

    this._currentValueParagraph = document.querySelector("#txtCurrentValue");
    this._currentValueParagraph.innerText = this._currentValue;
  }

  // Getter for html attributes that we want to observe
  static get observedAttributes() {
    return ["duration", "purpose"];
  }

  // Callback to observe values (called once by attribute each time values are changed)
  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(
    //   "RgCountDown attribute changed: ",
    //   name,
    //   " / ",
    //   oldValue,
    //   " / ",
    //   newValue
    // );
    if (name === "duration") {
      this._duration = parseInt(newValue);
      this._currentValue = this._duration;
      if (this._currentValueParagraph) {
        this._currentValueParagraph.innerText = newValue;
      }
    }

    if (name === "purpose") {
      // this._setPurpose(newValue);
      this._purpose = newValue;
      if (this._purposeTitle) {
        this._purposeTitle.innerHTML = newValue;
      }
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
