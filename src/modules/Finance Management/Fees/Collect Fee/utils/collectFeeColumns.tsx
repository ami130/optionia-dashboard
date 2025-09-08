import { Button, Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useLazyGetCollectSingleFeesFormQuery } from "../api/collectFeeEndPoints";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import ViewButton from "../../../../../common/CommonAnt/Button/ViewButton";
import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { useGetDashboardDataQuery } from "../../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../../utilities/permissionConstant";
import { TbCoinTaka } from "react-icons/tb";

const useCollectFeeColumns = (): ColumnsType<any> => {
  const navigate = useNavigate();
  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.fees,
    actionNames.change
  );

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
      title: "Name",
      dataIndex: "admission",
      align: "left",
      width: 150,
      render: (admission: any) =>
        admission ? (
          <Link
            to={`/admission/admission-view/${admission.id}`}
            className="text-green-500"
          >
            {admission.student?.first_name} {admission.student?.last_name}
          </Link>
        ) : (
          "-"
        ),
    },
    {
      key: "4",
      title: "UserID",
      dataIndex: "admission",
      align: "center",
      width: 80,
      render: (title) => (title ? title.student?.user?.username : "-"),
    },
    {
      key: "111115",
      title: "Session",
      dataIndex: "admission",
      align: "center",
      width: 80,
      render: (title) => (title ? title?.session?.name : "-"),
    },
    {
      key: "2",
      title: "Phone",
      dataIndex: "admission",
      align: "center",
      width: 120,
      render: (admission) => {
        const phone = admission?.student?.phone_number;
        return phone ? phone.replace(/^880/, "0") : "-";
      },
    },
    {
      key: "5",
      title: "Class",
      dataIndex: "admission",
      align: "center",
      width: 80,
      render: (title) => (title ? title.grade_level : "-"),
    },
    {
      key: "6",
      title: "Month",
      dataIndex: "month",
      align: "center",
      width: 100,
      render: (month) => (month ? dayjs(month).format("MMMM") : "-"),
    },
    {
      key: "8",
      title: "Amount",
      dataIndex: "total_paid",
      align: "center",
      width: 80,
      render: (title) => (title ? title : "0"),
    },
    {
      key: "99",
      title: "Net Amount",
      dataIndex: "net_amount",
      align: "center",
      width: 100,
      render: (title) => (title ? title : "0"),
    },
    {
      key: "9",
      title: "Discount",
      dataIndex: "total_discount",
      align: "center",
      width: 80,
      render: (title) => (title ? title : "0"),
    },
    {
      key: "10",
      title: "Payment Date",
      dataIndex: "payment_date",
      align: "center",
      width: 120,
      render: (month) => (month ? dayjs(month).format("DD MMM YYYY") : "-"),
    },
    {
      key: "11",
      title: "Due Amount",
      dataIndex: "total_due",
      align: "center",
      width: 100,
      render: (amount) => (amount ? amount : "0"),
    },
    {
      key: "110",
      title: "Total Amount",
      dataIndex: "total_amount",
      align: "center",
      width: 120,
      render: (amount) => (amount ? amount : "0"),
    },
    {
      key: "110",
      title: "Status",
      dataIndex: "status",
      align: "center",
      width: 80,
      render: (status) => {
        if (!status) return <Tag color="cyan">-</Tag>;
        const value = String(status).toLowerCase();
        if (value === "paid") {
          return <Tag color="green">Paid</Tag>;
        } else if (value === "partial") {
          return <Tag color="blue">Partial</Tag>;
        } else {
          return <Tag color="red">{status}</Tag>;
        }
      },
    },
    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space>
          {updatePermission && (
            <Button
              title="Update "
              size="small"
              type="default"
              style={{
                color: "green",
                border: "1px solid gray",
              }}
              onClick={() => navigate(`/collect-fee/${record?.id}`)}
            >
              <TbCoinTaka />
            </Button>
          )}
          <ViewButton to={`/collect-fee/view/${record?.id}`} />
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

export default useCollectFeeColumns;
