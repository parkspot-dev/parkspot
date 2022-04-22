const addMapboxScript = () => {
  const element = document.querySelectorAll("script");
  for (var i = 0; i < element.length; i++) {
    if (
      element[i].src ===
      "https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js"
    ) {
      return;
    }
  }
  let mapboxScript = document.createElement("script");
  mapboxScript.setAttribute(
    "src",
    "https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js"
  );
  document.head.appendChild(mapboxScript);
};

export default {
  addMapboxScript,
};
