import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { BsPersonWalking } from "react-icons/bs";
import { useAuthContext } from "@/context/AuthContext";
import { GoogleMap } from "@react-google-maps/api";

type SelectProps = {
  suggestedRoutes: SuggestedRoutes;
};

export default function Select({ suggestedRoutes }: SelectProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        zIndex: -1,
      }}
    >
      <GoogleMap
        zoom={18}
        options={{
          mapTypeControl: false,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      />
    </div>
  );
}
