import CssBaseline from "@mui/material/CssBaseline";
import SideMenu from "../components/SideMenu";
import { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { Navigate } from "react-router-dom";
import ShowGroups from "../components/ShowGroups.tsx";
import ShowTransaction from "../components/ShowTransaction.tsx";
import ShowExchange from "../components/ShowExchange.tsx";
import SpendingForm from "../components/SpendingForm.tsx";
import ShowSpending from "../components/ShowSpending.tsx";
import { Grid2 } from "@mui/material";
import GroupForm from "../components/GroupForm.tsx";

function DashboardRouter() {
  const { login } = useContext(UserContext);

  // State to track active menu item
  const [activeItem, setActiveItem] = useState<string | null>("Groups");
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshSpendings = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const refreshGroups = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  if (!login) {
    return <Navigate to="/login" />;
  }

  const renderButtons = () => {
    switch (activeItem) {
      case "Groups":
        return (
          <Grid2 container spacing={2} sx={{ mt: 0, alignItems: "flex-start" }}>
            <Grid2>
              <ShowGroups key={refreshKey}/>
            </Grid2>
            <Grid2>
              <GroupForm  refreshGroups={refreshGroups}/>
            </Grid2>
          </Grid2>
        )
      case "Spendings":
        return (
          <Grid2 container spacing={2} sx={{ mt: 0, alignItems: "flex-start" }}>
            <Grid2>
              <ShowSpending key={refreshKey}/>
            </Grid2>
            <Grid2 sx={{ marginTop: "-20px" }}>
              <SpendingForm refreshSpendings={refreshSpendings} />
            </Grid2>
          </Grid2>

        );
      case "Transaction":
        return (
          <Grid2 container spacing={2} sx={{ mt: 0, alignItems: "flex-start" }}>
            <Grid2>
              <ShowTransaction />
            </Grid2>
          </Grid2>
        );
      case "Currency Exchange":
        return (
          <Grid2 sx={{ marginTop: "-20px" }}>
            <ShowExchange />
          </Grid2>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CssBaseline />
      <Grid2 container sx={{ height: "100vh" }}>
        {/* Sidebar */}
        <Grid2>
          <SideMenu activeItem={activeItem} setActiveItem={setActiveItem} />
        </Grid2>

        {/* Main Content */}
        <Grid2 sx={{ p: 2 }}>
          {renderButtons()}
        </Grid2>
      </Grid2>
    </>
  );
}

export default DashboardRouter;
