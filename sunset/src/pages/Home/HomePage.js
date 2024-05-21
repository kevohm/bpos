import React, { useContext } from "react";
import "./home.scss";
import { AuthContext } from "../../AuthContext/AuthContext";
import Management from "../../components/Widgets/Management";
import TableSummary from "../../components/Widgets/TableSummary";
import MainShow from "../../MainShow/MainShow";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import AdminHomeRoutes from "../../Administrator/AdminHomeRoutes/AdminHomeRoutes";

function HomePage() {
  const { user } = useContext(AuthContext);
 
  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div className="Products">
            {user && user.role === "NormalUser" && (
              <div style={{ paddingTop: "5px", paddingBottom: "0%" }}>
                <MainShow />
              </div>
            )}
            {user && user.role === "Admin" && (
              <div style={{ marginTop: "50px" }}>
                <TableSummary />
                <AdminHomeRoutes />
                <Management />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
