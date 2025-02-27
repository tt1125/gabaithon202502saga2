"use client";

import React, {
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { usePathname } from "next/navigation";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

// =====================
// GoogleMapContext
// =====================
type GoogleMapContextType = {
  active: boolean;
  setActive: (active: boolean) => void;
  isLoaded: boolean;
};
const GoogleMapContext = createContext<GoogleMapContextType>({
  active: false,
  setActive: () => {},
  isLoaded: false,
});

export function useGoogleMapContext() {
  return useContext(GoogleMapContext);
}

// =====================
// GoogleMapProvider
// =====================
type Coordinates = {
  lat: number;
  lng: number;
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

export function GoogleMapProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mapCenter, setMapCenter] = useState<Coordinates | null>(null);
  const [active, setActive] = useState(false);

  // --- 固定の目的地たち (文字列 or 座標でOK) ---
  const point1 = { lat: 33.373914, lng: 130.206551 };
  const point2 = { lat: 33.373578, lng: 130.208156 };
  const point3 = { lat: 33.371796, lng: 130.20775 };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCsWEFEzwVzLk6PTAWxhc-6WZzMzFKmamI",
    language: "ja",
  });

  // =====================
  // 位置情報を ref で保持
  // =====================
  const currentPointRef = useRef<Coordinates | null>(null);
  const initialPositionRef = useRef<Coordinates | null>(null);

  // =====================
  // Map / DirectionsRenderer を ref で保持
  // =====================
  const mapRef = useRef<google.maps.Map | null>(null);

  // route1: 現在地 → point1 (青)
  const route1RendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  // route2: point1 → point2 (緑)
  const route2RendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  // route3: point2 → point3 (黄色)
  const route3RendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  // route4: point3 → 現在地 (赤)
  const route4RendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  // =====================
  // マップ生成時のコールバック
  // =====================
  function handleMapLoad(map: google.maps.Map) {
    mapRef.current = map;

    // 初期位置を保存
    if (!initialPositionRef.current && currentPointRef.current) {
      initialPositionRef.current = currentPointRef.current;
    }

    // 現在地にユーザーのピンを追加
    if (currentPointRef.current) {
      // 初期位置からAまでの経路を計算
      calculateRoute1(currentPointRef.current);
    }

    // route1の目的地にAのマークを追加
    new google.maps.Marker({
      position: point1,
      map,
      label: {
        text: "A",
        color: "white",
        fontWeight: "bold",
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#4285F4", // 青
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 15, // サイズ調整
      },
    });

    // route2の目的地にBのマークを追加
    new google.maps.Marker({
      position: point2,
      map,
      label: {
        text: "B",
        color: "white",
        fontWeight: "bold",
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#34A853", // 緑
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 15, // サイズ調整
      },
    });

    // ... existing code ...
    new google.maps.Marker({
      position: point3,
      map,
      label: {
        text: "C",
        color: "white",
        fontWeight: "bold",
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#FBBC05", // 黄
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 15, // サイズ調整
      },
    });

    // route4の目的地にDのマークを追加
    if (initialPositionRef.current) {
      new google.maps.Marker({
        position: initialPositionRef.current,
        map,
        label: {
          text: "D",
          color: "white",
          fontWeight: "bold",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#DB4437", // 赤
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 15, // サイズ調整
        },
      });
    }
    // ... existing code ...

    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newPos: Coordinates = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        currentPointRef.current = newPos;
        setMapCenter(newPos);

        let storedProgress = parseInt(localStorage.getItem("progress") || "1");
        if (!storedProgress) {
          storedProgress = 1;
        }

        if (storedProgress == 1) {
          // 現在地→point1 ルートを更新
          calculateRoute1(newPos);
        } else if (storedProgress == 2) {
          // point1→point2 ルートを更新
          calculateRouteToPoint2(currentPointRef.current!);
        } else if (storedProgress == 3) {
          // point2→point3 ルートを更新
          calculateRouteToPoint3(currentPointRef.current!);
        } else if (storedProgress == 4) {
          // point3→初期位置 ルートを更新
          calculateRouteToPoint4(currentPointRef.current!);
        }

        // ユーザーのピンを更新
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(newPos);
        } else if (mapRef.current) {
          userMarkerRef.current = new google.maps.Marker({
            position: newPos,
            map: mapRef.current,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          });
        }

        // point3→初期位置 も更新するなら再計算
        if (route4RendererRef.current && initialPositionRef.current) {
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin: point3,
              destination: initialPositionRef.current,
              travelMode: google.maps.TravelMode.WALKING,
            },
            (result, status) => {
              if (status === "OK") {
                route4RendererRef.current?.setDirections(result);
              }
            }
          );
        }
      }
    });

    route4RendererRef.current = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "#DB4437", // 赤
        zIndex: 1, // 最も低い優先順位
        strokeWeight: 5, // 太さを指定
      },
      suppressMarkers: true,
      preserveViewport: true,
    });
    route4RendererRef.current.setMap(map);

    route3RendererRef.current = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "#FBBC05", // 黄
        zIndex: 2,
        strokeWeight: 5, // 太さを指定
      },
      suppressMarkers: true,
      preserveViewport: true,
    });
    route3RendererRef.current.setMap(map);

    route2RendererRef.current = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "#34A853", // 緑
        zIndex: 3,
        strokeWeight: 5, // 太さを指定
      },
      suppressMarkers: true,
      preserveViewport: true,
    });
    route2RendererRef.current.setMap(map);

    // --- ① DirectionsRenderer を作成し、それぞれマップへセット ---
    route1RendererRef.current = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "#4285F4", // 青
        zIndex: 4, // 最も高い優先順位
        strokeWeight: 5, // 太さを指定
      },
      suppressMarkers: true,
      preserveViewport: true,
    });
    route1RendererRef.current.setMap(map);

    // --- ② 固定ルート(point1→point2, point2→point3, point3→現在地)を計算 ---
    calculateFixedRoutes();
  }

  function calculateFixedRoutes() {
    if (!mapRef.current) return;
    const directionsService = new google.maps.DirectionsService();

    // ②-3) point3 → 現在地 (まだ currentPointRef が null の可能性あり)
    if (currentPointRef.current) {
      directionsService.route(
        {
          origin: point3,
          destination: currentPointRef.current,
          travelMode: google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === "OK" && route4RendererRef.current) {
            route4RendererRef.current.setDirections(result);
          }
        }
      );
    }

    // ②-2) point2 → point3
    directionsService.route(
      {
        origin: point2,
        destination: point3,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && route3RendererRef.current) {
          route3RendererRef.current.setDirections(result);
        }
      }
    );

    // ②-1) point1 → point2
    directionsService.route(
      {
        origin: point1,
        destination: point2,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && route2RendererRef.current) {
          route2RendererRef.current.setDirections(result);
        }
      }
    );
  }

  // =====================
  // 現在地→point1 のリアルタイム計算
  // =====================

  function calculateRoute1(currentPos: Coordinates) {
    if (!mapRef.current || !route1RendererRef.current) return;
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: currentPos,
        destination: point1,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK") {
          route1RendererRef.current?.setDirections(result);

          const distanceToPoint1 =
            google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(currentPos.lat, currentPos.lng),
              new google.maps.LatLng(point1.lat, point1.lng)
            );

          if (distanceToPoint1 < 50) {
            // 50メートル以内に近づいたら
            route1RendererRef.current?.setMap(null); // point1へのルートを削除
            localStorage.setItem("progress", "2");
          } else {
            // point1から離れたら再度point2へのルートを表示
            if (route2RendererRef.current) {
              route2RendererRef.current.setMap(mapRef.current);
            }
          }
        }
      }
    );
  }

  function calculateRouteToPoint2(currentPos: Coordinates) {
    if (!mapRef.current || !route2RendererRef.current) return;
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: currentPos,
        destination: point2,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK") {
          route2RendererRef.current?.setDirections(result);

          const distanceToPoint2 =
            google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(currentPos.lat, currentPos.lng),
              new google.maps.LatLng(point2.lat, point2.lng)
            );

          if (distanceToPoint2 < 50) {
            // 50メートル以内に近づいたら
            route2RendererRef.current?.setMap(null); // point2へのルートを削除
            localStorage.setItem("progress", "3");
          } else {
            // point2から離れたら再度point3へのルートを表示
            if (route3RendererRef.current) {
              route3RendererRef.current.setMap(mapRef.current);
            }
          }
        }
      }
    );
  }

  function calculateRouteToPoint3(currentPos: Coordinates) {
    if (!mapRef.current || !route3RendererRef.current) return;
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: currentPos,
        destination: point3,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK") {
          route3RendererRef.current?.setDirections(result);

          const distanceToPoint3 =
            google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(currentPos.lat, currentPos.lng),
              new google.maps.LatLng(point3.lat, point3.lng)
            );

          if (distanceToPoint3 < 50) {
            // 50メートル以内に近づいたら
            route3RendererRef.current?.setMap(null); // point3へのルートを削除
            localStorage.setItem("progress", "4");
          } else {
            // point3から離れたら再度初期位置へのルートを表示
            if (route4RendererRef.current) {
              route4RendererRef.current.setMap(mapRef.current);
            }
          }
        }
      }
    );
  }

  // ... existing code ...

  function calculateRouteToPoint4(currentPos: Coordinates) {
    if (
      !mapRef.current ||
      !route4RendererRef.current ||
      !initialPositionRef.current
    )
      return;
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: currentPos,
        destination: initialPositionRef.current,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && initialPositionRef.current) {
          route4RendererRef.current?.setDirections(result);

          const distanceToInitialPosition =
            google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(currentPos.lat, currentPos.lng),
              new google.maps.LatLng(
                initialPositionRef.current.lat,
                initialPositionRef.current.lng
              )
            );

          if (distanceToInitialPosition < 50) {
            // 50メートル以内に近づいたら
            route4RendererRef.current?.setMap(null); // 初期位置へのルートを削除
          }
        }
      }
    );
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: Coordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        // 現在地を ref に保存 (再レンダリングしない)
        currentPointRef.current = newPos;

        // 初期位置を保存
        if (!initialPositionRef.current) {
          initialPositionRef.current = newPos;
        }

        // マップの中心を新しい現在地に移動
        setMapCenter(newPos);

        let storedProgress = parseInt(localStorage.getItem("progress") || "1");
        if (!storedProgress) {
          storedProgress = 1;
        }
        if (storedProgress == 1) {
          // 現在地→point1 ルートを更新
          calculateRoute1(newPos);
        } else if (storedProgress == 2) {
          // point1→point2 ルートを更新
          calculateRouteToPoint2(currentPointRef.current!);
        } else if (storedProgress == 3) {
          // point2→point3 ルートを更新
          calculateRouteToPoint3(currentPointRef.current!);
        } else if (storedProgress == 4) {
          // point3→初期位置 ルートを更新
          calculateRouteToPoint4(currentPointRef.current!);
        }
        // ユーザーのピンを更新
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(newPos);
        } else if (mapRef.current) {
          userMarkerRef.current = new google.maps.Marker({
            position: newPos,
            map: mapRef.current,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          });
        }

        // point3→初期位置 も更新するなら再計算
        if (route4RendererRef.current && initialPositionRef.current) {
          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin: point3,
              destination: initialPositionRef.current,
              travelMode: google.maps.TravelMode.WALKING,
            },
            (result, status) => {
              if (status === "OK") {
                route4RendererRef.current?.setDirections(result);
              }
            }
          );
        }
      },
      (err) => {
        console.error("Geolocation watchPosition error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("progress", "1");
  }, []);

  // =====================
  // 描画 (一度だけ)
  // =====================
  return (
    <GoogleMapContext.Provider value={{ active, setActive, isLoaded }}>
      {isLoaded && mapCenter && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            zIndex: -1,
          }}
        >
          <GoogleMap
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
          />
        </div>
      )}
      <div
        style={{
          zIndex: active ? -2 : "auto",
        }}
      >
        {children}
      </div>
    </GoogleMapContext.Provider>
  );
}
