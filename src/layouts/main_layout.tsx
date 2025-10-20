import { Box } from "@mui/material";
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
      ></Box>
      <Sidebar />
    </>
  );
};

export default MainLayout;
