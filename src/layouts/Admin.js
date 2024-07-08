
import React, {Component, useEffect, useRef, useState} from "react";
import { useLocation, Route, Switch } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";

import routes from "routes.js";
import sidebarImage from "assets/img/sidebar-3.jpg";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {syncAllUsers} from "../store/user";
import {requestAddUser, requestAllUser} from "../store/user/function";
function Admin() {
  const [image, setImage] = useState(sidebarImage);
  const [color, setColor] = useState("black");
  const [hasImage, setHasImage] =useState(true);
  const location = useLocation();
  const history = useHistory();
  const mainPanel = useRef(null);
  const userData = JSON.parse(localStorage.getItem('userData') || "");

  if (!userData) {
    history.push('/login');
    return;
  }
  useEffect(() => {
    requestAllUser().then()
  }, []);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
            exact={prop.exact}
          />
        );
      } else {
        return null;
      }
    });
  };
  // React.useEffect(() => {
  //   document.documentElement.scrollTop = 0;
  //   document.scrollingElement.scrollTop = 0;
  //   mainPanel.current.scrollTop = 0;
  //   if (
  //     window.innerWidth < 993 &&
  //     document.documentElement.className.indexOf("nav-open") !== -1
  //   ) {
  //     document.documentElement.classList.toggle("nav-open");
  //     var element = document.getElementById("bodyClick");
  //     element.parentNode.removeChild(element);
  //   }
  // }, [location]);
  // useEffect(() => {
  //   requestAllLocation().then()
  //   requestAllCheckins().then()
  // }, [])

  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
        <div className="main-panel" ref={mainPanel} style={{ display: "flex", flexDirection: 'column' }}>
          <AdminNavbar />
          <div style={{ flex: 1 }}>
            <Switch>{getRoutes(routes)}</Switch>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Admin;
