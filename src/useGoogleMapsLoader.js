import { useJsApiLoader } from "@react-google-maps/api";

const googleMapsApiOptions = {
  googleMapsApiKey: "AIzaSyBTjWye2ChHTGsKhaVl9pkNFszW_MDGQnM", // Replace with your API key
  libraries: ["drawing", "places"],
};

const useGoogleMapsLoader = () => {
  return useJsApiLoader(googleMapsApiOptions);
};

export default useGoogleMapsLoader;
