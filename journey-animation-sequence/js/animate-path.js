import { computeCameraPosition } from "./util.js";

const animatePath = async ({
  map,
  duration,
  path,
  startBearing,
  startAltitude,
  pitch,
  prod
}) => {
  return new Promise(async (resolve) => {
    const pathDistance = turf.lineDistance(path);
    let startTime;

    const frame = async (currentTime) => {
      if (!startTime) startTime = currentTime;
      const animationPhase = (currentTime - startTime) / duration;

      // when the duration is complete, resolve the promise and stop iterating
      if (animationPhase > 1) {

        resolve();
        return;
      }

      // calculate the distance along the path based on the animationPhase
      const alongPath = turf.along(path, pathDistance * animationPhase).geometry
        .coordinates;

      const lngLat = {
        lng: alongPath[0],
        lat: alongPath[1],
      };

      // Reduce the visible length of the line by using a line-gradient to cutoff the line
      // animationPhase is a value between 0 and 1 that reprents the progress of the animation
      map.setPaintProperty(
        "line-layer",
        "line-gradient",
        [
          'step',
          ['line-progress'],
          0,
          'blue',
          animationPhase,
          'rgba(0,0,0,0)'
        ]
      );
    /*var color = 'blue';
      if (animationPhase < 0.1) {
        map.setPaintProperty(
          "line-layer",
          "line-gradient",
          [
            'step',
            ['line-progress'],
            0,
            'blue',
            animationPhase,
            'rgba(0,0,0,0)'
          ]
        );
      }
      else if (animationPhase < 0.5) {
        map.setPaintProperty(
          "line-layer",
          "line-gradient",
          [
            'step',
            ['line-progress'],
            0,
            'blue',
            0.5,
            'yellow',
            animationPhase,
            'rgba(0,0,0,0)'
          ]
        );
      }
      else if (animationPhase < 1) {
        map.setPaintProperty(
          "line-layer",
          "line-gradient",
          [
            'step',
            ['line-progress'],
            0,
            'blue',
            0.5,
            'yellow',
            1,
            'red'
          ]
        );
      }*/

      /*if (animationPhase < 0.2265) {
        map.setPaintProperty(
          "line-layer",
          "line-gradient",
          [
            "step",
            ["line-progress"],
            "yellow",
            animationPhase,
            "rgba(0,0,0,0)"
         ]
        );
      } else if (animationPhase < 0.448) {
        map.setPaintProperty(
          "line-layer",
          "line-gradient",
          [
            "step",
            ["line-progress"],
            "yellow",
            0.2265,
            "lime",
            animationPhase,
            "rgba(0,0,0,0)"
         ]
        );
      } else*/ //if (animationPhase < 0.495) {
        map.setPaintProperty(
          "line-layer",
          "line-gradient",
          [
            "step",
            ["line-progress"],
            //"yellow",
            //0.2265,
            //"lime",
            //0.448,
            "turquoise",
            animationPhase,
            "rgba(0,0,0,0)"
         ]
        );
      /*} else {
        map.setPaintProperty(
          "line-layer",
          "line-gradient",
          [
            "step",
            ["line-progress"],
            //"yellow",
            //0.2265,
            //"lime",
            //0.448,
            "yellow",
            0.495,
            "turquoise",
            animationPhase,
            "rgba(0,0,0,0)"
         ]
        );
      }*/

      /*map.setPaintProperty(
        "line-layer",
        "line-gradient",
        [
          "step",
          ["line-progress"],
          "yellow",
          0.2,
          "lime",
          0.5, 
          "red",
          0.7, //(animationPhase),
          "rgba(0, 0, 0, 0)",
          //"red"
       ]
       /*
       'line-gradient', //https://docs.mapbox.com/mapbox-gl-js/example/line-gradient/
       [
        'step',
        ['line-progress'],
        0,
        0 < animationPhase ? 'blue' : 'rgba(0,0,0,0)',
        0.5,
        0.5 < animationPhase ? 'lime' : 'rgba(0,0,0,0)',
        1,
        1 <= animationPhase ? 'red' : 'rgba(0,0,0,0)',
        "rgba(0,0,0,0)",
        ]*/
      //);

      // slowly rotate the map at a constant rate
      const bearing = startBearing - animationPhase * 50.0;
      //const bearing = startBearing;

      // compute corrected camera ground position, so that he leading edge of the path is in view
      var correctedPosition = computeCameraPosition(
        pitch,
        bearing,
        lngLat,
        startAltitude,
        true // smooth
      );

      // set the pitch and bearing of the camera
      const camera = map.getFreeCameraOptions();
      camera.setPitchBearing(pitch, bearing);

      // set the position and altitude of the camera
      camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
        correctedPosition,
        startAltitude
      );

      // apply the new camera options
      map.setFreeCameraOptions(camera);

      // repeat!
      await window.requestAnimationFrame(frame);
    };

    await window.requestAnimationFrame(frame);
  });
};

export default animatePath;
