import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import React from "react";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

type SideMenuProps = {
  activeItem: string | null;
  setActiveItem: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function SideMenu({ activeItem, setActiveItem }: SideMenuProps) {
  const { login } = useContext(UserContext);

  return (
    <Drawer
      variant="permanent"
      sx={{
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Typography variant="h4" component="h1" sx={{ color: "text.primary" }}>
        MintTrack
      </Typography>
      <Divider />
      <MenuContent activeItem={activeItem} setActiveItem={setActiveItem} />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {login?.Name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {login?.PhoneNumber}
          </Typography>
        </Box>
      </Stack>
    </Drawer>
  );
}

