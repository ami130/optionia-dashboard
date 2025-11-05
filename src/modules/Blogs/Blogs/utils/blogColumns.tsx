import { Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import { showModal } from "../../../../app/features/modalSlice";
import { usePermission } from "../../../../app/utils/usePermissions";
import { moduleNames } from "../../../../utilities/permissionConstant";
import ViewBlogs from "../components/ViewBlogs";
import ViewButton from "../../../../common/CommonAnt/Button/ViewButton";
import UpdateBlog from "../components/UpdateBlog";

const useBlogColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();
  const { canUpdate } = usePermission(moduleNames.blog);

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
      title: "Title",
      dataIndex: "title",
      align: "center",
    },
    {
      key: "2",
      title: "Slug",
      dataIndex: "slug",
      align: "center",
      width: 300,
    },
    {
      key: "4",
      title: "Category",
      dataIndex: "category",
      align: "center",
      render: (text) => <span>{text.name} </span>,
    },
    {
      key: "3",
      title: "Reading Time",
      dataIndex: "readingTime",
      align: "center",
      render: (text) => <span>{text} Minutes</span>,
    },
    {
      key: "5",
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (text) => <Tag color="green">{text}</Tag>,
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
                    title: "Update Blog",
                    content: <UpdateBlog record={record} />,
                  })
                )
              }
            />
          )}

          <ViewButton to={`/blog/${record?.slug}`} />

          {/* <DeleteButton
            onConfirm={() => handleDelete(record.id)}
          ></DeleteButton> */}
        </Space>
      ),
    },
  ];
};

export default useBlogColumns;
