import { Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import { showModal } from "../../../../app/features/modalSlice";
import { useDispatch } from "react-redux";
import dayjs from "dayjs"; // For formatting dates
import { useGetDashboardDataQuery } from "../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../utilities/permissionConstant";
import DeleteButton from "../../../../common/CommonAnt/Button/DeleteButton";
import { useDeleteHolidayMutation } from "../api/holidayEndPoints";
import UpdateHoliday from "../components/UpdateHoliday";
import { capitalize } from "../../../../common/capitalize/Capitalize";
import { FaEye } from "react-icons/fa6";
import ViewHoliday from "../components/ViewHoliday";

const useHolidayColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();

  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.noticeboard,
    actionNames.change
  );

  const [deleteItem] = useDeleteHolidayMutation();

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
      dataIndex: "name",
      align: "center",
      render: (title) => (title ? capitalize(title) : "-"),
    },
    // {
    //   key: "2",
    //   title: "Description",
    //   dataIndex: "description",
    //   align: "center",
    //   sorter: (a, b) =>
    //     (a.description || "").localeCompare(b.description || ""),
    //   render: (description) => (description ? description : "-"),
    // },
    {
      key: "3",
      title: "Event For",
      dataIndex: "event_for_display",
      align: "center",
      render: (event_for_display) =>
        event_for_display ? event_for_display : "-",
    },
    {
      key: "4",
      title: "Event Type",
      dataIndex: "event_type_display",
      align: "center",

      render: (event_type_display) =>
        event_type_display ? event_type_display : "-",
    },
    // {
    //   key: "5",
    //   title: "Published Status",
    //   dataIndex: "is_published",
    //   align: "center",
    //   sorter: (a, b) => Number(b.is_published) - Number(a.is_published),
    //   render: (is_published) =>
    //     is_published ? (
    //       <Tag color="green">Published</Tag>
    //     ) : (
    //       <Tag color="red">Unpublished</Tag>
    //     ),
    // },
    {
      key: "6",
      title: "Start Date",
      dataIndex: "start_date",
      align: "center",
      sorter: (a, b) =>
        dayjs(a.start_date || 0).unix() - dayjs(b.start_date || 0).unix(),
      render: (date) => (date ? dayjs(date).format("DD MMM YYYY") : "-"),
    },
    {
      key: "7",
      title: "End Date",
      dataIndex: "end_date",
      align: "center",
      sorter: (a, b) =>
        dayjs(a.end_date || 0).unix() - dayjs(b.end_date || 0).unix(),
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
                    title: "Update Holiday",
                    content: <UpdateHoliday record={record?.id} />,
                  })
                )
              }
            />
          )}

          <Button
            size="small"
            type="default"
            onClick={() =>
              dispatch(
                showModal({
                  title: "View Holiday / Events",
                  content: <ViewHoliday record={record?.id} />,
                })
              )
            }
            style={{
              color: "#3892E3",
              border: "1px solid #3892E3",
            }}
          >
            <FaEye /> 
          </Button>

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

export default useHolidayColumns;
