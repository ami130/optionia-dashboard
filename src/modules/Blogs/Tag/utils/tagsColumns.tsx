import { Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import { showModal } from "../../../../app/features/modalSlice";
import { usePermission } from "../../../../app/utils/usePermissions";
import { moduleNames } from "../../../../utilities/permissionConstant";
import UpdateTags from "../components/UpdateTags";

const useTagsColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();
  const { canUpdate } = usePermission(moduleNames.tag);

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
          {canUpdate && (
            <EditButton
              onClick={() =>
                dispatch(
                  showModal({
                    title: "Update Tags",
                    content: <UpdateTags record={record} />,
                  })
                )
              }
            />
          )}

          {/* <DeleteButton
            onConfirm={() => handleDelete(record.id)}
          ></DeleteButton> */}
        </Space>
      ),
    },
  ];
};

export default useTagsColumns;
