import { useEffect, useState } from "react";
import HomeHeader from "../components/common/HomeHeader";
import Dashboard from "../components/dashboard/Dashboard";
import Fleets from "./../components/dashboard/Fleets";
import Vehicles from "./../components/dashboard/Vehicles";
import Drivers from "./../components/dashboard/Drivers";
import SideMenu from "../components/dashboard/SideMenu";
import Settings from "./../components/dashboard/Settings";
import Rides from "./../components/dashboard/Rides";
import Documents from "./../components/dashboard/Documents";
import LiveMap from "./../components/dashboard/LiveMap";
import Reports from "./../components/dashboard/Reports";
import Zones from "./../components/dashboard/Zones";
import Campaigns from "./../components/dashboard/Campaigns";
import Balance from "./../components/dashboard/Balance";
import Intercity from "../components/dashboard/Intercity";
import { generateToken, messaging } from "../firebase";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from "react-hot-toast";
import Organisations from "../components/dashboard/Organisations";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [notification, setnotification] = useState(null);
  const [showsidebar, setshowsidebar] = useState(false);

  const handleMenuItemClick = (itemName) => {
    setActiveComponent(itemName);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return (
          <Dashboard
            onMenuItemClick={handleMenuItemClick}
            activeItem={activeComponent}
          />
        );
      case "Fleets":
        return <Fleets />;
      case "Organisations":
        return <Organisations/>;
      case "Vehicles":
        return <Vehicles />;
      case "Drivers":
        return <Drivers />;
      case "Rides":
        return <Rides />;
      case "Live Map":
        return <LiveMap />;
      case "Zones":
        return <Zones />;
      case "Intercity":
        return <Intercity />;
      case "Reports":
        return <Reports />;
      case "Documents":
        return <Documents />;
      case "Campaigns":
        return <Campaigns />;
      case "Balance":
        return <Balance />;
      case "Settings":
        return <Settings />;
      default:
        return null;
    }
  };

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
      setnotification(payload.notification.body);
    });
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <HomeHeader
        notification={notification}
        showsidebar={showsidebar}
        setshowsidebar={setshowsidebar}
      />
      <Toaster />
      <div className="flex flex-grow overflow-y-auto">
        <div
          className={`absolute sm:relative z-50 h-full w-2/5 sm:w-1/5 max-w-[280px] ${
            showsidebar ? "block" : "hidden"
          } md:block text-white overflow-y-auto`}
        >
          <SideMenu
            onMenuItemClick={handleMenuItemClick}
            activeItem={activeComponent}
          />
        </div>
        <div className="w-4/5 flex-1 p-4 overflow-y-auto">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default Home;
