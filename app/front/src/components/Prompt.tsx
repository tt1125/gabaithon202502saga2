"use client";

import type React from "react";

import { useState } from "react";
import { TextField, Typography, Box, InputAdornment } from "@mui/material";
import { MessageSquare } from "lucide-react";

export default function PromptInput() {
  const [prompt, setPrompt] = useState("");

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        id="prompt"
        placeholder="プロンプトを入力　-- 例: 今日は遠くの場所まで歩きたい --"
        value={prompt}
        onChange={handlePromptChange}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MessageSquare size={20} color="#9e9e9e" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 3,
            py: 1,
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            "&:hover": {
              borderColor: "primary.main",
            },
            "&.Mui-focused": {
              borderColor: "primary.main",
              boxShadow: "0 0 0 2px rgba(103, 58, 183, 0.1)",
            },
          },
        }}
      />

      <Typography
        variant="caption"
        align="center"
        sx={{ color: "text.secondary" }}
      >
        プロンプトを入力すると、あなたのウォーキング体験がより豊かになります
      </Typography>
    </Box>
  );
}
