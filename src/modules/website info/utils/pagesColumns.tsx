import { Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ViewButton from "../../../common/CommonAnt/Button/ViewButton";

import { useNavigate } from "react-router-dom";
import { useGetDashboardDataQuery } from "../../Dashboard/api/dashoboardEndPoints";

import DeleteButton from "../../../common/CommonAnt/Button/DeleteButton";
import EditButton from "../../../common/CommonAnt/Button/EditButton";
import { useDeletePagesMutation } from "../api/websiteInfoEndPoints";
import { showModal } from "../../../app/features/modalSlice";
import ViewPage from "../components/ViewPage";
import { useDispatch } from "react-redux";
import UpdatePage from "../components/UpdateWebsiteInfo";

const usePagesColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: dashboardData } = useGetDashboardDataQuery({});
  const [deleteCartItem] = useDeletePagesMutation();

  const handleDelete = async (id: any) => {
    try {
      await deleteCartItem({ id }).unwrap();
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
    },
    {
      key: "2",
      title: "URL",
      dataIndex: "url",
      align: "center",
    },
    {
      key: "3",
      title: "Type",
      dataIndex: "type",
      align: "center",
    },
    {
      key: "4",
      title: "Order",
      dataIndex: "order",
      align: "center",
    },
    {
      key: "6",
      title: "Active",
      dataIndex: "isActive",
      align: "center",
      width: 100,
      render: (is_active) =>
        is_active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
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
                  title: "Update Page",
                  content: <UpdatePage id={record?.id} />,
                })
              )
            }
          />
          <ViewButton
            onClick={() =>
              dispatch(
                showModal({
                  title: " Page View",
                  content: <ViewPage id={record?.id} />,
                })
              )
            }
          />

          <DeleteButton
            onConfirm={() => handleDelete(record.id)}
          ></DeleteButton>
        </Space>
      ),
    },
  ];
};

export default usePagesColumns;
