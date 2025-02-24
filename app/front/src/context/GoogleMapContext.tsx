"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  useJsApiLoader,
  DirectionsService,
  LoadScriptNext,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 35.6895, // 東京
  lng: 139.6917,
};

type Coordinates = {
  lat: number;
  lng: number;
};
import { createContext, useContext, ReactNode } from "react";

type GoogleMapContextType = {
  active: boolean;
  setActive: (active: boolean) => void;
  directions: google.maps.DirectionsResult | null;
};

const GoogleMapContext = createContext<GoogleMapContextType>({
  active: false,
  setActive: () => {},
  directions: null,
});

export function useGoogleMapContext() {
  return useContext(GoogleMapContext);
}

export function GoogleMapProvider({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState<string>("東京駅");
  const [destination, setDestination] = useState<string>("渋谷駅");
  const [active, setActive] = useState(false);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCsWEFEzwVzLk6PTAWxhc-6WZzMzFKmamI",
    language: "ja",
  });
  const pathname = usePathname();

  const directionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === "OK" && result) {
        // Check if the new directions are different from the current ones
        if (
          !directions ||
          JSON.stringify(directions) !== JSON.stringify(result)
        ) {
          setDirections(result);
        }
      } else {
        console.error("Directions request failed", status);
      }
    },
    [directions] // Add directions to the dependency array
  );

  useEffect(() => {
    if (active && pathname !== "/") setActive(false);
  }, [pathname]);

  const Map = useMemo(() => {
    const MapViewer = () => (
      <main
        className="h-[calc(100vh-64px)] fixed top-0 left-0 w-full"
        style={{ zIndex: -1 }}
      >
        {origin && destination && isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={18}
          >
            <DirectionsService
              options={{
                destination,
                origin,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={directionsCallback}
            />
            {directions && (
              <DirectionsRenderer
                options={{
                  directions,
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        )}
      </main>
    );

    MapViewer.displayName = "MapViewer";
    return MapViewer;
  }, [directions, isLoaded]);

  useEffect(() => {
    console.log("directions", directions);
  }, [directions]);

  return (
    <GoogleMapContext.Provider value={{ active, setActive, directions }}>
      <Map />
      {!active && children}
    </GoogleMapContext.Provider>
  );
}
