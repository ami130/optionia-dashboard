import { Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import { showModal } from "../../../../app/features/modalSlice";
import { useDispatch } from "react-redux";
import UpdateLeave from "../components/UpdateLeave";
import { GetPermission } from "../../../../utilities/permission";
import { useGetDashboardDataQuery } from "../../../Dashboard/api/dashoboardEndPoints";
import {
  actionNames,
  moduleNames,
} from "../../../../utilities/permissionConstant";
import { useDeleteLeavesMutation } from "../api/leaveEndPoints";
import DeleteButton from "../../../../common/CommonAnt/Button/DeleteButton";

const useLeaveColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const [deleteItem] = useDeleteLeavesMutation();

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.admissionleave,
    actionNames.change
  );

  const deletePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.admissionleave,
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
      title: "Student Name",
      dataIndex: "admission",
      align: "left",
      width: 200,
      render: (title) =>
        title
          ? title?.student?.first_name + " " + title?.student?.last_name
          : "-",
    },
    {
      key: "3",
      title: "Session",
      dataIndex: "admission",
      align: "center",
      render: (title) => (title ? title?.session?.name : "-"),
    },
    {
      key: "22",
      title: "Class",
      dataIndex: "admission",
      align: "center",
      render: (title) => (title ? title?.grade_level : "-"),
    },
    {
      key: "2",
      title: "Section",
      dataIndex: "admission",
      align: "center",
      render: (title) => (title ? title?.section?.name : "-"),
    },

    {
      key: "4",
      title: "Leave Type",
      dataIndex: "leave_type",
      align: "center",
      render: (title) => (title ? title : "-"),
    },
    {
      key: "5",
      title: "Duration",
      dataIndex: "duration",
      align: "center",
      render: (type) => {
        if (type === "F") return "Full Day";
        if (type === "H") return "Half Day";
        if (type === "M") return "Multiple Days";
        return "-";
      },
    },

    {
      key: "6",
      title: "Start Date",
      dataIndex: "start_date",
      align: "center",
      width: 150,
      render: (date) =>
        date
          ? new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(new Date(date))
          : "-",
    },
    {
      key: "7",
      title: "End Date",
      dataIndex: "end_date",
      align: "center",
      width: 150,
      render: (date) =>
        date
          ? new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(new Date(date))
          : "-",
    },

    {
      key: "7",
      title: "Reason",
      dataIndex: "reason",
      align: "center",
      render: (title) => (title ? title : "-"),
    },
    {
      key: "8",
      title: "Status",
      dataIndex: "is_approved",
      align: "center",
      width: 100,
      render: (isApproved: boolean) =>
        isApproved ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="red">Rejected</Tag>
        ),
    },
    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space>
          {updatePermission && (
            <EditButton
              onClick={() =>
                dispatch(
                  showModal({
                    title: "Update Leave",
                    content: <UpdateLeave record={record?.id} />,
                  })
                )
              }
            />
          )}
          {/* <ViewButton to={`student-view/1`} />
          <DeleteButton
          onClick={() => handleDelete(record.id)}>
            Delete
          </DeleteButton> */}

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

export default useLeaveColumns;
