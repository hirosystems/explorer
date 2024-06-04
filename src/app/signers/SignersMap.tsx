import { Box } from '@/ui/Box';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fixing the default icon issue
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// Fixing the default icon issue
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: '/marker-icon.svg',
//   iconUrl: '/marker-icon.svg',
//   shadowUrl: '/marker-shadow.svg',
//   iconSize: [50, 50], // Adjust icon size
//   iconAnchor: [25, 50], // Adjust icon anchor point
//   shadowSize: [50, 50], // Adjust shadow size
//   shadowAnchor: [25, 50], // Adjust shadow anchor point
// });

// const legalIcon = new Icon({
//   iconUrl,
//   iconSize: [35, 35], // size of the icon
//   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
// });
// Fixing the default icon issue
// let DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

let DefaultIcon = L.icon({
  iconUrl: '/marker-icon.svg', // Use the public URL
  shadowUrl: '/marker-shadow.svg', // Use the public URL
});

L.Marker.prototype.options.icon = DefaultIcon;

export const cryptoNodes = [
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 51.5074, lng: -0.1278 }, // London
  { lat: 48.8566, lng: 2.3522 }, // Paris
  { lat: 35.6895, lng: 139.6917 }, // Tokyo
  { lat: 40.7128, lng: -74.006 }, // New York
  { lat: 55.7558, lng: 37.6173 }, // Moscow
  // Add more nodes as needed
];
// export const cryptoNodes = [
//   [37.7749, -122.4194], // San Francisco
//   [51.5074, -0.1278], // London
//   [48.8566, 2.3522], // Paris
//   [35.6895, 139.6917], // Tokyo
//   [40.7128, -74.006], // New York
//   [55.7558, 37.6173], // Moscow
// ];

const DotOverlay = () => {
  const dotStyle = {
    background: `radial-gradient(circle, #6c63ff 1px, rgba(255,255,255,0) 1px)`,
    backgroundSize: '10px 10px',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 400,
    pointerEvents: 'none',
  };

  return <Box style={dotStyle}></Box>;
};

export const CryptoNodesMap = ({ nodes }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Fetch the GeoJSON data for country boundaries and names
    fetch('path/to/your/countries.geojson')
      .then(response => response.json())
      .then(data => setGeoJsonData(data));
  }, []);

  const onEachCountry = (country, layer) => {
    const countryName = country.properties.name;
    layer.bindTooltip(countryName, {
      permanent: true,
      direction: 'center',
      className: 'country-label',
    });
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={2}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        dragging={false}
        attributionControl={false} // Disables the default attribution control
        style={{
          height: '100%',
          width: '100%',
          // filter: 'grayscale(100%)'
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoJsonData && <GeoJSON data={geoJsonData} onEachFeature={onEachCountry} />}
        {/* <Marker position={[0, 0]} /> */}
        {nodes.map((node, index) => (
          <Marker key={index} position={[node.lat, node.lng]}>
            <Popup>{`Node ${index + 1}: ${node.lat}, ${node.lng}`}</Popup>
          </Marker>
        ))}
        {/* <DotOverlay /> */}
      </MapContainer>
      <div
        style={{
          zIndex: 1000,
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        <h3>{nodes.length} Nodes</h3>
        <ul>
          {nodes.map((node, index) => (
            <li key={index}>{`Node ${index + 1}: ${node.lat}, ${node.lng}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CryptoNodesMap;
