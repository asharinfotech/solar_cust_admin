import { Admin, Resource, ListGuesser, CustomRoutes, Layout, AppBar,fetchUtils } from "react-admin";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { Typography } from "@mui/material";

import AdminLogin from "./admin/adminlogin.jsx";
import LogoutButton from "./admin/logoutbutton.jsx";

import { SolaruserList } from "./solarhomeuser/homeuserlist.jsx";
import { SolaruserEdit } from "./solarhomeuser/homeuseredit.jsx";
import { AboutUsList } from "./aboutus/list.jsx";
import { AboutUsEdit } from "./aboutus/edit.jsx";
import { AboutUsCreate } from "./aboutus/create.jsx";
import { SiteContentEdit } from "./profile/edit.jsx";
import { SiteContentList } from "./profile/list.jsx";
import { LogoUpload } from "./profile/Logoupload.jsx";
import { ProjectList } from "./project/list.jsx";
import { ProjectEdit } from "./project/edit.jsx";
import { ProjectCreate } from "./project/projectcreate.jsx";
import { ArticleList } from "./article/articlelist.jsx";
import { ArticleEdit } from "./article/articleedit.jsx";
import { ArticleCreate } from "./article/articlecreate.jsx";
import { CarouselList } from "./carouselImage/carousellist.jsx";
import { CarouselCreate } from "./carouselImage/carouselcreate.jsx";
import { CarouselEdit } from "./carouselImage/carouseledit.jsx";
import { UserList } from "./query/list.jsx";
import { UserEdit } from "./query/edit.jsx";
import { ADMIN_URL } from "./constant.js";

// Replace with your backend API
const apiUrl = `${ADMIN_URL}`;

// Your dataProvider (unchanged)
const myDataProvider = { 
   // ✅ GET LIST
  getList: async (resource, params) => {
  const url = `${apiUrl}/${resource}.php`;
  const { json, headers } = await fetchUtils.fetchJson(
    `${url}?filter=${encodeURIComponent(
      JSON.stringify(params.filter || {})
    )}&range=${encodeURIComponent(
      JSON.stringify(
        params.pagination
          ? [
              (params.pagination.page - 1) * params.pagination.perPage,
              params.pagination.page * params.pagination.perPage - 1,
            ]
          : [0, 9]
      )
    )}&sort=${encodeURIComponent(JSON.stringify(params.sort || {}))}`
  );

  const dataArray = Array.isArray(json) ? json : json.data || [];
  const totalCount =
    headers.has("content-range")
      ? parseInt(headers.get("content-range").split("/").pop(), 10)
      : json.total || dataArray.length || 0;

  return {
    data: dataArray,
    total: totalCount,
  };


  },

  getOne: async (resource, params) => {
  const url = `${apiUrl}/${resource}.php?id=${params.id}`;
  const { json } = await fetchUtils.fetchJson(url);
  return { data: json.data || json }; // ✅ unwraps the inner data
},


 update: async (resource, params) => {
    const url = `${apiUrl}/${resource}.php`;
    const payload = { ...params.data, id: params.id };

    const options = {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: new Headers({ "Content-Type": "application/json" }),
    };

    const { json } = await fetchUtils.fetchJson(url, options);

    // Return the object inside json.data, which includes the id
    return { data: json.data };
},


  // ✅ DELETE
  delete: async (resource, params) => {
    const url = `${apiUrl}/${resource}.php?id=${params.id}`;
    const options = {
      method: "DELETE",
      headers: new Headers({ "Content-Type": "application/json" }),
    };
    const { json } = await fetchUtils.fetchJson(url, options);
    return { data: json };
  },

  // ✅ CREATE
  create: async (resource, params) => {
    const url = `${apiUrl}/${resource}.php`;
    const options = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(params.data),
    };
    const { json } = await fetchUtils.fetchJson(url, options);

    // React Admin needs { data: { id, ... } }
    return { data: json.data || json };
  },
 };

const history = createBrowserHistory();

// Custom AppBar with Logout Button
const MyAppBar = (props) => (
  <AppBar {...props}>
    <Typography variant="h6" color="inherit" sx={{ flex: 1 }}>
      Admin Dashboard
    </Typography>
    <LogoutButton />
  </AppBar>
);

// Custom Layout using MyAppBar
const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

// Admin Panel
const AdminPanel = () => (
  <Admin
    dataProvider={myDataProvider}
    basename="/admin-dashboard"
    history={history}
    layout={MyLayout}  // Use custom layout with logout button
  >
    {/* Resources */}
    {/* <Resource name="users" list={ListGuesser} /> */}
    <Resource name="solarUsers" list={SolaruserList} edit={SolaruserEdit} />
    <Resource name="aboutUs" list={AboutUsList} edit={AboutUsEdit} create={AboutUsCreate} />
    <Resource name="site_settings" list={SiteContentList} edit={SiteContentEdit} />
    <Resource name="projects" list={ProjectList} edit={ProjectEdit} create={ProjectCreate} />
    <Resource name="articles" list={ArticleList} edit={ArticleEdit} create={ArticleCreate} />
    <Resource name="carousel" list={CarouselList} create={CarouselCreate} edit={CarouselEdit} />
    <Resource name="user_queries" list={UserList} edit={UserEdit} />

    {/* Custom Routes */}
    <CustomRoutes>
      <Route path="/upload-logo" element={<LogoUpload />} />
    </CustomRoutes>
  </Admin>
);

// AdminApp with authentication and redirects
const AdminApp = () => {
  const isAuthenticated = !!localStorage.getItem("adminToken");

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Redirects for convenience */}
        <Route path="/users" element={<Navigate to="/admin-dashboard/users" replace />} />
        <Route path="/solarUsers" element={<Navigate to="/admin-dashboard/solarUsers" replace />} />
        <Route path="/aboutUs" element={<Navigate to="/admin-dashboard/aboutUs" replace />} />
        <Route path="/site_settings" element={<Navigate to="/admin-dashboard/site_settings" replace />} />
        <Route path="/projects" element={<Navigate to="/admin-dashboard/projects" replace />} />
        <Route path="/articles" element={<Navigate to="/admin-dashboard/articles" replace />} />
        <Route path="/carousel" element={<Navigate to="/admin-dashboard/carousel" replace />} />
        <Route path="/user_queries" element={<Navigate to="/admin-dashboard/user_queries" replace />} />

        {/* Admin dashboard route */}
        <Route
          path="/admin-dashboard/*"
          element={isAuthenticated ? <AdminPanel /> : <Navigate to="/admin-login" />}
        />

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/admin-dashboard" : "/admin-login"} />}
        />
      </Routes>
    </Router>
  );
};

export default AdminApp;
