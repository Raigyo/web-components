// Custom element
class RgMap extends HTMLElement {
  // CONSTRUCTOR
  constructor() {
    super();
    // Shadow DOM elements
    this._root = this.attachShadow({ mode: "open" });

    // watched datas (default values")
    this._zoom = 1; // used with attribute zoom
    this._title = "Town"; // used with attribute map-title

    // DOM elements
    // this._zoomValue = null;
    this._mapTitle = null;
    this._mapDiv = null;
    this._map = null;
    // data
    this._geoData = {
      center: {
        lat: 50.6412,
        lng: 5.5718,
      },
    };
  } // \ CONSTRUCTOR

  // CALLBACKS
  connectedCallback() {
    console.log("rg-map added to DOM");

    this._root.innerHTML = `
      <style>
      #map {
        width: 600px;
        height: 400px;
      }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
      <h1 id="map-title"></h1>
      <div id="map"></div>
    `;
    this._mapDiv = this._root.querySelector("#map");
    this._mapTitle = this._root.querySelector("#map-title");
    this._mapTitle.innerHTML = this.getAttribute("map-title") || this._title;
    this._zoom = this.getAttribute("zoom") || this._zoom;
    this._root.appendChild(this._mapDiv);
    this._render();
  }
  _render() {
    // console.log("L.map", L.map);
    if (!L.map) {
      console.log("Maps are not ready");
      return;
    } else {
      console.log("var this._zoom: ", this._zoom);
      this._map = L.map(this._mapDiv).setView(
        [this._geoData.center.lat, this._geoData.center.lng],
        this._zoom
      );
      // URL below is for 'mapbox'. It works for all countries but it's a private service.
      // It can be replaced by open products:
      // Belgium: https://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png
      // France: https://tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png
      // In this case no "accessToken" is required
      // WARNING: lat and lng have to be in the scope of countries maps otherwise
      // server will send 404 error
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken:
            "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
        }
      ).addTo(this._map);
    }
  } // \ connectedCallback()

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("name: ", name, "oldValue: ", oldValue, "newValue: ", newValue);
    if (this._mapDiv === null) return;
    if (name === "zoom") {
      console.log("Call set zoom");
      this._setZoom(newValue);
    }
    if (name === "map-title") {
      this._setTitle(newValue);
    }
  } // \ attributeChangedCallback()

  // \ CALLBACKS

  // GETTERS / OBSERVERS (used with attributeChangedCallback())
  static get observedAttributes() {
    return ["zoom", "map-title"];
  }
  // \ GETTERS / OBSERVERS

  // SETTERS (used with attributeChangedCallback())
  _setZoom(value) {
    if (value === null) return;
    this._zoom = parseInt(value);
    console.log("new var this._zoom: ", this._zoom);
    this._map.remove(); // we remove the map to avoid error "map already rendered"
    this._render(); // and we rerender it again
  }

  _setTitle(value) {
    console.log("SetTitle");
    if (value === null) return;
    this._title = value;
    if (this._mapTitle) {
      this._mapTitle.innerHTML = value;
    }
  }
  // \ SETTERS
} // \ class

// New tag creation define ('tag', ClassInstance)
window.customElements.define("rg-map-os", RgMap);
