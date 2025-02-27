"use client";

import Loading from "@/components/Loading";
import Select from "@/components/Select";
import Start from "@/components/Start";
import { DUMMY_DATA } from "@/const/dummy";
import { useGoogleMapContext } from "@/context/GoogleMapContext";
import { useEffect, useState } from "react";

export default function Page() {
  const [progress, storedProgress] = useState(0);
  const [suggestedRoutes, setSuggestedRoutes] = useState<SuggestedRoutes>();
  const { setActive } = useGoogleMapContext();

  const getSuggestedRoute = async () => {
    const routes = DUMMY_DATA;
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5秒待機
    setSuggestedRoutes(routes);
    storedProgress(2);
  };

  useEffect(() => {
    if (progress === 1) {
      const routes = getSuggestedRoute();
    }
    if (progress === 3) {
      setActive(true);
    }
  }, [progress]);

  switch (progress) {
    case 0:
      return <Start progress={progress} setProgress={storedProgress} />;
    case 1:
      return <Loading message="現在地からルートを生成しています" />;
    case 2:
      return (
        <Select suggestedRoutes={DUMMY_DATA} storedProgress={storedProgress} />
      );
    case 3:
      return <></>;
  }
}
