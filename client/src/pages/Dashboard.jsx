// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Button, Typography, Container, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }
        const res = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth-change"));
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Dispatch custom event to notify App.jsx
    window.dispatchEvent(new Event("auth-change"));
    navigate("/", { replace: true });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, rgba(15,23,36,1) 0%, rgba(26,32,44,1) 100%)",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: 920,
            mx: "auto",
            p: { xs: 3, sm: 6 },
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.04)",
            color: "common.white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
                }}
              >
                Welcome{user ? `, ${user.name}` : ""} 🎉
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "grey.300",
                  mb: 2,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                }}
              >
                {loading ? "Loading your data..." : "You have successfully logged in."}
              </Typography>
              
              {user && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.400",
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  }}
                >
                  Email: {user.email}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 3,
                  fontWeight: 700,
                  background:
                    "linear-gradient(90deg, rgba(30,60,114,1) 0%, rgba(42,82,152,1) 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, rgba(42,82,152,1) 0%, rgba(30,60,114,1) 100%)",
                  },
                }}
              >
                LOGOUT
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;