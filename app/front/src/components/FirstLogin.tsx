"use client";

import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";

type FirstLoginProps = {
  open: boolean;
  onClose: () => void;
};

export default function FirstLogin({ open, onClose }: FirstLoginProps) {
  const loggedInUser = useContext(AuthContext);
  const userName = loggedInUser.user?.displayName;
  const userIconUrl = loggedInUser.user?.photoURL;

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = () => {
    // ここで年齢と性別の情報を処理します
    console.log("Age:", age);
    console.log("Gender:", gender);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          textAlign: "center",
          background: "linear-gradient(to right, #9333ea, #4f46e5)",
          color: "white",
          fontWeight: "bold",
        }}
      >
        ようこそ!
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Avatar
            src={userIconUrl ?? ""}
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Typography variant="h6" sx={{ mb: 3 }}>
            {userName}
          </Typography>

          <TextField
            label="年齢"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            fullWidth
            sx={{
              mb: 2,
            }}
            inputProps={{
              min: 0,
              max: 130,
            }}
          ></TextField>

          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 3 }}
          >
            <MenuItem value="" disabled>
              性別を選択してください
            </MenuItem>
            <MenuItem value="male">男性</MenuItem>
            <MenuItem value="female">女性</MenuItem>
            <MenuItem value="other">その他</MenuItem>
          </Select>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(to right, #9333ea, #4f46e5)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(to right, #7e22ce, #4338ca)",
              },
            }}
          >
            送信
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
