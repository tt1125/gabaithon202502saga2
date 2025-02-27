"use client";

import { useState, useContext, useEffect, useRef } from "react";
import PostItem from "@/components/PostItem";
import { AuthContext, useAuthContext } from "@/context/AuthContext";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  List,
  CircularProgress, // ぐるぐるのローディング用
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { END_POINT } from "@/const/endpoint";

export type PostData = {
  age: number;
  comment: string;
  created_at: string;
  created_by: string;
  gender: string;
  id: number;
  img_url: string;
  name: string;
  origin_lat: number;
  origin_lng: number;
  origin_name: string;
  point1_lat: number;
  point1_lng: number;
  point1_name: string;
  point2_lat: number;
  point2_lng: number;
  point2_name: string;
  point3_lat: number;
  point3_lng: number;
  point3_name: string;
  title: string;
};

export default function Page() {
  const { logout } = useAuthContext();
  const loggedInUser = useContext(AuthContext);

  const userName = loggedInUser.user?.displayName;
  const userIconUrl = loggedInUser.user?.photoURL;

  // ------------------------------------------
  // ① 投稿一覧、オフセット、ローディング状態 などの state を定義
  // ------------------------------------------
  const [recentPosts, setRecentPosts] = useState<PostData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [offset, setOffset] = useState(0); // 何件取得済みかを管理
  const [isLoading, setIsLoading] = useState(false); // データ取得中のローディング表示切り替え
  const [hasMore, setHasMore] = useState(true); // これ以上データがあるか？

  // IntersectionObserver で監視する用の ref
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ------------------------------------------
  // ② 追加データを取得する関数。offset に応じて10件単位で取得
  // ------------------------------------------
  const fetchPosts = async (currentOffset: number) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${END_POINT}/get_recent_posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offset: currentOffset,
        }),
      });
      const data = await response.json();

      if (data.result && data.result.length > 0) {
        // 取得したデータを既存のリストに追加
        setRecentPosts((prev) => [...prev, ...data.result]);
      } else {
        // これ以上取れるデータがなさそうなので、hasMore を false に
        setHasMore(false);
      }
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------
  // ③ offset が変更されたらデータ取得を走らせる
  //    (初回マウント時もここに入るので offset=0 の fetch も行われる)
  // ------------------------------------------
  useEffect(() => {
    if (hasMore) {
      fetchPosts(offset);
    }
  }, [offset, hasMore]);

  // ------------------------------------------
  // ④ IntersectionObserver で bottomRef が画面内に入ったら
  //    offset を +10 して追加データをトリガー
  // ------------------------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 画面内に入った && ローディング中ではない && まだ追加データがあるなら
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          setOffset((prevOffset) => prevOffset + 10);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    // コンポーネントがアンマウントされるときに監視を解除
    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [isLoading, hasMore]);

  return (
    <main
      style={{ zIndex: 5 }}
      className="h-screen bg-gradient-to-r from-purple-500 to-indigo-600"
    >
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {/* ヘッダー - グラデーション部分 */}
        <Box
          sx={{
            height: "128px",
            background: "linear-gradient(to right, #9333ea, #4f46e5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "fixed",
            width: "100%",
            top: 0,
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
            }}
          >
            <DirectionsWalkIcon
              sx={{
                position: "absolute",
                top: "16px",
                left: "16px",
                width: "32px",
                height: "32px",
                color: "white",
              }}
            />
            <DirectionsWalkIcon
              sx={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                width: "32px",
                height: "32px",
                color: "white",
              }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "white", zIndex: 10 }}
          >
            WalkBuddy
          </Typography>
        </Box>

        {/* メインコンテンツ */}
        <Box
          sx={{
            px: 4,
            py: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            marginTop: "160px", // ヘッダーの高さ分の余白を確保
          }}
        >
          {/* ユーザー情報 */}
          <Box
            sx={{
              maxWidth: "600px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{ bgcolor: "#9e9e9e", mr: 1 }}
                src={userIconUrl ?? ""}
              />
              <Typography variant="subtitle1">{userName}</Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={logout}
              startIcon={<LogoutIcon />}
              sx={{
                background: "linear-gradient(to right, #9333ea, #4f46e5)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(to right, #7e22ce, #4338ca)",
                },
              }}
            >
              ログアウト
            </Button>
          </Box>

          {/* 検索バー */}
          <TextField
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="outlined"
            placeholder="検索"
            fullWidth
            sx={{
              px: 4,
              maxWidth: "800px",
              width: "100%",
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: "9999px",
                "&:hover fieldset": {
                  borderColor: "#9333ea",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4f46e5",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "gray", mr: 1 }} />
                </InputAdornment>
              ),
            }}
          />

          {/* 投稿リスト */}
          <List
            sx={{
              width: "100%",
              maxWidth: "90%",
              mx: "auto",
              mb: 4,
            }}
          >
            {recentPosts.map((postData: PostData, index) => (
              <PostItem postData={postData} key={index} />
            ))}
          </List>

          {/* ------------------------------------------
              ⑤ ここにローディング・下部監視用の要素を設置
                 isLoadingの場合はぐるぐるを表示
              ------------------------------------------ */}
          <Box
            ref={bottomRef}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px", // 観測しやすいように適度な高さ
            }}
          >
            {isLoading && <CircularProgress />}
          </Box>
        </Box>

        {/* フッター */}
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            毎日の一歩が、健康な未来への一歩
          </Typography>
        </Box>
      </Box>
    </main>
  );
}
