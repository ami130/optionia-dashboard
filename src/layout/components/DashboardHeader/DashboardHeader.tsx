import {
  Button,
  Flex,
  Image,
  Layout,
  Popover,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React from "react";
import Iconify from "../../../common/IconifyConfig/IconifyConfig";
import { useDispatch, useSelector } from "react-redux";
import { loggedOut } from "../../../app/features/authSlice";
import { TOKEN_NAME } from "../../../utilities/baseQuery";
import { Link, useNavigate } from "react-router-dom";
import { greeting } from "../../../utilities/helper";
import { RootState } from "../../../app/store";
import { toggleThemes } from "../../../app/features/themeSlice";
import { avatar } from "../../../utilities/images";
import { useGetProfileQuery } from "../../../modules/Profile/api/profileEndpoint";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardHeader: React.FC<Props> = ({ setOpen }) => {
  const { themes, darkColor } = useSelector((state: RootState) => state.themes);
  const { data } = useGetProfileQuery();

  console.log(data?.data?.username);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    dispatch(loggedOut());
    localStorage.removeItem(TOKEN_NAME);
    navigate("/login");
  };

  return (
    <React.Fragment>
      <Layout.Header
        id="dashboard-header"
        style={{
          background: themes === "light" ? "white" : darkColor,
        }}
      >
        {" "}
        <Flex align="center" justify="center" gap={8}>
          <Button
            onClick={() => setOpen(true)}
            type="primary"
            ghost
            size="large"
            icon={<Iconify name="pepicons-pop:menu" />}
            id="dashboard-header-icon"
          />
          <div>
            <Typography.Text
              strong
              style={{
                display: "flex",
                fontSize: "1.2rem",
              }}
            >
              Hello, {data?.data?.username}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              style={{ display: "block", lineHeight: 0.6, fontSize: "11px" }}
            >
              {greeting()}
            </Typography.Text>
          </div>
        </Flex>
        {/* <Flex align="center" justify="center">
          <Input
            placeholder="Search"
            prefix={<CiSearch />}
            style={{ width: "300px" }}
            className="search-section"
          />
        </Flex> */}
        <Flex align="center" justify="center" gap={20}>
          {/* <Badge count={17}>
            <Popover
              content={
                <List
                  itemLayout="vertical"
                  renderItem={() => <List.Item></List.Item>}
                />
              }
              trigger="click"
              placement="bottomRight"
            >
              <Button
                type="default"
                shape="circle"
                icon={<Iconify name="ant-design:bell-outlined" />}
              />
            </Popover>
          </Badge> */}

          <Tooltip
            title={themes === "light" ? "Dark Mode" : "Light Mode"}
            placement="bottomRight"
          >
            <Button
              type="default"
              shape="circle"
              onClick={() => dispatch(toggleThemes())}
              icon={
                <Iconify
                  name={
                    themes === "light"
                      ? "material-symbols:light-mode"
                      : "material-symbols-light:dark-mode-outline"
                  }
                />
              }
            />
          </Tooltip>

          <Popover
            content={
              <Space
                direction="vertical"
                style={{
                  height: 180,
                  width: 230,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Image
                  src={avatar}
                  alt="Profile picture"
                  preview={false}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "100%",
                    pointerEvents: "none",
                  }}
                />
                <Typography.Text strong>
                  {data?.data?.username}{" "}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: "11px" }}>
                  {/* info.codecanvascreation . */}
                </Typography.Text>
                <Space>
                  <Link to="/profile">
                    <Button
                      block
                      type="link"
                      ghost
                      icon={<Iconify name="uil:user" />}
                    >
                      Profile
                    </Button>
                  </Link>

                  <Button
                    block
                    type="link"
                    ghost
                    danger
                    icon={<Iconify name="hugeicons:logout-05" />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Space>
              </Space>
            }
            trigger="click"
            placement="bottomRight"
          >
            <Button
              type="default"
              shape="circle"
              icon={<Iconify name="ph:user" />}
            />
          </Popover>
        </Flex>
      </Layout.Header>
    </React.Fragment>
  );
};

export default DashboardHeader;
