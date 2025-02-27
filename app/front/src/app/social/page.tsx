"use client";

import { AuthContext, useAuthContext } from "@/context/AuthContext";

import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useContext } from "react";

export default function Page() {
  const { logout } = useAuthContext();

  const loggedInUser = useContext(AuthContext);
  console.log("login User Data", loggedInUser.user);

  const userName = loggedInUser.user?.displayName;
  const userIconUrl = loggedInUser.user?.photoURL;

  return (
    <div style={{ zIndex: 5 }}>
      <main className="h-screen bg-white">
        <Box
          sx={{
            width: "100%",
            padding: 2,
            backgroundColor: "#fff",
          }}
        >
          {/* ユーザー情報 */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              margin: "45px",
              marginBottom: "50px",
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{ bgcolor: "#9e9e9e", mr: 1 }}
                src={userIconUrl ?? ""}
              ></Avatar>
              <Typography variant="subtitle1">{userName}</Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={logout}
            >
              ログアウト
            </Button>
          </Box>

          {/* 検索バー */}
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="検索"
              fullWidth
              sx={{ maxWidth: "90%" }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "gray", mr: 1 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>

          {/* 検索結果を表示したい */}
        </Box>
      </main>
    </div>
  );
}
