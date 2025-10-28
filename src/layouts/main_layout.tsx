import { Box, Button, Typography } from "@mui/material";
import React from "react";
import Sidebar from "../components/sidebar";

type Props = {};

const MainLayout = (props: Props) => {
  return (
    <>
      <Box
        component="div"
        sx={{
          backgroundColor: "#5e72e4",
          position: "absolute",
          minHeight: "18.75rem",
          width: "100%",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Pages / <span>Dashboard</span>
          </Typography>
          <Typography variant="h5">
            Dashboard
          </Typography>
          <Button
            sx={{
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: 17,
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
      <Sidebar />
    </>
  );
};

export default MainLayout;
