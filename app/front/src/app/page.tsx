"use client";

import Loading from "@/components/Loading";
import Select from "@/components/Select";
import Start from "@/components/Start";
import { DUMMY_DATA } from "@/const/dummy";
import { useGoogleMapContext } from "@/context/GoogleMapContext";
import { useEffect, useState, useContext, use } from "react";
import { AuthContext } from "@/context/AuthContext";
import { END_POINT } from "@/const/endpoint";
import Result from "@/components/Result";

export default function Page() {
  const [progress, storedProgress] = useState(0);
  const [suggestedRoutes, setSuggestedRoutes] = useState<SuggestedRoutes>();
  const { active, setActive, currentLat, currentLng } = useGoogleMapContext();

  const [isNewUser, setIsNewUser] = useState<boolean>(true);

  //認証中のユーザーのデータをとってくる．
  const loggedInUser = useContext(AuthContext);
  const userData = loggedInUser?.user;

  const getSuggestedRoute = async () => {
    try {
      const response = await fetch(`${END_POINT}/api/suggestion_routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_location_lat: currentLat,
          current_location_lng: currentLng,
        }),
      });
      const data = await response.json();
      const easyRoute = data.find((route: any) => route.mode === "easy mode");
      const normalRoute = data.find(
        (route: any) => route.mode === "normal mode"
      );
      const hardRoute = data.find((route: any) => route.mode === "hard mode");
      const routes = {
        normal: normalRoute,
        easy: easyRoute,
        hard: hardRoute,
      };
      setSuggestedRoutes(routes);
      storedProgress(2);
    } catch (error) {
      console.error("Error obtaining location", error);
      storedProgress(1);
    }
  };

  const checkUserExists = async (id: string) => {
    try {
      const response = await fetch(`${END_POINT}/check_newcomer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      setIsNewUser(data.is_new_user);
    } catch (error) {
      console.log(error);
    }
  };
  const handleClosePopup = () => {
    setIsNewUser(true);
  };

  useEffect(() => {
    if (!userData) return;
    checkUserExists(userData.uid);
  }, []);

  useEffect(() => {
    if (progress === 3) {
      setActive(true);
    }
  }, [progress]);

  useEffect(() => {
    const savedProgress = localStorage.getItem("progress");
    if (savedProgress === "5") {
      storedProgress(4);
    }
  }, [active]);

  {
    switch (progress) {
      case 0:
        return (
          !active && (
            <Start
              handleClosePopup={handleClosePopup}
              isNewUser={isNewUser}
              progress={progress}
              setProgress={storedProgress}
              getSuggestedRoute={getSuggestedRoute}
            />
          )
        );
      case 1:
        return (
          !active && <Loading message="現在地からルートを生成しています" />
        );
      case 2:
        return (
          !active && (
            <Select
              suggestedRoutes={suggestedRoutes!}
              storedProgress={storedProgress}
            />
          )
        );
      case 3:
        return <></>;
      case 4:
        return <Result />;
    }
  }
}
