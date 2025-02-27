"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useGoogleMapContext } from "@/context/GoogleMapContext";

/** =====================
 *  型定義
 *  ===================== */
type Point = {
  lat: number;
  lng: number;
  name: string;
};

type SuggestedRoutes = {
  easy: {
    point1: Point;
    point2: Point;
    point3: Point;
  };
  normal: {
    point1: Point;
    point2: Point;
    point3: Point;
  };
  hard: {
    point1: Point;
    point2: Point;
    point3: Point;
  };
};

type Props = {
  suggestedRoutes: SuggestedRoutes;
  storedProgress: (progress: number) => void;
};

type RouteType = "easy" | "normal" | "hard";

/** =====================
 *  コンポーネント
 *  ===================== */
export default function MultiRoutesMap({
  suggestedRoutes,
  storedProgress,
}: Props) {
  //
  // 1) Google Maps API 読み込み
  //
  const { isLoaded } = useGoogleMapContext();

  //
  // 2) ルート選択
  //
  const [selectedEase, setSelectedEase] = useState<RouteType>("easy");

  //
  // 3) 現在地 (origin) を state で管理し、localStorage と同期
  //
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(
    null
  );

  //
  // 4) 地図関連
  //
  const mapRef = useRef<google.maps.Map | null>(null);

  const routeBlueRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const routeGreenRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const routeYellowRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const routeRedRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const markerRefs = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  // 地図中央
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  //
  // =====================
  // マウント時: localStorage から origin を読む
  // =====================
  useEffect(() => {
    const stored = localStorage.getItem("userPosition");
    if (stored) {
      const parsed = JSON.parse(stored);
      setOrigin(parsed); // state更新
      setMapCenter(parsed);
    }
  }, []);

  //
  // =====================
  // isLoaded, origin が変化した時: origin が無いなら Geolocation で取得
  // =====================
  useEffect(() => {
    if (!isLoaded) return; // Maps API がまだなら何もしない
    if (origin) return; // origin が既にあるなら再取得しない

    // Geolocation で現在地取得
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        // state更新
        setOrigin(newPos);
        setMapCenter(newPos);
        // localStorage にも保存
        localStorage.setItem("userPosition", JSON.stringify(newPos));
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true }
    );
  }, [isLoaded, origin]);

  //
  // =====================
  // 地図生成時
  // =====================
  function handleMapLoad(map: google.maps.Map) {
    mapRef.current = map;

    // DirectionsRenderer の初期化
    routeBlueRef.current = new google.maps.DirectionsRenderer({
      preserveViewport: true,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#4285F4", strokeWeight: 5 },
    });
    routeGreenRef.current = new google.maps.DirectionsRenderer({
      preserveViewport: true,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#34A853", strokeWeight: 5 },
    });
    routeYellowRef.current = new google.maps.DirectionsRenderer({
      preserveViewport: true,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#FBBC05", strokeWeight: 5 },
    });
    routeRedRef.current = new google.maps.DirectionsRenderer({
      preserveViewport: true,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#DB4437", strokeWeight: 5 },
    });

    routeBlueRef.current.setMap(map);
    routeGreenRef.current.setMap(map);
    routeYellowRef.current.setMap(map);
    routeRedRef.current.setMap(map);

    // origin が既にあればルート計算
    if (origin) {
      calculateAllRoutes(selectedEase, origin);
    }
  }

  //
  // =====================
  // ルート計算
  // =====================
  function calculateAllRoutes(
    routeKey: RouteType,
    originPos: { lat: number; lng: number }
  ) {
    if (!mapRef.current) return;
    const directionsService = new google.maps.DirectionsService();
    const { point1, point2, point3 } = suggestedRoutes[routeKey];

    // 古いルート解除
    routeBlueRef.current?.setMap(null);
    routeGreenRef.current?.setMap(null);
    routeYellowRef.current?.setMap(null);
    routeRedRef.current?.setMap(null);

    routeBlueRef.current?.setMap(mapRef.current);
    routeGreenRef.current?.setMap(mapRef.current);
    routeYellowRef.current?.setMap(mapRef.current);
    routeRedRef.current?.setMap(mapRef.current);

    // 1) origin→A
    directionsService.route(
      {
        origin: originPos,
        destination: { lat: point1.lat, lng: point1.lng },
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          routeBlueRef.current?.setDirections(result);
        } else {
          console.error("Blue route error:", status);
        }
      }
    );

    // 2) A→B
    directionsService.route(
      {
        origin: { lat: point1.lat, lng: point1.lng },
        destination: { lat: point2.lat, lng: point2.lng },
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          routeGreenRef.current?.setDirections(result);
        } else {
          console.error("Green route error:", status);
        }
      }
    );

    // 3) B→C
    directionsService.route(
      {
        origin: { lat: point2.lat, lng: point2.lng },
        destination: { lat: point3.lat, lng: point3.lng },
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          routeYellowRef.current?.setDirections(result);
        } else {
          console.error("Yellow route error:", status);
        }
      }
    );

    // 4) C→origin
    directionsService.route(
      {
        origin: { lat: point3.lat, lng: point3.lng },
        destination: originPos,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          routeRedRef.current?.setDirections(result);
        } else {
          console.error("Red route error:", status);
        }
      }
    );

    // A,B,C,D ピン
    createMarkers({
      A: point1,
      B: point2,
      C: point3,
      D: { lat: originPos.lat, lng: originPos.lng, name: "D" },
    });

    // fitBounds
    fitBoundsAllPoints(originPos, point1, point2, point3);

    // ユーザーの現在地マーカー (青いピン)
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }
    userMarkerRef.current = new google.maps.Marker({
      position: originPos,
      map: mapRef.current,
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    });
  }

  //
  // =====================
  // A,B,C,D のマーカー
  // =====================
  function createMarkers(points: {
    A: Point;
    B: Point;
    C: Point;
    D: { lat: number; lng: number; name: string };
  }) {
    if (!mapRef.current) return;
    markerRefs.current.forEach((m) => m.setMap(null));
    markerRefs.current = [];

    // A
    const markerA = new google.maps.Marker({
      position: { lat: points.A.lat, lng: points.A.lng },
      map: mapRef.current,
      label: { text: "A", color: "white", fontWeight: "bold" },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 15,
      },
    });
    markerRefs.current.push(markerA);

    // B
    const markerB = new google.maps.Marker({
      position: { lat: points.B.lat, lng: points.B.lng },
      map: mapRef.current,
      label: { text: "B", color: "white", fontWeight: "bold" },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#34A853",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 15,
      },
    });
    markerRefs.current.push(markerB);

    // C
    const markerC = new google.maps.Marker({
      position: { lat: points.C.lat, lng: points.C.lng },
      map: mapRef.current,
      label: { text: "C", color: "white", fontWeight: "bold" },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#FBBC05",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 15,
      },
    });
    markerRefs.current.push(markerC);

    // D
    const markerD = new google.maps.Marker({
      position: { lat: points.D.lat, lng: points.D.lng },
      map: mapRef.current,
      label: { text: "D", color: "white", fontWeight: "bold" },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#DB4437",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 15,
      },
    });
    markerRefs.current.push(markerD);
  }

  //
  // =====================
  // fitBounds
  // =====================
  function fitBoundsAllPoints(
    originPos: { lat: number; lng: number },
    point1: Point,
    point2: Point,
    point3: Point
  ) {
    if (!mapRef.current) return;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(originPos.lat, originPos.lng));
    bounds.extend(new google.maps.LatLng(point1.lat, point1.lng));
    bounds.extend(new google.maps.LatLng(point2.lat, point2.lng));
    bounds.extend(new google.maps.LatLng(point3.lat, point3.lng));

    mapRef.current.fitBounds(bounds);

    const listener = mapRef.current.addListener("idle", () => {
      if (mapRef.current) {
        const currentZoom = mapRef.current.getZoom() || 0;
        if (currentZoom < 14) {
          mapRef.current.setZoom(14);
        }
        google.maps.event.removeListener(listener);
      }
    });
  }

  //
  // =====================
  // ルート切り替え
  // =====================
  function handleRouteSelect(routeKey: RouteType) {
    setSelectedEase(routeKey);
    // origin が存在すれば計算
    if (origin) {
      calculateAllRoutes(routeKey, origin);
    }
  }

  //
  // =====================
  // UI
  // =====================
  const routes = [
    { id: "easy", label: "EASY", color: "#4285F4", hoverColor: "#2b75e6" },
    { id: "normal", label: "NORMAL", color: "#34A853", hoverColor: "#2d9447" },
    { id: "hard", label: "HARD", color: "#DB4437", hoverColor: "#c93d31" },
  ] as const;

  const [isStartHovered, setIsStartHovered] = useState(false);

  const handleStart = async () => {
    const { point1, point2, point3 } = suggestedRoutes[selectedEase];
    console.log("Selected Route:", point1, point2, point3);
    const routeData = {
      origin: {
        lat: origin?.lat || 0,
        lng: origin?.lng || 0,
        name: "出発地点",
      },
      point1: { lat: point1.lat, lng: point1.lng, name: point1.name },
      point2: { lat: point2.lat, lng: point2.lng, name: point2.name },
      point3: { lat: point3.lat, lng: point3.lng, name: point3.name },
    };
    console.log("Route Data:", routeData);
    localStorage.setItem("selectedRoute", "");
    localStorage.setItem("selectedRoute", JSON.stringify(routeData));
    localStorage.setItem("progress", JSON.stringify(1));
    storedProgress(3);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* 地図表示判定 */}
      {isLoaded ? (
        <GoogleMap
          onLoad={handleMapLoad}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter || { lat: 35.6803997, lng: 139.7690174 }}
          zoom={15}
          options={{
            mapTypeControl: false,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        />
      ) : (
        <div>Loading Map...</div>
      )}

      {/* 下部ボタン */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-20 -translate-x-1/2 
                   bg-white/10 backdrop-blur-md p-6 rounded-2xl 
                   shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20
                   flex flex-col items-center gap-6"
        style={{
          marginLeft: "calc(50% - 200px)",
        }}
      >
        {/* 難易度選択 */}
        <div className="flex gap-3 justify-center">
          {routes.map(({ id, label, color, hoverColor }) => (
            <motion.button
              key={id}
              onClick={() => handleRouteSelect(id)}
              className="relative px-6 py-3 rounded-lg font-bold text-white min-w-[100px]
                         shadow-lg transition-shadow hover:shadow-xl"
              style={{
                backgroundColor: selectedEase === id ? color : "#374151",
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: selectedEase === id ? hoverColor : "#4B5563",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedEase === id && (
                <motion.div
                  layoutId="glow"
                  className="absolute inset-0 rounded-lg"
                  style={{ boxShadow: `0 0 20px ${color}50` }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </motion.button>
          ))}
        </div>

        {/* スタートボタン */}
        <motion.button
          onClick={handleStart}
          onHoverStart={() => setIsStartHovered(true)}
          onHoverEnd={() => setIsStartHovered(false)}
          className="relative w-full px-8 py-4 rounded-lg font-bold text-white text-lg
                     shadow-lg overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #c026d3)",
          }}
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* パーティクル効果 */}
          {isStartHovered && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial="initial"
              animate="animate"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 100],
                    y: [0, (Math.random() - 0.5) * 100],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* グロー効果 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/30 to-purple-600/0"
            animate={{
              x: isStartHovered ? ["-100%", "100%"] : "-100%",
            }}
            transition={{
              duration: 1,
              repeat: isStartHovered ? Number.POSITIVE_INFINITY : 0,
              ease: "linear",
            }}
          />

          {/* ボタンコンテンツ */}
          <div className="relative flex items-center justify-center gap-2">
            <span>START</span>
            <motion.div
              animate={
                isStartHovered
                  ? {
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }
                  : {}
              }
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
