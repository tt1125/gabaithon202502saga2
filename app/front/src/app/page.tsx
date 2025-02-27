"use client";

import Loading from "@/components/Loading";
import Select from "@/components/Select";
import Start from "@/components/Start";
import { DUMMY_DATA } from "@/const/dummy";
import { useGoogleMapContext } from "@/context/GoogleMapContext";
import { useEffect, useState, useContext, use } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Page() {
  const [progress, storedProgress] = useState(0);
  const [suggestedRoutes, setSuggestedRoutes] = useState<SuggestedRoutes>();
  const { active, setActive } = useGoogleMapContext();

  const [isNewUser, setIsNewUser] = useState<boolean>(true);

  //認証中のユーザーのデータをとってくる．
  const loggedInUser = useContext(AuthContext);
  const userData = loggedInUser?.user;
  console.log(userData);

  const getSuggestedRoute = async () => {
    const routes = DUMMY_DATA;
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5秒待機
    setSuggestedRoutes(routes);
    storedProgress(2);
  };

  const checkUserExists = async (id: string) => {
    try {
      // const response = await fetch("/check_newcomer", {
      //   method: "POST",
      // headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ id }),
      // });
      const response = await fetch("http://localhost:5000/check_newcomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      console.log("data", data);
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
    console.log("checkUser");
  }, []);

  useEffect(() => {
    if (progress === 1) {
      const routes = getSuggestedRoute();
    }
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
          !active && <Start progress={progress} setProgress={storedProgress} />
        );
      case 1:
        return (
          !active && <Loading message="現在地からルートを生成しています" />
        );
      case 2:
        return (
          !active && (
            <Select
              suggestedRoutes={DUMMY_DATA}
              storedProgress={storedProgress}
            />
          )
        );
      case 3:
        return <></>;
      case 4:
        return <>end</>;
    }

  }
}
