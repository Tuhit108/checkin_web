import Location from "views/Location.js";
import Client from "views/Client";
import UserList from "views/UserList.js";
import CheckinHistory from "views/CheckinHistory.js";
import Request from "views/Request.js";
import Setting from "./views/Setting";
import UserDetail from "./views/UserDetail";

const dashboardRoutes = [
  {
    path: "/client",
    name: "Client",
    icon: "nc-icon nc-chart-pie-35",
    component: Client,
    layout: "/admin"
  },
  {
    path: "/location",
    name: "Location",
    icon: "nc-icon nc-chart-pie-35",
    component: Location,
    layout: "/admin"
  },
  {
    path: "/users",
    name: "Quản lý người dùng",
    icon: "nc-icon nc-paper-2",
    component: UserList,
    layout: "/admin",
    exact: true
  },
  {
    path: "/history",
    name: "Lịch sử check-in",
    icon: "nc-icon nc-notes",
    component: CheckinHistory,
    layout: "/admin"
  },
  {
    path: "/request",
    name: "Đề xuất",
    icon: "nc-icon nc-circle-09",
    component: Request,
    layout: "/admin"
  },
  {
    path: "/settings",
    name: "Cài đặt",
    icon: "nc-icon nc-settings-gear-64",
    component: Setting,
    layout: "/admin"
  },
  {
    path: "/users/:id",
    name: "",
    icon: "",
    component: UserDetail,
    layout: "/admin"
  }
];

export default dashboardRoutes;
