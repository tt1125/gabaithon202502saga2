"use client";

import { useState, useContext } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";

export default function Page() {
  const { logout } = useAuthContext();
  const loggedInUser = useContext(AuthContext);
  const userName = loggedInUser.user?.displayName;
  const userIconUrl = loggedInUser.user?.photoURL;

  const testData = [
    {
      id: 1,
      name: "1",
      img_url: "",
      title: "aaaa",
      comment: "aaa",
      create_at: "2023-11-26 00:00:00",
    },
    {
      id: 1,
      name: "2",
      img_url: "",
      title: "aaaa",
      comment: "aaa",
      create_at: "2023-11-26 00:00:00",
    },
    {
      id: 1,
      name: "3",
      img_url: "",
      title: "aaaa",
      comment: "aaa",
      create_at: "2023-11-26 00:00:00",
    },
    {
      id: 1,
      name: "4",
      img_url: "",
      title: "aaaa",
      comment: "aaa",
      create_at: "2023-11-26 00:00:00",
    },
    {
      id: 1,
      name: "5",
      img_url: "",
      title: "aaaa",
      comment: "aaa",
      create_at: "2023-11-26 00:00:00",
    },
    {
      id: 1,
      name: "6",
      img_url: "",
      title: "aaaa",
      comment: "aaa",
      create_at: "2023-11-26 00:00:00",
    },
    {
      id: 1,
      name: "7",
      img_url: "",
      title: "aaaa",
      comment: "aaa",
      create_at: "2023-11-26 00:00:00",
    },
    {
      id: 1,
      name: "8",
      img_url: "",
      title: "aaaa",
      comment: "aaa",
      create_at: "2023-11-26 00:00:00",
    },
    {
      id: 1,
      name: "9",
      img_url: "",
      title: "aaaa",
      comment: "aaa",
      create_at: "2023-11-26 00:00:00",
    },
    {
      id: 1,
      name: "10",
      img_url: "",
      title: "aaaa",
      comment: "aaa",
      create_at: "2023-11-26 00:00:00",
    },
  ];

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
            py: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            marginTop: "160px", //ヘッダーの高さ分の余白を確保
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
            variant="outlined"
            placeholder="検索"
            fullWidth
            sx={{
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

          {/* 検索結果を表示したい */}
          <List
            sx={{
              width: "100%",
              maxWidth: "90%",
              mx: "auto",
              mb: 4,
            }}
          >
            {testData.map((postData, index) => (
              <PostItem postData={postData} key={index} />
            ))}
          </List>
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
