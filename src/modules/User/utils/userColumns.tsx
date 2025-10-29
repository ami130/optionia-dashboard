import { Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import UpdateModule from "../components/UpdateUser";
import EditButton from "../../../common/CommonAnt/Button/EditButton";
import { showModal } from "../../../app/features/modalSlice";
import UpdateUSer from "../components/UpdateUser";

const useUserColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();

  // const { data: dashboardData } = useGetDashboardDataQuery({});
  // const [deleteCartItem] = useDeleteModuleMutation();

  // const handleDelete = async (id: any) => {
  //   try {
  //     await deleteCartItem({ id }).unwrap();
  //   } catch (error) {
  //     console.error("Failed to delete item:", error);
  //   }
  // };

  return [
    {
      key: "0",
      title: "SL",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      key: "1",
      title: "Username",
      dataIndex: "username",
      align: "center",
    },
    {
      key: "2",
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
    {
      key: "2",
      title: "Role",
      dataIndex: "role",
      align: "center",
      render: (data) => data.name,
    },

    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space>
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
          {/* <ViewButton
            onClick={() =>
              dispatch(
                showModal({
                  title: " Page View",
                  content: <ViewPage id={record?.id} />,
                })
              )
            }
          /> */}

          {/* <DeleteButton
            onConfirm={() => handleDelete(record.id)}
          ></DeleteButton> */}
        </Space>
      ),
    },
  ];
};

export default useUserColumns;
