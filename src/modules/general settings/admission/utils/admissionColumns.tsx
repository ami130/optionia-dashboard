/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { capitalize } from "../../../../common/capitalize/Capitalize";
import ViewButton from "../../../../common/CommonAnt/Button/ViewButton";
import EditButton from "../../../../common/CommonAnt/Button/EditButton";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaFingerprint } from "react-icons/fa6";
import {
  useDeleteAdmissionMutation,
  useLazyGetSingleAdmissionFormQuery,
} from "../api/admissionEndPoints";
import { useEffect, useState } from "react";
import { useGetDashboardDataQuery } from "../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../utilities/permissionConstant";
import DeleteButton from "../../../../common/CommonAnt/Button/DeleteButton";
import { useAppDispatch } from "../../../../app/store";
import { showModal } from "../../../../app/features/modalSlice";
import FingerAdmission from "../components/FingerAdmission";

const useAdmissionColumns = (): ColumnsType<any> => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.admission,
    actionNames.change
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [deleteItem] = useDeleteAdmissionMutation();

  const deletePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.admission,
    actionNames.delete
  );

  const handleDelete = async (id: any) => {
    try {
      await deleteItem({ id }).unwrap();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const [getAdmissionForm, { data: singleAdmissionForm }] =
    useLazyGetSingleAdmissionFormQuery();

  useEffect(() => {
    if (singleAdmissionForm) {
      const url = URL.createObjectURL(singleAdmissionForm);
      setPdfUrl(url);

      // Open PDF in a new tab
      window.open(url, "_blank");
    }

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [singleAdmissionForm]);

  const handleForm = (id: number) => {
    getAdmissionForm(id);
  };
  // const renderBreakdownList = (items: any) =>
  //   items?.length
  //     ? items.map((item: any) => `${item.month}: ${item.amount}`).join("\n")
  //     : "No data";

  const statusColors: Record<string, string> = {
    pending: "orange",
    approved: "green",
    rejected: "red",
    passed: "blue",
    withdrawn: "purple",
    failed: "red",
    on_hold: "gold",
    awaiting_result: "geekblue",
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
      width: 180,
      render: (title) =>
        title ? title?.first_name + " " + title?.last_name : "-",
    },
    {
      key: "22",
      title: "User",
      dataIndex: "student",
      align: "center",
      width: 100,
      sorter: (a, b) =>
        a.student?.user?.username?.localeCompare(
          b.student?.user?.username || ""
        ),
      render: (student) => student?.user?.username || "-",
    },
    // {
    //   key: "2",
    //   title: "REG No.",
    //   dataIndex: "registration_number",
    //   align: "center",
    //   sorter: (a, b) =>
    //     (a.registration_number || "").localeCompare(
    //       b.registration_number || ""
    //     ),
    //   render: (registration_number) => registration_number || "-",
    // },

    {
      key: "4",
      title: "Session",
      dataIndex: "session",
      align: "center",
      width: 100,
      sorter: (a, b) =>
        (a.session?.name || "").localeCompare(b.session?.name || ""),
      render: (session) => (session?.name ? capitalize(session.name) : "-"),
    },
    {
      key: "5",
      title: "Class",
      dataIndex: "grade_level",
      align: "center",
      width: 100,
      render: (title) => (title ? capitalize(title) : "-"),
    },
    {
      key: "55",
      title: "Shift",
      dataIndex: "shift",
      align: "center",
      width: 100,
      render: (title) => (title && title?.name ? capitalize(title?.name) : "-"),
    },
    {
      key: "6",
      title: "FeeType",
      dataIndex: "fee_type",
      align: "center",
      width: 110,
      sorter: (a, b) => (a.fee_type || "").localeCompare(b.fee_type || ""),
      render: (fee_type) => (fee_type ? capitalize(fee_type) : "-"),
    },
    {
      key: "7",
      title: "OneTime",
      dataIndex: "one_time_fee",
      align: "center",
      width: 110,
      render: (title) => (title ? title : 0),
    },
    {
      key: "8",
      title: "Monthly",
      dataIndex: "monthly_fee",
      align: "center",
      width: 100,
      render: (title) => (title ? title : 0),
    },

    {
      key: "10",
      title: "Due",
      dataIndex: "due_amount",
      align: "center",
      width: 100,
      render: (title) =>
        title ? <span className="text-red-500">{title}</span> : 0,
    },
    {
      key: "99",
      title: "Paid",
      dataIndex: "total_paid_amount",
      align: "center",
      width: 100,
      render: (title) =>
        title ? <span className="text-green-500">{title}</span> : 0,
    },
    {
      key: "999",
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status: string) => {
        const color = statusColors[status] || "default";
        return (
          <p style={{ backgroundColor: color, color: "white" }}>
            {capitalize(status)}
          </p>
        );
      },
    },
    {
      title: "Actions",
      align: "center",
      width: 220,
      render: (record) => (
        <Space>
          {updatePermission && (
            <EditButton onClick={() => navigate(`/admission/${record?.id}`)} />
          )}

          <ViewButton to={`/admission/admission-view/${record?.id}`} />
          <Button
            title="Admission Form"
            size="small"
            type="default"
            style={{
              color: "#c20a0a",
              // background: "#3892E3",
              border: "1px solid gray",
            }}
            onClick={() => handleForm(record.id)}
          >
            <FaFilePdf />
          </Button>

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

export default useAdmissionColumns;
