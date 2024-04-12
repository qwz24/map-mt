import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import Point from "./Point";
import Line from "./Line";

const Map = () => {
  const coordinatesRef = useRef(null);
  const mapRef = useRef(null);
  const [points, setPoints] = useState([]);
  console.log(points);
  const [isLineVisible, setLineVisibility] = useState(true);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
      center: [0, 0],
      zoom: 2,
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>

      <pre
        id="coordinates"
        ref={coordinatesRef}
        style={{
          display: "none",
          position: "absolute",
          bottom: "40px",
          left: "10px",
          background: "rgba(0, 0, 0, 0.0)",
          color: "#fff",
          padding: "5px 10px",
          margin: 0,
          fontSize: "11px",
          lineHeight: "18px",
          borderRadius: "3px",
        }}
      ></pre>
      <Point
        setPoints={setPoints}
        points={points}
        mapRef={mapRef}
        coordinatesRef={coordinatesRef}
      />
      <Line
        setPoints={setPoints}
        mapRef={mapRef}
        points={points}
        isLineVisible={isLineVisible}
        setLineVisibility={setLineVisibility}
      />
    </div>
  );
};

export default Map;
