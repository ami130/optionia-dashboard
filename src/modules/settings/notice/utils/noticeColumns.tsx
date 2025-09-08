import { Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import { showModal } from "../../../../app/features/modalSlice";
import { useDispatch } from "react-redux";
import dayjs from "dayjs"; // For formatting dates
import UpdateNotice from "../components/UpdateNotice";
import { useGetDashboardDataQuery } from "../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../utilities/permissionConstant";
import { useDeleteNoticeMutation } from "../api/noticeEndPoints";
import DeleteButton from "../../../../common/CommonAnt/Button/DeleteButton";

const useNoticeColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();

  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.noticeboard,
    actionNames.change
  );

  const [deleteItem] = useDeleteNoticeMutation();

  const deletePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.noticeboard,
    actionNames.delete
  );

  const handleDelete = async (id: any) => {
    try {
      await deleteItem({ id }).unwrap();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

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
      align: "left",
      width: 400,
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
      render: (title) => (title ? title : "-"),
    },
    {
      key: "3",
      title: "Category",
      dataIndex: "category",
      align: "center",
      width: 130,
      sorter: (a, b) => (a.category || "").localeCompare(b.category || ""),
      render: (category) => (category ? category : "-"),
    },
    {
      key: "4",
      title: "Target Audience",
      dataIndex: "target_audience",
      align: "center",
      width: 200,
      sorter: (a, b) =>
        (a.target_audience || "").localeCompare(b.target_audience || ""),
      render: (audience) => (audience ? audience : "-"),
    },
    {
      key: "5",
      title: "Published Status",
      dataIndex: "is_published",
      align: "center",
      width: 180,
      sorter: (a, b) => Number(b.is_published) - Number(a.is_published),
      render: (is_published) =>
        is_published ? (
          <Tag color="green">Published</Tag>
        ) : (
          <Tag color="red">Unpublished</Tag>
        ),
    },
    {
      key: "6",
      title: "Publish Date",
      dataIndex: "publish_date",
      align: "center",
      width: 150,
      sorter: (a, b) =>
        dayjs(a.publish_date || 0).unix() - dayjs(b.publish_date || 0).unix(),
      render: (date) => (date ? dayjs(date).format("DD MMM YYYY") : "-"),
    },
    {
      key: "7",
      title: "Expiry Date",
      dataIndex: "expiry_date",
      align: "center",
      width: 150,
      sorter: (a, b) =>
        dayjs(a.expiry_date || 0).unix() - dayjs(b.expiry_date || 0).unix(),
      render: (date) => (date ? dayjs(date).format("DD MMM YYYY") : "-"),
    },
    {
      key: "8",
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space>
          {updatePermission && (
            <EditButton
              onClick={() =>
                dispatch(
                  showModal({
                    title: "Update Notice",
                    content: <UpdateNotice record={record?.id} />,
                  })
                )
              }
            />
          )}
          {deletePermission && (
            <DeleteButton
              onConfirm={() => handleDelete(record.id)}
            ></DeleteButton>
          )}
        </Space>
      ),
    },
  ];
};

export default useNoticeColumns;
