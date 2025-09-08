import { Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ViewButton from "../../../../../common/CommonAnt/Button/ViewButton";
import {
  useDeleteResultMutation,
  useLazyGetSinglePublishResultFormQuery,
} from "../api/resultsEndPoints";
import { GetPermission } from "../../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../../utilities/permissionConstant";
import { useGetDashboardDataQuery } from "../../../../Dashboard/api/dashoboardEndPoints";
import DeleteButton from "../../../../../common/CommonAnt/Button/DeleteButton";
import { FaFilePdf } from "react-icons/fa6";
import { useEffect, useState } from "react";

const useResultsColumns = (): ColumnsType<any> => {
  const { data: dashboardData } = useGetDashboardDataQuery({});

  const [deleteItem] = useDeleteResultMutation();

  const deletePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.studentresult,
    actionNames.delete
  );

  const [pdfTitle, setPdfTitle] = useState<string>("Publish Result PDF");

  const [getPublishResultForm, { data: publishResultForm }] =
    useLazyGetSinglePublishResultFormQuery<any>();

  useEffect(() => {
    if (publishResultForm) {
      const url = URL.createObjectURL(publishResultForm);

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
  }, [publishResultForm, pdfTitle]); // ✅ Removed pdfUrl!

  const handleForm = (id: number) => {
    setPdfTitle(`${id} `);
    getPublishResultForm({ id: id });
  };

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
      title: "Exam Name",
      dataIndex: "exam",
      align: "center",
      width: 120,
      render: (title) => (title ? title.name : "-"),
    },
    {
      key: "2",
      title: "Student Name",
      dataIndex: "admission",
      align: "left",
      width: 200,
      render: (title) =>
        title ? title.student.first_name + " " + title.student.last_name : "-",
    },
    {
      key: "3",
      title: "Class",
      dataIndex: "admission",
      align: "center",
      render: (title) => (title ? title.grade_level : "-"),
    },
    {
      key: "4",
      title: "Roll No.",
      dataIndex: "admission",
      align: "center",
      width: 170,
      render: (title) => (title ? title.roll : "-"),
    },

    {
      key: "5",
      title: "Grade",
      dataIndex: "grade",
      align: "center",
      render: (title) => (title ? title : "-"),
    },
    {
      key: "6",
      title: "Contribution Marks",
      dataIndex: "contribution_marks",
      align: "center",
      width: 150,
      render: (title) => (title ? title : "-"),
    },
    {
      key: "7",
      title: "Total Marks",
      dataIndex: "total_marks",
      align: "center",
      width: 100,
      render: (title) => (title ? title : "-"),
    },
    {
      key: "8",
      title: "Status",
      dataIndex: "is_passed",
      align: "center",
      width: 120,
      render: (title) =>
        title ? <Tag color="green">PASS</Tag> : <Tag color="red">FAIL</Tag>,
    },
    {
      title: "Actions",
      align: "center",
      render: (record) => (
        <Space>
          <ViewButton to={`/exam-result/view/${record?.id}`} />
          <Button
            title="Publish Result"
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
              onConfirm={() => handleDelete(record.id)}
            ></DeleteButton>
          )}
        </Space>
      ),
    },
  ];
};

export default useResultsColumns;
