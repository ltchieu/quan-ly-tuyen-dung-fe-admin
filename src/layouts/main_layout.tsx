import { Box, Button, SxProps, Typography } from "@mui/material";
import React from "react";
import Sidebar from "../components/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const SIDEBAR_WIDTH = 290;
const HEADER_HEIGHT = "18.75rem";

const MainLayout = () => {
  const authButtonStyle: SxProps = {
    "@keyframes sh02": {
      from: {
        opacity: 0,
        left: "0%",
      },
      "50%": {
        opacity: 1,
      },
      to: {
        opacity: 0,
        left: "100%",
      },
    },


    position: "relative",
    padding: "10px 20px",
    borderRadius: "7px",
    fontSize: "14px",
    textTransform: "none",
    fontWeight: 600,
    letterSpacing: "2px",
    background: "transparent",
    color: "#fff",
    overflow: "hidden",
    boxShadow: "0 0 0 0 transparent",
    WebkitTransition: "all 0.2s ease-in",
    MozTransition: "all 0.2s ease-in",
    transition: "all 0.2s ease-in",

    "&::before": {
      content: '""',
      display: "block",
      width: "0px",
      height: "86%",
      position: "absolute",
      top: "7%",
      left: "0%",
      opacity: 0,
      background: "#fff",
      boxShadow: "0 0 50px 30px #fff",
      WebkitTransform: "skewX(-20deg)",
      MozTransform: "skewX(-20deg)",
      msTransform: "skewX(-20deg)",
      OTransform: "skewX(-20deg)",
      transform: "skewX(-20deg)",
    },

    "&:hover": {
      background: "rgb(61, 106, 255)",
      boxShadow: "0 0 30px 5px rgba(0, 142, 236, 0.815)",
      WebkitTransition: "all 0.2s ease-out",
      MozTransition: "all 0.2s ease-out",
      transition: "all 0.2s ease-out",

      "&::before": {
        WebkitAnimation: "sh02 0.5s 0s linear",
        MozAnimation: "sh02 0.5s 0s linear",
        animation: "sh02 0.5s 0s linear",
      },
    },

    "&:active": {
      boxShadow: "0 0 0 0 transparent",
      WebkitTransition: "box-shadow 0.2s ease-in",
      MozTransition: "box-shadow 0.2s ease-in",
      transition: "box-shadow 0.2s ease-in",
    },
  };
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Sidebar />
      <Box
        component="main"
        sx={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        }}
      >
        <Box
          sx={{
            padding: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Box sx={{ textAlign: "left" }}>
              <Box display="flex">
                <Typography
                  variant="body1"
                  color="white"
                  sx={{ opacity: 0.5, mr: 1 }}
                >
                  Pages{" "}
                </Typography>
                <span style={{ opacity: 1, color: "white" }}> / Dashboard</span>
              </Box>

              <Typography variant="h6" color="white" fontWeight="bold">
                Dashboard
              </Typography>
            </Box>

            {accessToken ? (
              <Button onClick={handleLogout} sx={{ ...authButtonStyle }}>
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                sx={{ ...authButtonStyle }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ padding: 3 }}>
          <Outlet></Outlet>
        </Box>
      </Box>

      <Box
        component="div"
        sx={{
          backgroundColor: "#5e72e4",
          position: "absolute",
          minHeight: HEADER_HEIGHT,
          width: "100%",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
    </>
  );
};

export default MainLayout;
