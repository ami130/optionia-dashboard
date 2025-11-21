import { Space, Image, Tooltip, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import EditButton from "../../../common/CommonAnt/Button/EditButton";
import { showModal } from "../../../app/features/modalSlice";
import UpdateUSer from "../components/UpdateUser";
import { usePermission } from "../../../app/utils/usePermissions";
import { moduleNames } from "../../../utilities/permissionConstant";
import { baseUrl } from "../../../utilities/baseQuery";

const useUserColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();
  const { canUpdate } = usePermission(moduleNames.users);

  return [
    {
      key: "0",
      title: "SL",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      key: "1",
      title: "Image",
      dataIndex: "profileImage",
      align: "center",
      width: 100,
      render: (imagePath: string) =>
        imagePath ? (
          <Image
            src={`${baseUrl}${imagePath}`}
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          ""
        ),
    },
    {
      key: "2",
      title: "Username",
      dataIndex: "username",
      align: "center",
    },
    {
      key: "3",
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
    {
      key: "4",
      title: "Role",
      dataIndex: "role",
      align: "center",
      render: (role) => role?.name || "-",
    },
    {
      key: "5",
      title: "Designation",
      dataIndex: "designation",
      align: "center",
      render: (designation: string) => designation || "-",
    },
    {
      key: "6",
      title: "Expertise",
      dataIndex: "expertise",
      align: "center",
      render: (expertise: string[]) => {
        if (!expertise || expertise.length === 0) return "-";

        // Show first 2 items, rest in tooltip
        const visibleItems = expertise.slice(0, 2);
        const hiddenItems = expertise.slice(2);

        return (
          <Tooltip
            title={
              <div>
                {expertise.map((item, index) => (
                  <div key={index}>• {item}</div>
                ))}
              </div>
            }
          >
            <Space wrap size={[4, 4]}>
              {visibleItems.map((item, index) => (
                <Tag key={index} color="blue" style={{ margin: 0 }}>
                  {item}
                </Tag>
              ))}
              {hiddenItems.length > 0 && (
                <Tag color="default">+{hiddenItems.length} more</Tag>
              )}
            </Space>
          </Tooltip>
        );
      },
    },
    {
      key: "7",
      title: "Bio",
      dataIndex: "bio",
      align: "center",
      render: (text: string) => {
        const displayText =
          text && text.length > 20 ? text.slice(0, 20) + "..." : text;
        return text ? <Tooltip title={text}>{displayText}</Tooltip> : "-";
      },
    },
    {
      key: "8",
      title: "LinkedIn",
      dataIndex: "linkedinProfile",
      align: "center",
      render: (linkedin: string) =>
        linkedin ? (
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            Profile
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Actions",
      align: "center",
      fixed: "right",
      width: 100,
      render: (record) => (
        <Space>
          {canUpdate && (
            <EditButton
              onClick={() =>
                dispatch(
                  showModal({
                    title: "Update User",
                    content: <UpdateUSer record={record} />,
                  })
                )
              }
            />
          )}
        </Space>
      ),
    },
  ];
};

export default useUserColumns;
