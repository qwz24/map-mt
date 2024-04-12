import React, { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import ButtonPoint from "./ButtonPoint";

const Point = ({ mapRef, coordinatesRef, points, setPoints }) => {
  const [isPointVisible, setPointVisibility] = useState(true);
  const [buttonText, setButtonText] = useState("Скрыть точки");

  useEffect(() => {
    const addPoint = () => {
      if (!mapRef.current) return;
      const index = points.length;
      const center = mapRef.current.getCenter();

      const sourceId = `point${index}`;
      const layerId = `point${index}`;

      if (mapRef.current.getSource(sourceId)) {
        mapRef.current.removeLayer(layerId);
        mapRef.current.removeSource(sourceId);
      }

      const geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [center.lng, center.lat],
            },
            properties: {
              time: new Date().toLocaleString(),
            },
          },
        ],
      };

      mapRef.current.addSource(sourceId, {
        type: "geojson",
        data: geojson,
      });

      mapRef.current.addLayer({
        id: layerId,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": 10,
          "circle-color": "#000000",
        },
      });

      const onMove = (e) => {
        const coords = e.lngLat;
        if (mapRef.current.getSource(sourceId)) {
          geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
          mapRef.current.getSource(sourceId).setData(geojson);
        }
      };

      const onUp = (e) => {
        const coords = e.lngLat;
        coordinatesRef.current.style.display = "block";
        coordinatesRef.current.innerHTML = `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;
        mapRef.current.off("mousemove", onMove);
        mapRef.current.off("touchmove", onMove);
        mapRef.current.off("mouseup", onUp);
        mapRef.current.off("touchend", onUp);

        if (points[index]) {
          const updatedPoints = [...points];
          updatedPoints[index] = [coords.lng, coords.lat];
          setPoints(updatedPoints);
        } else {
          setPoints((prevPoints) => [...prevPoints, [coords.lng, coords.lat]]);
        }

        console.log("All Coordinates:", points);

        mapRef.current.off("mousedown", layerId);
        mapRef.current.off("touchstart", layerId);
      };

      mapRef.current.on("mousedown", layerId, (e) => {
        e.preventDefault();
        mapRef.current.on("mousemove", onMove);
        mapRef.current.once("mouseup", onUp);
      });

      mapRef.current.on("touchstart", layerId, (e) => {
        if (e.points.length !== 1) return;
        mapRef.current.on("touchmove", onMove);
        mapRef.current.once("touchend", onUp);
      });

      mapRef.current.on("click", layerId, (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description =
          (coordinatesRef.current.innerHTML = `Date created: ${new Date().toLocaleDateString()}<br />`);

        new maplibregl.Popup({ offset: 25 })
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(mapRef.current);
      });
    };

    const deletePoint = () => {
      points.forEach((point, index) => {
        const sourceId = `point${index}`;
        const layerId = `point${index}`;

        if (mapRef.current.getLayer(layerId)) {
          mapRef.current.removeLayer(layerId);
        }

        if (mapRef.current.getSource(sourceId)) {
          mapRef.current.removeSource(sourceId);
        }
      });
      setPoints([]);
    };

    const togglePointVisibility = () => {
      const newVisibility = isPointVisible ? "none" : "visible";

      mapRef.current.getStyle().layers.forEach((layer) => {
        if (layer.type === "circle" && layer.id.startsWith("point")) {
          mapRef.current.setLayoutProperty(
            layer.id,
            "visibility",
            newVisibility
          );
        }
      });

      setPointVisibility(!isPointVisible);
      setButtonText(isPointVisible ? "Показать точки" : "Скрыть точки");
    };

    const addPointButton = document.getElementById("addPointButton");
    addPointButton.addEventListener("click", addPoint);

    const deletePointButton = document.getElementById("deletePointButton");
    deletePointButton.addEventListener("click", deletePoint);

    const togglePointVisibilityButton = document.getElementById(
      "togglePointVisibilityButton"
    );
    togglePointVisibilityButton.addEventListener(
      "click",
      togglePointVisibility
    );

    return () => {
      addPointButton.removeEventListener("click", addPoint);
      deletePointButton.removeEventListener("click", deletePoint);
      togglePointVisibilityButton.removeEventListener(
        "click",
        togglePointVisibility
      );
    };
  }, [mapRef, coordinatesRef, points, isPointVisible]);

  return <ButtonPoint buttonText={buttonText} />;
};

export default Point;
