import React, { useEffect, useState } from "react";
import ButtonLine from "./ButtonLine";

const Line = ({ mapRef, points }) => {
  const [buttonText, setButtonText] = useState("Скрыть линию");

  useEffect(() => {
    const addLine = () => {
      console.log("добавить линию");
      if (!mapRef.current) return;

      const lineCoordinates = points;
      console.log("coordinates", lineCoordinates);

      const geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              properties: {},
              coordinates: [...lineCoordinates],
            },
          },
        ],
      };

      if (mapRef.current.getLayer("line")) {
        mapRef.current.removeLayer("line");
      }

      if (mapRef.current.getSource("line")) {
        mapRef.current.removeSource("line");
      }

      mapRef.current.addSource("line", {
        type: "geojson",
        data: geojson,
      });

      mapRef.current.addLayer({
        id: "line",
        type: "line",
        source: "line",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#000000",
          "line-width": 2,
        },
      });
    };

    const deleteLine = () => {
      if (mapRef.current.getLayer("line")) {
        mapRef.current.removeLayer("line");
      }

      if (mapRef.current.getSource("line")) {
        mapRef.current.removeSource("line");
      }

      setButtonText("Показать линию");
    };

    const toggleLineVisibility = () => {
      const lineLayer = mapRef.current.getLayer("line");
      const lineSource = mapRef.current.getSource("line");

      if (lineLayer && lineSource) {
        const newVisibility =
          lineLayer.visibility === "visible" ? "none" : "visible";
        mapRef.current.setLayoutProperty("line", "visibility", newVisibility);
        setButtonText(
          newVisibility === "visible" ? "Скрыть линию" : "Показать линию"
        );
      }
    };

    const addLineButton = document.getElementById("addLineButton");
    addLineButton.addEventListener("click", addLine);

    const deleteLineButton = document.getElementById("deleteLineButton");
    deleteLineButton.addEventListener("click", deleteLine);

    const hiddenLineButton = document.getElementById("hiddenLineButton");
    hiddenLineButton.addEventListener("click", toggleLineVisibility);

    return () => {
      addLineButton.removeEventListener("click", addLine);
      deleteLineButton.removeEventListener("click", deleteLine);
      hiddenLineButton.removeEventListener("click", toggleLineVisibility);
    };
  }, [mapRef, points]);

  return <ButtonLine buttonText={buttonText} />;
};

export default Line;
