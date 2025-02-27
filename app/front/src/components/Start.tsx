"use client";

import { useGoogleMapContext } from "@/context/GoogleMapContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Footprints, MapPin, Activity } from "lucide-react";
import Prompt from "./Prompt";
import { useRouter, usePathname } from "next/navigation";
import FirstLogin from "@/components/FirstLogin";

type StartProps = {
  progress: number;
  setProgress: (started: number) => void;
  isNewUser: boolean;
  handleClosePopup: () => void;
};

export default function Start({
  progress,
  setProgress,
  isNewUser,
  handleClosePopup,
}: StartProps) {
  const router = useRouter();

  return (
    <main className="h-screen bg-white">
      <div className="w-full h-full flex flex-col  overflow-hidden shadow-2xl bg-white">
        {/* ヘッダー - グラデーション部分 */}
        <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4">
              <Footprints className="h-8 w-8 text-white" />
            </div>
            <div className="absolute bottom-4 right-4">
              <Footprints className="h-8 w-8 text-white" />
            </div>
            <div className="absolute top-1/2 left-1/3">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="absolute bottom-1/3 right-1/4">
              <Footprints className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white z-10">WalkBuddy</h1>
        </div>

        {/* メインコンテンツ */}
        <div className="p-8 space-y-8">
          {/* アプリロゴ */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <Footprints className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* アプリ説明 */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              あなたの歩みを記録
            </h2>
            <p className="text-gray-600">
              毎日のウォーキングを楽しく続けるための
              <br />
              パートナーアプリです
            </p>
          </div>

          {/*　プロンプト入力欄　*/}
          <Prompt />

          <div>
            {/* 新規ユーザー用の表示 */}
            <FirstLogin open={isNewUser} onClose={handleClosePopup} />
          </div>

          {/* スタートボタン */}
          <div className="pt-4">
            <div>
              <Button
                onClick={() => {
                  setProgress(1);
                }}
                className="w-full h-14 text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 rounded-full shadow-lg"
              >
                スタート
              </Button>
              <Button onClick={() => router.push("/result")}>
                完走後の画面　テスト用
              </Button>
            </div>
          </div>

          {/* フッター */}
          <div className="text-center text-xs text-gray-500 pt-4">
            <p>毎日の一歩が、健康な未来への一歩</p>
          </div>
        </div>
      </div>
    </main>
  );
}
