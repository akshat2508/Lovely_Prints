import { MapContainer, TileLayer } from "react-leaflet";

const LiveMap = () => {
  return (
    <MapContainer
      center={[28.6139, 77.2090]} // temporary center (Delhi example)
      zoom={15}
      scrollWheelZoom={false}
      style={{
        height: "240px",
        width: "100%",
        borderRadius: "18px",
      }}
    >
      <TileLayer
  url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
/>

    </MapContainer>
  );
};

export default LiveMap;
