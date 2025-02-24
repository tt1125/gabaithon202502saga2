"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
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
  const [active, setActive] = useState(false);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    if (active && pathname !== "/") setActive(false);
  }, [pathname]);

  useEffect(() => {
    const fetchDirections = async () => {
      if (typeof google === "undefined" || !google.maps) return;

      const directionsService = new google.maps.DirectionsService();
      const origin: Coordinates = { lat: 35.6895, lng: 139.6917 };
      const destination: Coordinates = { lat: 35.6586, lng: 139.7454 };

      const result = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      try {
        setDirections(result);
      } catch (error) {
        console.error("Failed to set directions", error);
      }
    };
    fetchDirections();
  }, []);

  const Map = useMemo(() => {
    const MapViewer = () => (
      <main
        className="h-[calc(100vh-64px)] fixed top-0 left-0 w-full"
        style={{ zIndex: -1 }}
      >
        <LoadScript googleMapsApiKey="AIzaSyCsWEFEzwVzLk6PTAWxhc-6WZzMzFKmamI">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={18}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </LoadScript>
      </main>
    );
    MapViewer.displayName = "MapViewer";
    return MapViewer;
  }, [directions]);

  return (
    <GoogleMapContext.Provider value={{ active, setActive, directions }}>
      <Map />
      {!active && children}
    </GoogleMapContext.Provider>
  );
}
