"use client";
import { Avatar, Box, Typography, Paper } from "@mui/material";
export default function PostItem({ postData }: any) {
  return (
    <Paper
      elevation={1}
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
      }}
      onClick={() => {
        alert("コメントが押された");
      }}
    >
      <Box sx={{ display: "flex", p: 2 }}>
        <Avatar
          src={postData.img_url}
          sx={{
            width: 56,
            height: 56,
            bgcolor: "#9333EA",
            mr: 2,
          }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 0.5,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {postData.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {postData.create_at}
            </Typography>
          </Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "medium",
              color: "#4F46E5",
              mb: 0.5,
            }}
          >
            {postData.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {postData.comment}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
