import { Button, Space, Tag } from "antd";

import type { ColumnsType } from "antd/es/table";
import ViewButton from "../../../../common/CommonAnt/Button/ViewButton";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import { useDispatch } from "react-redux";
import { showModal } from "../../../../app/features/modalSlice";
import UpdateTeacher from "../components/UpdateTeacher";
import { useGetDashboardDataQuery } from "../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../utilities/permissionConstant";
import DeleteButton from "../../../../common/CommonAnt/Button/DeleteButton";
import { useDeleteTeacherMutation } from "../api/teachersEndPoints";
import dayjs from "dayjs";
import FingerAdmission from "../../../general settings/admission/components/FingerAdmission";
import { FaFingerprint } from "react-icons/fa6";

const useTeacherColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();

  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.teacher,
    actionNames.change
  );

  const [deleteTeacherItem] = useDeleteTeacherMutation();

  const deletePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.teacher,
    actionNames.delete
  );

  const handleDelete = async (id: any) => {
    try {
      await deleteTeacherItem({ id }).unwrap();
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
      title: "Full Name",
      dataIndex: "first_name",
      width: 200,
      align: "left",
      render: (_: any, record: any) =>
        `${record?.first_name} ${record?.last_name}`,
    },
    {
      key: "2",
      title: "UserID",
      dataIndex: "user",
      align: "center",
      width: 100,
      sorter: (a, b) => a.user?.username?.localeCompare(b.user?.username || ""),
      render: (name) => (name ? name?.username : "-"),
    },
    {
      key: "33",
      title: "Working Hour",
      dataIndex: "schedule",
      align: "center",
      width: 200,
      render: (schedule) =>
        schedule ? (
          <>
            {`${dayjs(schedule?.start_time, "HH:mm:ss").format(
              "hh:mm A"
            )} - ${dayjs(schedule?.end_time, "HH:mm:ss").format("hh:mm A")}`}
          </>
        ) : (
          "-"
        ),
    },
    {
      key: "4",
      title: "Phone",
      dataIndex: "phone_number",
      align: "center",
      width: 150,
      render: (phone_number) => (phone_number ? phone_number : "-"),
    },
    {
      key: "5",
      title: "Hire Date",
      dataIndex: "hire_date",
      align: "center",
      sorter: (a, b) =>
        new Date(a.hire_date || 0).getTime() -
        new Date(b.hire_date || 0).getTime(),
      render: (hire_date) =>
        hire_date ? dayjs(hire_date).format("DD MMMM YYYY") : "-",
    },
    {
      key: "6",
      title: "Base Salary",
      dataIndex: "base_salary",
      align: "center",
      width: 150,
      render: (base_salary) => (base_salary ? base_salary : "-"),
    },

    {
      key: "7",
      title: "Active",
      dataIndex: "is_active",
      align: "center",
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
          {updatePermission && (
            <EditButton
              onClick={() =>
                dispatch(
                  showModal({
                    title: "Update Teacher",
                    content: <UpdateTeacher record={record} />,
                  })
                )
              }
            />
          )}

          <ViewButton to={`teacher-view/${record?.id}`} />

          <Button
            title="Start Enrollment"
            size="small"
            type="default"
            style={{
              color: "green",
              // background: "#3892E3",
              border: "1px solid green",
            }}
            onClick={() =>
              dispatch(
                showModal({
                  title: "Start Enrollment",
                  content: (
                    <FingerAdmission
                      record={record?.id}
                      pathType={window.location.pathname}
                    />
                  ),
                })
              )
            }
          >
            <FaFingerprint />
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

export default useTeacherColumns;
