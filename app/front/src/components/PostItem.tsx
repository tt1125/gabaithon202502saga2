"use client";
import { PostData } from "@/app/social/page";
import { Avatar, Box, Typography, Paper } from "@mui/material";
import { Flag, Home, MapPin, Navigation } from "lucide-react";

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
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {postData.comment}
          </Typography>

          {/* ルートポイントの表示 */}
          <Box
            sx={{
              position: "relative",
              pl: 4,
              "&::before": {
                content: '""',
                position: "absolute",
                left: "12px",
                top: "8px",
                bottom: "8px",
                width: "2px",
                background:
                  "linear-gradient(to bottom, #9333EA 0%, #DB2777 100%)",
                borderRadius: "1px",
              },
            }}
          >
            {/* 出発地点 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "-28px",
                  backgroundColor: "#9333EA",
                  borderRadius: "50%",
                  p: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Home className="w-4 h-4 text-white" />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#9333EA",
                  fontWeight: "medium",
                }}
              >
                {postData.origin_name}
              </Typography>
            </Box>

            {/* ポイント1 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "-28px",
                  backgroundColor: "#AB4BED",
                  borderRadius: "50%",
                  p: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MapPin className="w-4 h-4 text-white" />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#AB4BED",
                  fontWeight: "medium",
                }}
              >
                {postData.point1_name}
              </Typography>
            </Box>

            {/* ポイント2 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "-28px",
                  backgroundColor: "#C162F0",
                  borderRadius: "50%",
                  p: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Navigation className="w-4 h-4 text-white" />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#C162F0",
                  fontWeight: "medium",
                }}
              >
                {postData.point2_name}
              </Typography>
            </Box>

            {/* ポイント3 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "-28px",
                  backgroundColor: "#DB2777",
                  borderRadius: "50%",
                  p: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Flag className="w-4 h-4 text-white" />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#DB2777",
                  fontWeight: "medium",
                }}
              >
                {postData.point3_name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
