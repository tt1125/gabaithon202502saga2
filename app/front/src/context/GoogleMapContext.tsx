"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
  DirectionsService,
} from "@react-google-maps/api";

// =====================
// GoogleMapContext
// =====================
type GoogleMapContextType = {
  active: boolean;
  setActive: (active: boolean) => void;
};
const GoogleMapContext = createContext<GoogleMapContextType>({
  active: false,
  setActive: () => {},
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

export function GoogleMapProvider({ children }: { children: ReactNode }) {
  // -------------------------------------------
  // 位置情報
  // -------------------------------------------
  const [currentPoint, setCurrentPoint] = useState<Coordinates | null>(null);
  // 行きたいポイントを文字列（住所やランドマーク名）で指定
  const [point1, setPoint1] = useState<string>("聖マリア病院");
  const [point2, setPoint2] = useState<string>("マクドナルド ２０９久留米店");
  const [point3, setPoint3] = useState<string>("西鉄花畑駅");

  // -------------------------------------------
  // マップ表示・ルート表示制御
  // -------------------------------------------
  const [active, setActive] = useState(false);

  // 4つの DirectionsResult を持つ (4色で表示)
  const [route1, setRoute1] = useState<google.maps.DirectionsResult | null>(
    null
  );
  const [route2, setRoute2] = useState<google.maps.DirectionsResult | null>(
    null
  );
  const [route3, setRoute3] = useState<google.maps.DirectionsResult | null>(
    null
  );
  const [route4, setRoute4] = useState<google.maps.DirectionsResult | null>(
    null
  );

  // -------------------------------------------
  // next/navigation
  // -------------------------------------------
  const pathname = usePathname();

  // -------------------------------------------
  // Google Maps 読み込み
  // -------------------------------------------
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCsWEFEzwVzLk6PTAWxhc-6WZzMzFKmamI",
    language: "ja",
  });

  // -------------------------------------------
  // Geolocationで現在地を取得
  // -------------------------------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentPoint({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          if (error.code === 1) {
            alert(
              "位置情報の取得が拒否されました。位置情報を有効にしてください。"
            );
          } else {
            console.error("Error obtaining location", error);
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // -------------------------------------------
  // ページが変わったらactiveをリセット
  // -------------------------------------------
  useEffect(() => {
    if (active && pathname !== "/") {
      setActive(false);
    }
  }, [pathname, active]);

  // -------------------------------------------
  // それぞれのDirectionsServiceのコールバック
  // -------------------------------------------
  const directionsCallback1 = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === "OK" && result) {
        // 前回のルートと変わっていたら更新
        if (!route1 || JSON.stringify(route1) !== JSON.stringify(result)) {
          setRoute1(result);
        }
      } else {
        console.error("Directions request #1 failed", status);
      }
    },
    [route1]
  );

  const directionsCallback2 = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === "OK" && result) {
        if (!route2 || JSON.stringify(route2) !== JSON.stringify(result)) {
          setRoute2(result);
        }
      } else {
        console.error("Directions request #2 failed", status);
      }
    },
    [route2]
  );

  const directionsCallback3 = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === "OK" && result) {
        if (!route3 || JSON.stringify(route3) !== JSON.stringify(result)) {
          setRoute3(result);
        }
      } else {
        console.error("Directions request #3 failed", status);
      }
    },
    [route3]
  );

  const directionsCallback4 = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === "OK" && result) {
        if (!route4 || JSON.stringify(route4) !== JSON.stringify(result)) {
          setRoute4(result);
        }
      } else {
        console.error("Directions request #4 failed", status);
      }
    },
    [route4]
  );

  // -------------------------------------------
  // 実際に地図を描画するコンポーネント
  // -------------------------------------------
  const MapViewer = useMemo(() => {
    // ロード中または座標未取得なら Loading
    if (!isLoaded || !currentPoint) {
      return function LoadingMap() {
        return (
          <main
            className="h-[calc(100vh-64px)] fixed top-0 left-0 w-full flex items-center justify-center"
            style={{ zIndex: -1 }}
          >
            <p>Loading...</p>
          </main>
        );
      };
    }

    // 調整したいMapオプション例
    const mapOptions: google.maps.MapOptions = {
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      cameraControl: false,
    };

    // 実際の地図コンポーネント
    const ActualMap = () => {
      return (
        <main
          className="h-[calc(100vh-64px)] fixed top-0 left-0 w-full"
          style={{ zIndex: -1 }}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPoint}
            zoom={16}
            options={mapOptions}
          >
            {/* 
              4ルートを DirectionsService で取得
              1) current → point1 (blue)
              2) point1   → point2 (green)
              3) point2   → point3 (yellow)
              4) point3   → current (red)
            */}
            {/* #1 current -> point1 */}
            <DirectionsService
              options={{
                origin: currentPoint,
                destination: point1,
                travelMode: google.maps.TravelMode.WALKING,
              }}
              callback={directionsCallback1}
            />
            {/* #2 point1 -> point2 */}
            <DirectionsService
              options={{
                origin: point1,
                destination: point2,
                travelMode: google.maps.TravelMode.WALKING,
              }}
              callback={directionsCallback2}
            />
            {/* #3 point2 -> point3 */}
            <DirectionsService
              options={{
                origin: point2,
                destination: point3,
                travelMode: google.maps.TravelMode.WALKING,
              }}
              callback={directionsCallback3}
            />
            {/* #4 point3 -> current */}
            <DirectionsService
              options={{
                origin: point3,
                destination: currentPoint,
                travelMode: google.maps.TravelMode.WALKING,
              }}
              callback={directionsCallback4}
            />
            {/* それぞれの DirectionsRenderer を色違いで表示 */}
            {route4 && (
              <DirectionsRenderer
                options={{
                  directions: route4,
                  polylineOptions: {
                    strokeColor: "#DB4437",
                  },
                }}
              />
            )}
            {route3 && (
              <DirectionsRenderer
                options={{
                  directions: route3,
                  polylineOptions: {
                    strokeColor: "#34A853",
                  },
                }}
              />
            )}
            {route2 && (
              <DirectionsRenderer
                options={{
                  directions: route2,
                  polylineOptions: {
                    strokeColor: "#FBBC05",
                  },
                }}
              />
            )}
            {route1 && (
              <DirectionsRenderer
                options={{
                  directions: route1,
                  polylineOptions: {
                    strokeColor: "#4285F4",
                  },
                }}
              />
            )}
          </GoogleMap>
        </main>
      );
    };

    // 名前付きコンポーネントとして返す
    ActualMap.displayName = "MapViewer";
    return ActualMap;
  }, [
    isLoaded,
    currentPoint,
    point1,
    point2,
    point3,
    route1,
    route2,
    route3,
    route4,
  ]);

  return (
    <GoogleMapContext.Provider value={{ active, setActive }}>
      <MapViewer />
      {!active && children}
    </GoogleMapContext.Provider>
  );
}
