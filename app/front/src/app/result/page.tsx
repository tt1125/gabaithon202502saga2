"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footprints, MapPin, Trophy, Check, Flame, Heart } from "lucide-react";
import { TextField, Button, Paper } from "@mui/material";

export default function CompletionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    // ここに投稿処理を実装
    console.log({ title, comment });
    // 投稿後にタイトル画面に戻る
    router.push("/");
  };

  const handleReturnToTitle = () => {
    router.push("/");
  };

  const routes = ["Aルート", "Bルート", "Cルート", "Dルート"];

  return (
    <main className="h-screen w-full overflow-hidden">
      <div className="w-full h-full flex flex-col shadow-2xl bg-white">
        {/* ヘッダー */}
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
        <div
          className="p-6 flex flex-col items-center flex-grow w-full max-w-4xl mx-auto"
          style={{
            overflowY: "auto", // スクロール可能
            scrollbarWidth: "none", // Firefox用
          }}
        >
          <style>
            {`
          /* Chrome, Safari用 */
          div::-webkit-scrollbar {
            display: none;
          }
        `}
          </style>

          {/* おめでとうメッセージ */}
          <div className="flex flex-col items-center mb-8">
            <Trophy className="w-16 h-16 text-purple-600 mb-4" />
            <h2 className="text-2xl font-bold text-indigo-600 text-center">
              おめでとう！
            </h2>
            <p className="text-gray-600 text-center mt-2">
              ウォーキングを完了しました！
            </p>
          </div>

          {/* 入力フィールド */}
          <Paper elevation={2} className="p-6 w-full rounded-2xl mb-6">
            <TextField
              label="タイトル"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#9333ea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4f46e5",
                  },
                },
              }}
            />
            <TextField
              label="コメント"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#9333ea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4f46e5",
                  },
                },
              }}
            />
          </Paper>

          {/* ルート */}
          <Paper elevation={2} className="p-6 w-full rounded-2xl mb-8">
            <h3 className="text-lg font-bold mb-4 text-indigo-600">ルート</h3>
            <ul className="space-y-4">
              {routes.map((route, index) => (
                <li className="flex items-center" key={index}>
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <Footprints className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{route}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Paper>

          {/* ボタン */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                background: "linear-gradient(to right, #9333ea, #4f46e5)",
                color: "white",
                py: 1.5,
                borderRadius: "8px",
                "&:hover": {
                  background: "linear-gradient(to right, #7e22ce, #4338ca)",
                },
              }}
            >
              投稿する
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleReturnToTitle}
              sx={{
                borderColor: "#9333ea",
                color: "#4f46e5",
                py: 1.5,
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#7e22ce",
                  backgroundColor: "rgba(79, 70, 229, 0.04)",
                },
              }}
            >
              タイトルへ戻る
            </Button>
          </div>
        </div>

        {/* フッター */}
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500">
            毎日の一歩が、健康な未来への一歩
          </p>
        </div>
      </div>
    </main>
  );
}
