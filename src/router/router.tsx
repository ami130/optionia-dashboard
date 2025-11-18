import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layout/page/DashboardLayout";
import ErrorPage from "../common/ErrorPage/ErrorPage";
import Login from "../modules/Auth/page/Login";
import Dashboard from "../modules/Dashboard/page/Dashboard";
import Profile from "../modules/Profile/page/Profile";
import Accounts from "../modules/Accounts/pages/Accounts";
import BalanceStatus from "../modules/Accounts/components/BalanceStatus/BalanceStatus";
import ClientAccount from "../modules/Accounts/components/ClientAccount/ClientAccount";
import SendOTP from "../modules/Auth/components/SendOTP";
import MatchOTP from "../modules/Auth/components/MatchOTP";
import ForgotPassword from "../modules/Auth/components/ForgotPassword";
import SecondLogin from "../modules/Auth/page/SecondLogin";
import Verification from "../modules/Auth/components/Verification";
import PrivateRouter from "./PrivateRouter";
import RolePermissionPage from "../modules/settings/role & permission/page/RolePermissionPage";
import ViewRolePermission from "../modules/settings/role & permission/components/ViewRolePermission";

import WithPermission from "./withPermissionRouter";
import PagesPage from "../modules/Pages/pages/PagesPage";
import CreatePages from "../modules/Pages/components/CreatePages";
import WebsiteInfoPage from "../modules/website info/pages/WebsiteInfoPage";
import ModulePage from "../modules/Role&Permission/Module/pages/ModulePage";
import RolePage from "../modules/Role&Permission/Role/pages/RolePage";
import UserPage from "../modules/User/pages/UserPage";
import CategoriesPage from "../modules/Blogs/Categories/pages/CategoriesPage";
import TagsPage from "../modules/Blogs/Tag/pages/TagsPage";
import { moduleNames } from "../utilities/permissionConstant";
import BlogsPage from "../modules/Blogs/Blogs/pages/BlogsPage";
import ViewBlogs from "../modules/Blogs/Blogs/components/ViewBlogs";
import CreateBlog from "../modules/Blogs/Blogs/components/CreateBlog";
import EditTermCondition from "../modules/settings/termsConditions/components/EditTermCondition";
import EditPrivacyPolicy from "../modules/settings/privacy policy/components/EditPrivacyPolicy";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <DashboardLayout />,
    element: <PrivateRouter children={<DashboardLayout />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },

      // PAGES
      {
        path: "/pages",
        element: <Accounts />,
        children: [
          {
            path: "/pages",
            element: <PagesPage />,
          },
          {
            path: "create",
            element: <CreatePages />,
          },
          // {
          //   path: "update/:orderId",
          //   element: <UpdateOrder />,
          // },
        ],
      },

      // Users
      {
        path: "/users",
        element: (
          <WithPermission requiredPermission="users">
            <Accounts />
          </WithPermission>
        ),
        children: [
          {
            path: "/users",
            element: <UserPage />,
          },

          // {
          //   path: "update/:orderId",
          //   element: <UpdateOrder />,
          // },
        ],
      },

      // Website Info
      {
        path: "/website-info",
        element: <Accounts />,
        children: [
          {
            path: "/website-info",
            element: <WebsiteInfoPage />,
          },
        ],
      },

      // Categories
      {
        path: "/category",
        element: (
          <WithPermission requiredPermission="category">
            <CategoriesPage />
          </WithPermission>
        ),
      },

      // Tags
      {
        path: "/tag",
        element: (
          <WithPermission requiredPermission={moduleNames.tag}>
            <TagsPage />
          </WithPermission>
        ),
      },
      // Blogs
      {
        path: "/blog",
        element: (
          <WithPermission requiredPermission={moduleNames.blog}>
            <BlogsPage />
          </WithPermission>
        ),
      },
      {
        path: "/blog/create",
        element: <CreateBlog />,
      },
      {
        path: "/blog/:slug",
        element: <ViewBlogs />,
      },
      // terms & conditions
      {
        path: "/settings",
        element: (
          <WithPermission requiredPermission={moduleNames.blog}>
            <Accounts />
          </WithPermission>
        ),
      },
      {
        path: "/settings/terms-condition",
        element: <EditTermCondition />,
      },
      {
        path: "/settings/privacy-policy",
        element: <EditPrivacyPolicy />,
      },
      // {
      //   path: "/blog/:slug",
      //   element: <ViewBlogs />,
      // },
      // {
      //   path: "/blog",
      //   element: <Accounts />,
      //   // element: <Accounts />,
      //   children: [
      //     {
      //       path: "/categories",
      //       element: (
      //         <WithPermission requiredPermission="category">
      //           <Accounts />
      //         </WithPermission>
      //       ),
      //     },
      //     {
      //       path: "/role/list",
      //       element: <RolePage />,
      //     },
      //   ],
      // },

      // Role And Module
      {
        path: "/role",
        element: (
          <WithPermission requiredPermission="role">
            <Accounts />
          </WithPermission>
        ),
        // element: <Accounts />,
        children: [
          {
            path: "/role/module",
            element: <ModulePage />,
          },
          {
            path: "/role/list",
            element: <RolePage />,
          },
        ],
      },

      // Role & permissions
      {
        path: "/role-permission",
        element: (
          <WithPermission requiredPermission="role">
            <Accounts />
          </WithPermission>
        ),
        children: [
          {
            path: "",
            element: <RolePermissionPage />,
          },
          {
            path: ":roleId",
            element: <ViewRolePermission />,
          },
        ],
      },

      {
        path: "/account",
        element: <Accounts />,
        children: [
          {
            path: "balance-status",
            element: <BalanceStatus />,
          },

          {
            path: "client-account",
            element: <ClientAccount />,
          },
        ],
      },
      // _______________________________________________________________________________________________________________
      // new for education

      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login-second",
    element: <SecondLogin />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verification",
    element: <Verification />,
  },
  {
    path: "/send-otp",
    element: <SendOTP />,
  },
  {
    path: "/match-otp",
    element: <MatchOTP />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

export default router;
