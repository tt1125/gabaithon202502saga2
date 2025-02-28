"use client";
import { PostData } from "@/app/social/page";
import { Avatar, Box, Typography, Paper } from "@mui/material";

type PostItemProps = {
  postData: PostData;
};

export default function PostItem({ postData }: PostItemProps) {
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
              <Typography variant="body2" component="span">
                {postData.age}歳　
                {postData.gender === "male"
                  ? "男性"
                  : postData.gender === "female"
                    ? "女性"
                    : "その他"}
              </Typography>
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {new Date(postData.created_at).toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
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
