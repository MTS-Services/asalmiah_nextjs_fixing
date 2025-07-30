"use client";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toastAlert } from "./SweetAlert";
import { countryCode } from "./CountryCode";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapComponent = ({
  onLocationSelect,
  onClose,
  selectedLocation,
  values,
  setFieldValue,
  showMap,
}) => {
  const [markerPosition, setMarkerPosition] = useState(
    selectedLocation || {
      lat: 29.3759, // Latitude for Kuwait City
      lng: 47.9774, // Longitude for Kuwait City
    }
  );

  const searchBoxRef = useRef(null);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [searchValue, setSearchValue] = useState(values.area || ""); // Initialize with existing area value

  const handlePlaceSelect = (place) => {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const addressComponents = place.address_components;

    // Check if the selected place's country is in the allowed countryCode array
    const country = addressComponents.find((component) =>
      component.types.includes("country")
    );
    if (country && countryCode.some((c) => c.country === country.long_name)) {
      setMarkerPosition({ lat, lng });
      setFieldValue("area", place?.formatted_address);
      setFieldValue("latitude", lat);
      setFieldValue("longitude", lng);
      setIsLocationSelected(true);
      setSearchValue(place?.formatted_address); // Update search value
      onLocationSelect(place);
    } else {
      toastAlert(
        "error",
        "Select from allowed countries: Jordan, Kuwait, United Arab Emirates."
      );
    }
  };

  const handleConfirm = () => {
    if (isLocationSelected) {
      onClose(); // Close modal only if a location is selected
    } else {
      // toastAlert("error", "Please select a location before confirming.");
      toastAlert(
        "error",
        "Select from allowed countries: Jordan, Kuwait, United Arab Emirates."
      );
    }
  };

  return (
    <>
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={() => {
          const places = searchBoxRef.current.getPlaces();
          if (places.length > 0) {
            handlePlaceSelect(places[0]);
          }
        }}
      >
        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder="Search for a place"
            value={searchValue} // Bind the search input value
            onChange={(e) => {
              setSearchValue(e.target.value); // Update local search value
            }}
          />
        </Form.Group>
      </StandaloneSearchBox>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={10}
      >
        <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={(e) => {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            setMarkerPosition({ lat: newLat, lng: newLng });

            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: newLat, lng: newLng } },
              (results, status) => {
                if (status === "OK" && results[0]) {
                  const addressComponents = results[0]?.address_components;
                  const country = addressComponents?.find((component) =>
                    component.types.includes("country")
                  );
                  if (
                    country &&
                    countryCode?.some((c) => c?.country === country?.long_name)
                  ) {
                    setFieldValue("area", results[0]?.formatted_address);
                    setFieldValue(
                      "latitude",
                      results[0]?.geometry?.location?.lat()
                    );
                    setFieldValue(
                      "longitude",
                      results[0]?.geometry?.location?.lng()
                    );
                    setIsLocationSelected(true);
                    setSearchValue(results[0]?.formatted_address); // Update search value on drag
                  } else {
                    toastAlert(
                      "error",
                      "Selected location is not in the allowed countries."
                    );
                  }
                }
              }
            );
          }}
        />
      </GoogleMap>
      <Button onClick={handleConfirm} className="mt-2 btn btn_theme">
        Confirm
      </Button>
    </>
  );
};

export default MapComponent;
