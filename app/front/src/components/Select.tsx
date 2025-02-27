import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { BsPersonWalking } from "react-icons/bs";
import { useAuthContext } from "@/context/AuthContext";
import { GoogleMap } from "@react-google-maps/api";

export default function Select() {
  const { login } = useAuthContext();

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        zIndex: -1,
      }}
    >
      {/* <GoogleMap
        onLoad={handleMapLoad}
        mapContainerStyle={containerStyle}
        center={mapCenter} // 現在地を中心に設定
        zoom={18}
        options={{
          mapTypeControl: false,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      /> */}
    </div>
  );
}
