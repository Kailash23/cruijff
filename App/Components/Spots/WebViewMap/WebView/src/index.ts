import './test.css';
import {
  LatLngExpression,
  Icon,
  Point,
  Map,
  TileLayer,
  FeatureGroup,
  Layer,
  Marker,
  LayerGroup, latLng,
} from 'leaflet';
import 'leaflet/dist/leaflet.css';

type PostMessage = (message: any) => void;

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage?: PostMessage;
    };
    mapView: MapView;
  }
}

const postMessage = (message: any) => {
  if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  } else {
    (window as any).postMessage(JSON.stringify(message));
  }
};

const defaultIcon = new Icon({
  // iconUrl: 'https://image.flaticon.com/icons/png/512/37/37134.png',
  iconUrl: 'https://rawcdn.githack.com/SportySpots/cruijff/4a3b1a0fe4c7c856c001bd0bd6ccf0a5eee36895/App/Components/Spots/WebViewMap/marker.svg',
  iconSize: new Point(20, 20),
});

const selectedIcon = new Icon({
  iconUrl: 'https://rawcdn.githack.com/SportySpots/cruijff/4a3b1a0fe4c7c856c001bd0bd6ccf0a5eee36895/App/Components/Spots/WebViewMap/marker.svg',
  // iconUrl: 'https://rawcdn.githack.com/google/material-design-icons/224895a86501195e7a7ff3dde18e39f00b8e3d5a/communication/svg/production/ic_location_on_48px.svg',
  iconSize: new Point(30, 30),
});

const tilemapURL = 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png';

interface ICoords {
  lat: number;
  lng: number;
}

interface IMarkerData {
  coords: ICoords;
  uuid: string;
}

class IDMarker extends Marker {
  public id: string;
  constructor(coords: ICoords, id: string) {
    const options = {
      icon: defaultIcon,
    };
    super([coords.lat, coords.lng], options);
    this.id = id;
  }
}

class MapView {
  public map: Map;
  public tileLayer: TileLayer;
  public markersLayerGroup: LayerGroup;

  constructor() {
    this.map = new Map('leaflet-root', {
      minZoom: 5,
      maxZoom: 18,
    }).setView([52.370216, 4.895168], 13)
      .on('moveend', (e) => {
        this.sendMoveMessage();
      });
    this.tileLayer = new TileLayer(tilemapURL, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 18,
    })
      .addTo(this.map);
    this.markersLayerGroup = new FeatureGroup().addTo(this.map);
  }

  public sendMoveMessage() {
    const center = this.map.getCenter();
    const bounds = this.map.getBounds();
    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();
    const maxDistance = this.map.distance(center, nw);
    postMessage({type: 'moved', center, nw, se, maxDistance, zoom: this.map.getZoom()});
  }

  public onMarkerClick(marker: IDMarker) {
    try {
      this.markersLayerGroup.eachLayer((marker: any) => marker.setIcon(defaultIcon));
      marker.setIcon(selectedIcon);
      // this.map.panTo(marker.getLatLng());
      postMessage({type: 'markerClick', id: marker.id});
    } catch (e) {
      console.log(e);
    }
  }

  public setMarkers(newMarkers: IMarkerData[]) {
    const newIDS = newMarkers.map(marker => marker.uuid);
    const currentMarkers = this.markersLayerGroup.getLayers() as IDMarker[];
    const currentMarkerIDS = currentMarkers.map(marker => marker.id);

    // remove markers not in the new set
    currentMarkers.forEach(marker => {
      if (newIDS.indexOf(marker.id) === -1) {
        this.markersLayerGroup.removeLayer(marker);
      }
    });

    // add new markers
    newMarkers.forEach(marker => {
      if (currentMarkerIDS.indexOf(marker.uuid) === -1) {
        this.addMarker(marker.coords, marker.uuid);
      }
    });

    // this.markersLayerGroup.eachLayer((marker: any) => marker.setIcon(defaultIcon));
  }

  public addMarker(coords: ICoords, id: string) {
    const newMarker = new IDMarker(coords, id);
    newMarker.on('click', (e) => { this.onMarkerClick(e.target); });
    newMarker.addTo(this.markersLayerGroup);
  }

  public clearMarkers() {
    this.markersLayerGroup.clearLayers();
  }
}

window.mapView = new MapView();
