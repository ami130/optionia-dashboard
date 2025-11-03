import { Space, Image, Tooltip } from "antd";
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
      render: (role) => role?.name,
    },

    {
      key: "5",
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
      key: "6",
      title: "linkedin",
      dataIndex: "linkedinProfile",
      align: "center",
    },
    {
      title: "Actions",
      align: "center",
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
