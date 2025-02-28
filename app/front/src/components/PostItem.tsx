"use client";
import { PostData } from "@/app/social/page";
import { END_POINT } from "@/const/endpoint";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress, // ぐるぐるのローディング用
  Paper,
} from "@mui/material";

interface PostItemProps {
  postData: PostData;
}

const PostItem: React.FC<PostItemProps> = ({ postData }) => {
  const loggedInUser = useContext(AuthContext);
  const user = loggedInUser.user;
  const postId = postData.id;

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getThreadData = async (postId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${END_POINT}/get_comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId }),
      });
      const data = await response.json();
      if (data && data.result) {
        setComments(data.result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // 成功・失敗どちらでも確実にローディングを終了する
    }
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      getThreadData(postId);
    }
  };

  const createReply = async () => {
    if (!comment.trim()) return;

    const postCommentInfo = {
      post_id: postId,
      user_id: user?.uid,
      comment: comment,
    };

    try {
      const response = await fetch(`${END_POINT}/post_comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postCommentInfo),
      });
      const data = await response.json();
      if (data) {
        setComment("");
        getThreadData(postId);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    >
      <Box
        sx={{ display: "flex", p: 2, cursor: "pointer" }}
        onClick={() => {
          handleClick();
        }}
      >
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

      {/* 返信エリア - 展開時のみ表示 */}
      {isExpanded && (
        <Box sx={{ px: 3, pb: 3, pt: 0 }}>
          <Box sx={{ height: 1, bgcolor: "rgba(0,0,0,0.06)", mb: 2 }} />

          {/* コメント入力エリア */}
          <Box sx={{ display: "flex", mb: 2, gap: 1 }}>
            <Avatar
              src={user?.photoURL || undefined}
              sx={{ width: 40, height: 40, bgcolor: "#9333EA" }}
            />
            <TextField
              fullWidth
              size="small"
              placeholder="返信を入力..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  "&:hover fieldset": {
                    borderColor: "#9333ea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4f46e5",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={createReply}
              disabled={!comment.trim()}
              sx={{
                background: "linear-gradient(to right, #9333ea, #4f46e5)",
                color: "white",
                borderRadius: "8px",
                "&:hover": {
                  background: "linear-gradient(to right, #7e22ce, #4338ca)",
                },
                "&:disabled": {
                  background: "#e0e0e0",
                  color: "#9e9e9e",
                },
              }}
            >
              送信
            </Button>
          </Box>

          {/* コメント一覧 */}
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              返信
            </Typography>

            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} sx={{ color: "#9333EA" }} />
              </Box>
            ) : comments.length > 0 ? (
              comments.map((comment, index) => (
                <Box key={index} sx={{ display: "flex", mb: 2 }}>
                  <Avatar
                    src={comment.user_img_url}
                    sx={{ width: 32, height: 32, mr: 1, bgcolor: "#9333EA" }}
                  />
                  <Box
                    sx={{
                      bgcolor: "#f5f5f5",
                      p: 1.5,
                      borderRadius: 2,
                      flexGrow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {comment.user_name || "ユーザー"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {comment.created_at
                          ? new Date(comment.created_at).toLocaleString(
                              "ja-JP",
                              {
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : ""}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{comment.comment}</Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", py: 1 }}
              >
                まだ返信はありません。最初の返信を投稿しましょう！
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PostItem;
