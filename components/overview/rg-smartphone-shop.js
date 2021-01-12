// HTML templates
class RgSmartphoneShop extends HTMLElement {
  constructor() {
    super();
      // Shadow DOM elements
      this._root = this.attachShadow({ mode: 'open' });

      // data
      // '_' = private by convention
      this._smartphones = [
        {
          id: 1,
          brand: 'Samsung',
          model: 'Galaxy S7 Edge',
          description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure eligendi vel nulla obcaecati modi id voluptates itaque, nesciunt deleniti ipsa omnis, molestias sunt atque a molestiae dolore tempora maiores minus.'
        },
        {
          id: 2,
          brand: 'Honor',
          model: '9 (blue)',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam nemo laudantium sint perspiciatis minima illo, numquam voluptates est quia tempore recusandae enim saepe quo possimus vitae illum, repudiandae dicta dignissimos!'
        }
      ];
  }
  connectedCallback() {
    this._root.innerHTML = `
      <style>
          .frame {
              border: 2px dotted grey;
              margin-bottom: 10px;
              padding-left: 10px;
          }
          h1, h2 {
              color: green;
          }
      </style>
      <template id="smartphone-template">
        <div class="frame">
          <h2 id="brand"></h2>
          <p id="model"></p>
          <p id="description"></p>
        </div>
      </template>
      <div id="result"></div>
    `;

    this._templateContent = this._root.querySelector('#smartphone-template').content;
    this._result = this._root.querySelector('#result');
    this._smartphones.map(smartphone => { // iterate each item from object _smartphones
      // clone template including childrens (deep cloning)
      const clone = document.importNode(this._templateContent, true);
      // update the DOM with current smartphone data
      clone.querySelector('#brand').innerHTML = smartphone.brand;
      clone.querySelector('#model').innerHTML = smartphone.model;
      clone.querySelector('#description').innerHTML = smartphone.description;
      // add to the DOM
      this._result.appendChild(clone); // = #result
    });
  }
} // \ class

// New tag creation define ('tag', ClassInstance)
window.customElements.define('rg-smartphone-shop', RgSmartphoneShop);