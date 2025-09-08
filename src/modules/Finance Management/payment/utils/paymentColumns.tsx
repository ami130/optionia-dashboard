import { Button, Space } from "antd";

import type { ColumnsType } from "antd/es/table";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import { useDispatch } from "react-redux";
import { showModal } from "../../../../app/features/modalSlice";
import ViewButton from "../../../../common/CommonAnt/Button/ViewButton";
import UpdatePayment from "../components/UpdatePayment";
import { useGetDashboardDataQuery } from "../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../utilities/permissionConstant";
import DeleteButton from "../../../../common/CommonAnt/Button/DeleteButton";
import {
  useDeletePaymentMutation,
  useLazyGetSinglePaymentFormQuery,
} from "../api/paymentEndPoints";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";

const usePaymentColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();

  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.payment,
    actionNames.change
  );

  const [deleteItem] = useDeletePaymentMutation();

  const deletePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.payment,
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

  const [getPaymentForm, { data: singleFeeForm }] =
    useLazyGetSinglePaymentFormQuery();

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
    getPaymentForm(id);
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
      title: "Name",
      dataIndex: "payroll",
      align: "left",
      width: 200,
      render: (payroll) => {
        if (payroll?.employee) {
          return `${payroll?.employee?.first_name} ${payroll?.employee?.last_name}`;
        } else if (payroll?.teacher) {
          return `${payroll?.teacher?.first_name} ${payroll?.teacher?.last_name}`;
        }
        return "-";
      },
    },

    {
      key: "1",
      title: "Period Date",
      dataIndex: "payroll",
      align: "center",
      width: 200,
      render: (_, record) =>
        record
          ? dayjs(record?.period_start).format("DD MMM YY") +
            " - " +
            dayjs(record?.period_end).format("DD MMM YY")
          : "-",
      sorter: (a, b) => a?.period_start.localeCompare(b?.period_start),
    },
    {
      key: "1",
      title: "Payment Date",
      dataIndex: "payment_date",
      align: "center",
      render: (payroll) => (payroll ? dayjs(payroll).format("DD MMM YY") : "-"),
    },
    {
      key: "1",
      title: "Attendance Days",
      dataIndex: "payroll",
      align: "center",
      width: 150,
      render: (payroll) => (payroll ? payroll?.attendance_days : "-"),
    },
    {
      key: "1",
      title: "Net Salary",
      dataIndex: "payroll",
      align: "center",
      render: (payroll) => (payroll ? payroll?.net_salary : "-"),
    },
    {
      key: "1",
      title: "Paid Amount",
      dataIndex: "amount_paid",
      align: "center",
      render: (amount) => (amount ? amount : "-"),
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
                    title: "Update Payment",
                    content: <UpdatePayment record={record?.id} />,
                  })
                )
              }
            />
          )}
          <ViewButton to={`payment-view/${record?.id}`} />{" "}
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
          {deletePermission && (
            <DeleteButton
              disabled
              onConfirm={() => handleDelete(record.id)}
            ></DeleteButton>
          )}
        </Space>
      ),
    },
  ];
};

export default usePaymentColumns;
