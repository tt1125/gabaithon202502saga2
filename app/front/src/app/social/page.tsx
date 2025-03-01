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
  // state 定義
  // ------------------------------------------
  const [recentPosts, setRecentPosts] = useState<PostData[]>([]); // 最新投稿(無限スクロールで追加)
  const [searchResults, setSearchResults] = useState<PostData[]>([]); // 検索結果用
  const [searchText, setSearchText] = useState("");

  const [offset, setOffset] = useState(0); // 無限スクロール用 何件取得済みか
  const [isLoading, setIsLoading] = useState(false); // 無限スクロール用ローディング
  const [hasMore, setHasMore] = useState(true); // まだデータがあるか？

  const [isSearching, setIsSearching] = useState(false); // 検索処理中かどうか

  // IntersectionObserver で監視する用の ref (無限スクロール)
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ------------------------------------------
  // (A) 無限スクロール用: 追加データを取得する関数
  // ------------------------------------------
  const fetchRecentPosts = async (currentOffset: number) => {
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

      if (Array.isArray(data.result) && data.result.length > 0) {
        setRecentPosts((prev) => [...prev, ...data.result]);
      } else {
        // これ以上データがない
        setHasMore(false);
      }
    } catch (error) {
      console.error("最新投稿の取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------
  // (B) 検索用: 検索テキストを使って検索結果を取得
  // ------------------------------------------
  const fetchSearchResults = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`${END_POINT}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      // 検索結果をセット
      setSearchResults(data);
    } catch (error) {
      console.error("検索に失敗しました:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // ------------------------------------------
  // (C) コンポーネントマウント時に offset=0 の最新投稿を取得
  // ------------------------------------------
  useEffect(() => {
    fetchRecentPosts(0);
  }, []);

  // ------------------------------------------
  // (D) offset が変化したら「さらに」最新投稿を取得
  //     → 検索中じゃない時だけ
  // ------------------------------------------
  useEffect(() => {
    // 検索文字が空 & まだデータがある場合のみ fetch
    if (searchText.trim() === "" && hasMore && offset !== 0) {
      fetchRecentPosts(offset);
    }
  }, [offset, searchText, hasMore]);

  // ------------------------------------------
  // (E) IntersectionObserver で bottomRef を監視し、
  //     下までスクロールしたら offset += 10 して追加データを取得
  //     → 検索時は無限スクロールを無効にする
  // ------------------------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 画面内に入った && ローディング中ではない && まだ追加データがある && 検索中じゃない
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          hasMore &&
          !isSearching &&
          searchText.trim() === ""
        ) {
          setOffset((prevOffset) => prevOffset + 8);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      },
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [isLoading, hasMore, isSearching, searchText]);

  // ------------------------------------------
  // (F) 検索テキストが変化したら検索を実行
  //     - 文字が空なら検索結果をリセット
  //     - 文字が入っていれば検索実行
  // ------------------------------------------
  useEffect(() => {
    if (searchText.trim() === "") {
      // 検索文字が空になったら検索結果をクリア
      setSearchResults([]);
    } else {
      fetchSearchResults(searchText.trim());
    }
  }, [searchText]);

  // 表示する投稿一覧
  const displayedPosts = searchText.trim() ? searchResults : recentPosts;

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
          <Box sx={{ width: "100%", maxWidth: "800px", mb: 4 }}>
            <TextField
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              variant="outlined"
              placeholder="検索"
              fullWidth
              sx={{
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
          </Box>

          {/* 検索ローディング表示 */}
          {isSearching && (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="secondary" />
              <Typography variant="body2" sx={{ mt: 3 }}>
                検索中
              </Typography>
            </Box>
          )}
          {/* 投稿リスト */}
          <List
            sx={{
              width: "100%",
              maxWidth: "90%",
              mx: "auto",
              mb: 4,
            }}
          >
            {displayedPosts.map((postData: PostData, index) => (
              <PostItem postData={postData} key={index} />
            ))}
          </List>

          {/* 下部ローディング & 監視要素 */}
          <Box
            ref={bottomRef}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
            }}
          >
            {/* 無限スクロール取得中で、かつ検索中ではないときだけ表示 */}
            {isLoading && !isSearching && (
              <CircularProgress color="secondary" />
            )}
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
