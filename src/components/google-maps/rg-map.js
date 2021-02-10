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
        width: 600px;
        height: 400px;
      }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
      <h1 id="map-title"></h1>
      <div id="map"></div>
    `;
    this._mapDiv = this._root.getElementById("map");
    this._mapTitle = this._root.getElementById("map-title");
    this._root.appendChild(this._mapDiv);
    this._render();
  }
  _render() {
    // console.log("L.map", L.map);
    if (!L.map) {
      console.log("Maps are not ready");
      return;
    } else {
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
} // \ class

// New tag creation define ('tag', ClassInstance)
window.customElements.define("rg-map", RgMap);
