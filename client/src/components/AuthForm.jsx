// client/src/components/AuthForm.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Signup
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === 1) {
        // Signup
        await api.post("/auth/signup", form);
        alert("Signup successful! You can login now.");
        setTab(0);
        setForm({ name: "", email: "", password: "" });
      } else {
        // Login
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        
        // Store token
        localStorage.setItem("token", res.data.token);
        
        // Dispatch custom event to notify App.jsx
        window.dispatchEvent(new Event("auth-change"));
        
        // Navigate to dashboard
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: {
          xs: "linear-gradient(180deg,#0b1220 0%, #11263f 100%)",
          md: "linear-gradient(135deg, #0f1724 0%, #1f3a6f 35%, #2a5298 100%)",
        },
        backgroundSize: "cover",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={14}
          sx={{
            width: "100%",
            maxWidth: 760,
            borderRadius: 3,
            overflow: "hidden",
            px: { xs: 3, sm: 6 },
            py: { xs: 4, sm: 6 },
            backgroundColor: "rgba(255,255,255,0.95)",
            boxShadow: "0 12px 40px rgba(2,6,23,0.35)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            textAlign="center"
            fontWeight={800}
            sx={{ mb: 1, fontSize: { xs: "1.35rem", sm: "1.6rem", md: "1.9rem" } }}
          >
            {tab === 0 ? "Login" : "Create your account"}
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {tab === 0
              ? "Welcome back — please enter your details."
              : "Join us — fill the form to create an account."}
          </Typography>

          <Tabs
            value={tab}
            onChange={(e, v) => {
              setTab(v);
              setError(""); // Clear error when switching tabs
              setForm({ name: "", email: "", password: "" }); // Reset form
            }}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3, "& .MuiTab-root": { textTransform: "none", fontWeight: 700 } }}
          >
            <Tab label="LOGIN" />
            <Tab label="SIGN UP" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {tab === 1 && (
              <TextField
                name="name"
                value={form.name}
                onChange={handleChange}
                label="Full name"
                placeholder="Your full name"
                fullWidth
                required
                disabled={loading}
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 50 }}
              />
            )}

            <TextField
              name="email"
              value={form.email}
              onChange={handleChange}
              label="Email"
              placeholder="you@example.com"
              type="email"
              fullWidth
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              name="password"
              value={form.password}
              onChange={handleChange}
              label="Password"
              placeholder="At least 6 characters"
              type="password"
              fullWidth
              required
              disabled={loading}
              inputProps={{ minLength: 6 }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                borderRadius: 2,
                py: { xs: 1.25, sm: 1.5 },
                fontWeight: 800,
                background: "linear-gradient(90deg,#1e3c72,#2a5298)",
                boxShadow: "0 10px 28px rgba(42,82,152,0.28)",
                "&:hover": {
                  background: "linear-gradient(90deg,#2a5298,#1e3c72)",
                },
              }}
            >
              {loading ? "PLEASE WAIT..." : tab === 0 ? "LOGIN" : "CREATE ACCOUNT"}
            </Button>
          </Box>

          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            mt={3}
            color="text.secondary"
          >
            By continuing you agree to our Terms & Privacy.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthForm;