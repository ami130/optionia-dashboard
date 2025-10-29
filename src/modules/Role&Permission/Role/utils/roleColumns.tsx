import { message, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import { showModal } from "../../../../app/features/modalSlice";
import ViewButton from "../../../../common/CommonAnt/Button/ViewButton";
import ViewRole from "../components/ViewRole";
import { useGetModuleQuery } from "../../Module/api/moduleEndPoints";
import { useCreateRoleAssignWithPermissionMutation } from "../api/roleEndPoints";
import { UpdateRole } from "../components/UpdateRole";

const useRoleColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();
  const [createRoleAssignWithPermission] =
    useCreateRoleAssignWithPermissionMutation();

  const { data: modulesData } = useGetModuleQuery<any>({});

  const handleRoleSubmit = async (payload: any) => {
    try {
      // Send JSON directly
      await createRoleAssignWithPermission(payload).unwrap();
      message.success("Role Updated successfully!");
    } catch (err: any) {
      message.error(err?.data?.message || "Something went wrong");
    }
  };

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
      title: "Name",
      dataIndex: "name",
      align: "center",
    },
    {
      key: "2",
      title: "Slug",
      dataIndex: "slug",
      align: "center",
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
                  title: "Update Role",
                  content: (
                    <UpdateRole
                      record={record}
                      modules={modulesData?.data || []} // all modules
                      onSubmit={handleRoleSubmit} // same handler as create
                    />
                  ),
                })
              )
            }
          />

          <ViewButton
            onClick={() =>
              dispatch(
                showModal({
                  title: " Role View",
                  content: <ViewRole record={record} />,
                })
              )
            }
          />

          {/* <DeleteButton
            onConfirm={() => handleDelete(record.id)}
          ></DeleteButton> */}
        </Space>
      ),
    },
  ];
};

export default useRoleColumns;
