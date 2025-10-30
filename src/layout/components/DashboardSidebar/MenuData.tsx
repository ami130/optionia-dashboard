import { Menu, MenuProps } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Iconify from "../../../common/IconifyConfig/IconifyConfig";
import SidebarTop from "./SidebarTop";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { ThemesTypes } from "../../../app/features/themeSlice";
import SidebarButtom from "./SidebarButtom";
import { hasPermissionForModule } from "../../../utilities/permission";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { LiaProductHunt } from "react-icons/lia";
import { IoCartOutline } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { useGetProfileQuery } from "../../../modules/Profile/api/profileEndpoint";

const MenuData: React.FC = () => {
  const { themes } = useSelector<RootState, ThemesTypes>(
    (state) => state.themes
  );
  const { pathname } = useLocation();
  const { data: profileData } = useGetProfileQuery();

  // const { data: dashboardData } = useGetDashboardDataQuery({});

  const permissions =
    profileData?.data?.roleModulePermissions ??
    profileData?.data?.role?.roleModulePermissions ??
    [];

  const iconStyle: React.CSSProperties | undefined = {
    marginRight: "8px",
    color: themes === "light" ? "#000000" : "#FFFFFF",
  };

  const Optionia = [
    {
      key: "/website-info",
      label: <Link to="/website-info">Website Info</Link>,
      icon: <LiaProductHunt />,
    },
    {
      key: "/pages",
      label: <Link to="/pages">Pages</Link>,
      icon: <LiaProductHunt />,
    },
    hasPermissionForModule(permissions, "users") && {
      key: "/users",
      label: <Link to="/users">Users</Link>,
      icon: <LiaProductHunt />,
    },
    {
      key: "blog",
      label: "Blog",
      icon: <HiOutlineDocumentReport style={iconStyle} />,
      children: [
        hasPermissionForModule(permissions, "category") && {
          key: "/category",
          label: <Link to="/category">Category</Link>,
          icon: <LiaProductHunt style={iconStyle} />,
        },
        hasPermissionForModule(permissions, "tag") && {
          key: "/tag",
          label: <Link to="/tag">Tag</Link>,
          icon: <LiaProductHunt style={iconStyle} />,
        },
      ].filter(Boolean),
    },
    {
      key: "role-permission",
      label: "Role & Permission",
      icon: <HiOutlineDocumentReport style={iconStyle} />,
      children: [
        hasPermissionForModule(permissions, "role") && {
          key: "/role/list",
          label: <Link to="/role/list">Role</Link>,
          icon: <LiaProductHunt style={iconStyle} />,
        },
        hasPermissionForModule(permissions, "role") && {
          key: "/role/module",
          label: <Link to="/role/module">Module</Link>,
          icon: <LiaProductHunt style={iconStyle} />,
        },
      ].filter(Boolean),
    },

    // ---------------------------
    hasPermissionForModule(permissions, "student") && {
      key: "/products",
      label: <Link to="/products">Products</Link>,
      icon: <LiaProductHunt />,
    },
    hasPermissionForModule(permissions, "student") && {
      key: "/orders",
      label: <Link to="/orders">Orders</Link>,
      icon: <IoCartOutline />,
    },
    hasPermissionForModule(permissions, "student") && {
      key: "/earning-report",
      label: <Link to="/earning-report">Earning / Report</Link>,
      icon: <HiOutlineDocumentReport />,
    },
    hasPermissionForModule(permissions, "student") && {
      key: "/profile-setting",
      label: <Link to="/profile-setting">Profile Setting</Link>,
      icon: <HiOutlineDocumentReport />,
    },
  ].filter(Boolean);

  const items: MenuProps["items"] = [
    {
      key: "/",
      label: <Link to="/">Dashboard</Link>,
      icon: <Iconify name="mage:dashboard" style={iconStyle} />,
    },
  ];

  return (
    <div className="dashboard-sidebar-style">
      <div>
        <SidebarTop />
        <span className="features-title text-blue-500">Main Menu</span>
        <div>
          <Menu
            style={{
              backgroundColor: "transparent",
            }}
            mode="inline"
            theme={themes}
            selectedKeys={[pathname]}
            items={items}
          />
        </div>

        <div>
          <Menu
            style={{
              backgroundColor: "transparent",
            }}
            mode="inline"
            theme={themes}
            selectedKeys={[pathname]}
            items={Optionia.filter(Boolean) as ItemType<MenuItemType>[]}
          />
        </div>
      </div>

      <br />
      <br />

      <SidebarButtom />
    </div>
  );
};

export default MenuData;
