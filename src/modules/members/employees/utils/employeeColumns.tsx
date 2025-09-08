import { Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ViewButton from "../../../../common/CommonAnt/Button/ViewButton";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import { useDispatch } from "react-redux";
import { showModal } from "../../../../app/features/modalSlice";
import UpdateEmployee from "../components/UpdateEmployee";
import { useGetDepartmentQuery } from "../../../general settings/Department/api/departmentEndPoints";
import { useGetDashboardDataQuery } from "../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../utilities/permissionConstant";
import { useDeleteEmployeeMutation } from "../api/employeeEndPoints";
import DeleteButton from "../../../../common/CommonAnt/Button/DeleteButton";
import FingerAdmission from "../../../general settings/admission/components/FingerAdmission";
import { FaFingerprint } from "react-icons/fa6";
import dayjs from "dayjs";

const useEmployeeColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();

  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.employee,
    actionNames.change
  );

  const { data: departmentList } = useGetDepartmentQuery({});

  const departmentFilters = Array.isArray(departmentList?.data)
    ? departmentList.data.map((dept: any) => ({
        text: dept.name,
        value: dept.name,
      }))
    : [];

  const [deleteItem] = useDeleteEmployeeMutation();

  const deletePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.employee,
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
      render: (user) => (user ? user.username : "-"),
    },
    {
      key: "33",
      title: "Working Hour",
      dataIndex: "schedule",
      width: 170,
      align: "center",
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
      width: 130,
      render: (phone_number) => (phone_number ? phone_number : "-"),
    },
    {
      key: "5",
      title: "Position",
      dataIndex: "position",
      align: "center",
      width: 150,
      render: (position) => (position ? position : "-"),
    },
    {
      key: "66",
      title: "Base Salary",
      dataIndex: "base_salary",
      align: "center",
      width: 100,
      render: (Base_salary) => (Base_salary ? Base_salary : "-"),
    },
    {
      key: "6",
      title: "Department",
      dataIndex: ["department", "name"],
      align: "center",
      width: 150,
      showSorterTooltip: { target: "full-header" },
      filters: departmentFilters.length > 0 ? departmentFilters : undefined,
      onFilter: (value, record) => record?.department?.name === value,
      // sorter: (a, b) => a?.department?.name?.localeCompare(b?.department?.name),
      render: (department) => (department ? department : "-"),
    },
    {
      key: "7",
      title: "Hire Date",
      dataIndex: "hire_date",
      align: "center",
      width: 150,
      sorter: (a, b) =>
        new Date(a.hire_date || 0).getTime() -
        new Date(b.hire_date || 0).getTime(),
      render: (hire_date) =>
        hire_date ? dayjs(hire_date).format("DD MMM YYYY") : "-",
    },
    {
      key: "8",
      title: "Active",
      dataIndex: "is_active",
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
          {updatePermission && (
            <EditButton
              onClick={() =>
                dispatch(
                  showModal({
                    title: "Update Employee",
                    content: <UpdateEmployee records={record} />,
                  })
                )
              }
            />
          )}

          <ViewButton to={`employee-view/${record?.id}`} />

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

export default useEmployeeColumns;
