import { Button, Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { FaEye, FaFilePdf } from "react-icons/fa6";

import { useGetInvoicePdfQuery } from "../api/invoiceEndPoints";
import { showModal } from "../../../../../app/features/modalSlice";
import InvoiceView from "../components/InvoiceView";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const useInvoiceColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();

  const [collectFeeId, setCollectFeeId] = useState<number | null>(null);
  const [pdfTitle, setPdfTitle] = useState<string>("Invoice PDF");

  const { data: singleInvoice } = useGetInvoicePdfQuery(
    collectFeeId as number,
    {
      skip: collectFeeId === null,
    }
  );

  useEffect(() => {
    if (singleInvoice) {
      const url = URL.createObjectURL(singleInvoice);

      // ✅ Open a new blank tab with custom title
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

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [singleInvoice, pdfTitle]); // ✅ No pdfUrl in deps!

  const handleForm = (record: any) => {
    setPdfTitle(`${record?.id}`);
    setCollectFeeId(record.id);
  };

  return [
    {
      key: "0",
      title: "SL",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Invoice Number",
      dataIndex: "invoice_number",
      key: "invoice_number",
      width: 150,
      align: "center",
    },
    {
      key: "4",
      title: "UserID",
      dataIndex: "admission",
      align: "center",
      render: (title) => (title ? title?.student?.user?.username : "-"),
    },
    {
      key: "1",
      title: "Student Name",
      dataIndex: "admission",
      align: "left",
      width: 200,
      render: (admission) => (
        <Link
          to={`/admission/admission-view/${admission?.id}`}
          className="text-green-500"
        >
          {admission?.student?.first_name} {admission?.student?.last_name}
        </Link>
      ),
    },
    {
      title: "Issue Date",
      dataIndex: "issue_date",
      key: "issue_date",
      align: "center",
      render: (title) => (title ? dayjs(title).format("DD MMM YYYY") : "-"),
    },

    // {
    //   title: "Total Amount",
    //   dataIndex: "total_amount",
    //   key: "total_amount",
    //   align: "center",
    // },

    // {
    //   title: "Discount Type",
    //   dataIndex: "discount_type",
    //   key: "discount_type",
    //   align: "center",
    // },
    {
      title: "Discount",
      dataIndex: "discount_value",
      key: "discount_value",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "total_paid",
      key: "total_paid",
      align: "center",
    },
    {
      title: "Net Amount",
      dataIndex: "net_amount",
      key: "net_amount",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => {
        const color =
          status === "paid"
            ? "green"
            : status === "partial"
            ? "blue"
            : "volcano";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space>
          {/* <EditButton
            onClick={() =>
              dispatch(
                showModal({
                  title: "Update Invoice",
                  content: <UpdateInvoice record={record?.id} />,
                })
              )
            }
          /> */}

          <Button
            size="small"
            type="default"
            onClick={() =>
              dispatch(
                showModal({
                  title: "View Invoice",
                  content: <InvoiceView record={record?.id} />,
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

          <Button
            title="Invoice"
            size="small"
            type="default"
            style={{
              color: "#c20a0a",
              border: "1px solid gray",
            }}
            onClick={() => handleForm(record)}
          >
            <FaFilePdf />
          </Button>
        </Space>
      ),
    },
  ];
};

export default useInvoiceColumns;
