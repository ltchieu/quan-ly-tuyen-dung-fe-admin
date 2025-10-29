import {
  Box,
  BoxProps,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import logo from "../img/logo.png";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faTv,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

type Props = {};

const Sidebar = (props: Props) => {
  const location = useLocation();

  const navItems = [
    { text: "Overview", icon: <FontAwesomeIcon icon={faTv} />, path: "/" },
    {
      text: "Khách hàng",
      icon: <FontAwesomeIcon icon={faUsers} />,
      path: "/users",
    },
    {
      text: "Jobs",
      icon: <FontAwesomeIcon icon={faFolder} />,
      path: "/job",
    },
  ];

  const rowContainerProps: BoxProps = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  };

  const columnContainerProps: BoxProps = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Box
      component="aside"
      sx={{
        position: "fixed",
        margin: "1rem 0 1rem 1.5rem",
        backgroundColor: "#fffffff8",
        borderRadius: "1rem",
        zIndex: "990",
        height: "90%"
      }}
    >
      <Box sx={{ padding: "10px", width: "256px" }}>
        <Box {...rowContainerProps} sx={{ gap: 2, mb: 1 }}>
          <Box component="img" src={logo} width="25%" />
          <Box>
            <Typography
              variant="h6"
              component="a"
              href="/"
              sx={{
                fontWeight: "bold",
                color: "#344767",
                cursor: "pointer",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              JobFinder Dashboard
            </Typography>
          </Box>
        </Box>

        <Divider />

        <List>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                to={item.path}
                key={item.text}
                style={{ textDecoration: "none" }}
              >
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      backgroundColor: isActive ? "#d1d8ffff" : "transparent",
                      width: "100%",
                      "&:hover": {
                        backgroundColor: "#e3e7ffff",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#5e72e4" : "#9CA3AF",
                        minWidth: "auto",
                        mr: 2,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        "& .MuiTypography-root": {
                          color: "#344767",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
