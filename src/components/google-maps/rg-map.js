// Custom element
class RgMap extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM elements
    this._root = this.attachShadow({ mode: "open" });

    // DOM elements
    this._mapTitle = null;
    this._mapTitleText = "";

    // data
    this._zoom = 12;
    this._geoData = {
      center: {
        lat: 50.6412,
        lng: 5.5718,
      },
      title: "Liège",
      zoom: this._zoom,
    };
    this._mapDiv = null;
    this._map = null;
  }
  connectedCallback() {
    console.log("rg-map added to DOM");

    this._root.innerHTML = `
      <style>
      #map {
          height: 400px;
          width: 100%;
      }
      </style>
      <h1 id="map-title"></h1>
      <div id="map"></div>
    `;
    this._mapDiv = this._root.getElementById("map");
    this._mapTitle = this._root.getElementById("map-title");
    this._map = new window.google.maps.Map(this._mapDiv, {
      zoom: this._geoData.zoom,
      center: this._geoData.center,
    });
    console.log(this._map);
  }
} // \ class

// New tag creation define ('tag', ClassInstance)
window.customElements.define("rg-map", RgMap);
