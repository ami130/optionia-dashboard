import { Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { showModal } from "../../../../app/features/modalSlice";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import ViewButton from "../../../../common/CommonAnt/Button/ViewButton";
import UpdatePayroll from "../components/UpdatePayroll";
import dayjs from "dayjs";
import { useGetDashboardDataQuery } from "../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../utilities/permissionConstant";
import { useDeletePayrollMutation } from "../api/payrollEndPoints";
import DeleteButton from "../../../../common/CommonAnt/Button/DeleteButton";
import { FaFilePdf } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useLazyGetCollectSingleFeesFormQuery } from "../../Fees/Collect Fee/api/collectFeeEndPoints";

const usePayrollColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();

  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.payroll,
    actionNames.change
  );

  const [deleteItem] = useDeletePayrollMutation();

  const deletePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.payroll,
    actionNames.delete
  );

  const handleDelete = async (id: any) => {
    try {
      await deleteItem({ id }).unwrap();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const [pdfTitle, setPdfTitle] = useState<string>("Invoice PDF");

  const [getCollectFeeForm, { data: singleFeeForm }] =
    useLazyGetCollectSingleFeesFormQuery();

  useEffect(() => {
    if (singleFeeForm) {
      const url = URL.createObjectURL(singleFeeForm);

      const newWindow = window.open("", "_blank");

      if (newWindow) {
        newWindow.document.write(`
        <html>
          <head>
            <title>${pdfTitle}</title>
          </head>
          <body style="margin:0">
            <iframe 
              src="${url}" 
              frameborder="0" 
              style="width:100%;height:100vh;"
            ></iframe>
          </body>
        </html>
      `);
        newWindow.document.close();
      }

      // ✅ Cleanup only this URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [singleFeeForm, pdfTitle]); // ✅ Removed pdfUrl!

  const handleForm = (id: number) => {
    setPdfTitle(`${id} `);
    getCollectFeeForm(id);
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
      dataIndex: "employee",
      align: "left",
      width: 200,
      render: (employee, record) => {
        if (employee) {
          return `${employee?.first_name} ${employee?.last_name}`;
        } else if (record?.teacher) {
          return `${record?.teacher?.first_name} ${record?.teacher?.last_name}`;
        }
        return "-";
      },
      sorter: (a, b) => {
        const nameA = `${a?.employee?.first_name} ${a?.employee?.last_name}`;
        const nameB = `${b?.employee?.first_name} ${b?.employee?.last_name}`;
        return nameA.localeCompare(nameB); // Sort alphabetically by full name
      },
    },
    {
      key: "11",
      title: "Period Date",
      dataIndex: "period_start",
      align: "center",
      width: 200,
      render: (_, record) =>
        record
          ? dayjs(record?.period_start).format("DD MMM YY") +
            " - " +
            dayjs(record?.period_end).format("DD MMM YY")
          : "-",
      sorter: (a, b) => a?.period_start.localeCompare(b?.period_start), // Sort by start date
    },
    {
      key: "2",
      title: "Department",
      dataIndex: "employee",
      align: "center",
      width: 120,
      render: (employee) =>
        employee?.department?.name ? employee.department.name : "Teacher",
      sorter: (a, b) => {
        const deptA = a?.employee?.department?.name || "Teacher";
        const deptB = b?.employee?.department?.name || "Teacher";
        return deptA.localeCompare(deptB); // Sort alphabetically by department name
      },
    },
    {
      key: "3",
      title: "Gross Salary",
      dataIndex: "gross_salary",
      align: "center",
      width: 150,
      render: (gross_salary) => `৳ ${gross_salary.toFixed(2)}`,
      sorter: (a, b) => a.gross_salary - b.gross_salary, // Sort by gross salary (numeric)
    },
    {
      key: "4",
      title: "Net Salary",
      dataIndex: "net_salary",
      align: "center",
      width: 150,
      render: (net_salary) => `৳${net_salary.toFixed(2)}`,
      sorter: (a, b) => a.net_salary - b.net_salary, // Sort by net salary (numeric)
    },
    {
      key: "5",
      title: "Paid",
      dataIndex: "paid_Amount",
      align: "center",
      render: (paid_Amount) => `৳ ${paid_Amount.toFixed(2)}`,
      sorter: (a, b) => a.paid_Amount - b.paid_Amount, // Sort by paid amount (numeric)
    },
    {
      key: "6",
      title: "Due",
      dataIndex: "due_Amount",
      align: "center",
      render: (due_Amount) => `৳ ${due_Amount.toFixed(2)}`,
      sorter: (a, b) => a.due_Amount - b.due_Amount, // Sort by due amount (numeric)
    },
    {
      key: "9",
      title: "Status",
      dataIndex: "status",
      width: 120,
      align: "center",
      render: (status: string) => {
        let color = "default";
        if (status === "pending") color = "red";
        else if (status === "partial") color = "blue";
        else if (status === "paid") color = "green";

        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },

    {
      key: "7",
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space>
          {updatePermission && (
            <EditButton
              onClick={() =>
                dispatch(
                  showModal({
                    title: "Update Payroll",
                    content: <UpdatePayroll record={record?.id} />,
                  })
                )
              }
            />
          )}

          <ViewButton to={`payroll-view/${record?.id}`} />
          {deletePermission && (
            <DeleteButton
              disabled
              onConfirm={() => handleDelete(record.id)}
            ></DeleteButton>
          )}
          <Button
            title="Invoice"
            size="small"
            type="default"
            style={{
              color: "#c20a0a",
              border: "1px solid gray",
            }}
            onClick={() => handleForm(record.id)}
          >
            <FaFilePdf />
          </Button>
        </Space>
      ),
    },
  ];
};

export default usePayrollColumns;
