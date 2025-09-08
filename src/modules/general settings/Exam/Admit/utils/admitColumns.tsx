import { Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

import dayjs from "dayjs";

import { FaFilePdf } from "react-icons/fa6";
import { useEffect, useState } from "react";

import { useLazyGetSingleAdmitFormQuery } from "../api/admitEndPoints";
import { capitalize } from "lodash";

const useAdmitColumns = (): ColumnsType<any> => {
  const [pdfTitle, setPdfTitle] = useState<string>("Admit Card PDF");

  const [getSingleAdmitForm, { data: singleAdmitForm }] =
    useLazyGetSingleAdmitFormQuery();

  useEffect(() => {
    if (singleAdmitForm) {
      const url = URL.createObjectURL(singleAdmitForm);

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
  }, [singleAdmitForm, pdfTitle]); // ✅ Removed pdfUrl!

  const handleForm = (id: number) => {
    setPdfTitle(`${id} `);
    getSingleAdmitForm(id);
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
      dataIndex: "student",
      align: "left",
      width: "180px",
      render: (title) =>
        title ? title?.first_name + " " + title?.last_name : "-",
    },
    {
      key: "2",
      title: "User ID",
      dataIndex: "student",
      align: "center",
      sorter: (a, b) =>
        a.student?.user?.username?.localeCompare(
          b.student?.user?.username || ""
        ),
      render: (student) => student?.user?.username || "-",
    },
    {
      key: "3",
      title: "Admission Date",
      dataIndex: "admission_date",
      align: "center",
      sorter: (a, b) =>
        new Date(a.admission_date || 0).getTime() -
        new Date(b.admission_date || 0).getTime(),
      render: (title) => (title ? dayjs(title).format("DD MMMM YYYY") : "-"),
    },

    {
      key: "4",
      title: "Session",
      dataIndex: "session",
      align: "center",
      sorter: (a, b) =>
        (a.session?.name || "").localeCompare(b.session?.name || ""),
      render: (session) => (session?.name ? capitalize(session.name) : "-"),
    },
    {
      key: "5",
      title: "Class",
      dataIndex: "grade_level",
      align: "center",
      render: (title) => (title ? capitalize(title) : "-"),
    },
    {
      key: "55",
      title: "Shift",
      dataIndex: "shift",
      align: "center",
      render: (title) => (title && title?.name ? capitalize(title?.name) : "-"),
    },

    {
      key: "10",
      title: "Due",
      dataIndex: "due_amount",
      align: "center",
      render: (title) =>
        title ? <span className="text-red-500">{title}</span> : 0,
    },
    {
      key: "99",
      title: "Paid Amount",
      dataIndex: "total_paid_amount",
      align: "center",
      render: (title) => (title ? title : 0),
    },

    // {
    //   key: "9",
    //   title: "Status",
    //   dataIndex: "status",
    //   align: "center",
    //   render: (status: string) => {
    //     let color = "default";
    //     if (status === "pending") color = "red";
    //     else if (status === "partial") color = "blue";
    //     else if (status === "paid") color = "green";

    //     return <Tag color={color}>{status?.toUpperCase()}</Tag>;
    //   },
    // },

    {
      key: "7",
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space>
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

export default useAdmitColumns;
