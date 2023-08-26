import mapboxgl from "mapbox-gl";
import * as mapboxClient from "mapbox";
import { state } from "../../client/state";
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
export async function mapAlgolia() {
  const clientMapbox = await new mapboxClient(MAPBOX_TOKEN);

  mapboxgl.accessToken = MAPBOX_TOKEN;
  const map = await new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-64.2685721, -36.2685721],
    zoom: 3.5,
    attributionControl: false,
  });

  const searchButton = await document.querySelector(".ubic__search-button");
  searchButton.addEventListener("click", () => {
    const ubic = document.getElementById("ubicacion");
    const ubicValue = (ubic as any).value;
    clientMapbox.geocodeForward(
      ubicValue,
      {
        country: "ar",
        autocomplete: true,
        language: "es",
      },
      function (err, data, res) {
        const firstResult = data.features[0];
        const [lng, lat] = firstResult.geometry.coordinates;
        map.setCenter(firstResult.geometry.coordinates);
        map.setZoom(14);
        const currentState = state.getState();
        currentState.pet.petLat = lat;
        currentState.pet.petLng = lng;
        state.setState(currentState);
      }
    );
  });
}
