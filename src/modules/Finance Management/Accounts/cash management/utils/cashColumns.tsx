import type { ColumnsType } from "antd/es/table";

import { capitalize } from "../../../../../common/capitalize/Capitalize";
import dayjs from "dayjs";
import { Button, Space, Tag } from "antd";
import EditButton from "../../../../../common/CommonAnt/Button/EditButton";
import UpdateCash from "../components/UpdateCash";
import { useDispatch } from "react-redux";
import { useGetDashboardDataQuery } from "../../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../../utilities/permissionConstant";
import { showModal } from "../../../../../app/features/modalSlice";
import { FaFilePdf } from "react-icons/fa6";
import { useLazyGetSingleCashFormQuery } from "../api/cashEndPoints";
import { useEffect, useState } from "react";

const useCashColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.financialentry,
    actionNames.change
  );

  const [getCashForm, { data: singleCashForm }] =
    useLazyGetSingleCashFormQuery();

  useEffect(() => {
    if (singleCashForm) {
      const url = URL.createObjectURL(singleCashForm);
      setPdfUrl(url);

      // Open PDF in a new tab
      window.open(url, "_blank");
    }

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [singleCashForm]);

  const handleForm = (id: number) => {
    getCashForm(id);
  };

  // const handleDelete = async (id: any) => {
  //   try {
  //     await deleteCartItem({ id }).unwrap();
  //     console.log("Item deleted successfully");
  //   } catch (error) {
  //     console.error("Failed to delete item:", error);
  //   }
  // };

  return [
    {
      key: "0",
      title: "SL",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      key: "1",
      title: "Account Type",
      dataIndex: "account",
      align: "center",
      width: 150,
      render: (title) => (title ? capitalize(title?.account_type) : "-"),
    },
    {
      key: "2",
      title: "Payment Method",
      dataIndex: "payment_method",
      align: "center",
      width: 150,
      render: (method: string) => {
        const lowerMethod = method?.toLowerCase();
        let color: string;

        switch (lowerMethod) {
          case "card":
            color = "blue";
            break;
          case "cash":
            color = "orange";
            break;
          case "online":
            color = "purple";
            break;
          default:
            color = "default";
        }

        return (
          <Tag color={color} className="uppercase">
            {method ? method.toLowerCase() : "-"}
          </Tag>
        );
      },
    },
    {
      key: "3",
      title: "Entry Type",
      dataIndex: "entry_type",
      align: "center",
      width: 150,
      render: (title) => (title ? capitalize(title) : "-"),
    },

    {
      key: "4",
      title: "Amount",
      dataIndex: "amount",
      align: "center",
      width: 100,
      render: (amount: number) => {
        const isPositive = Number(amount) > 0;
        const color = isPositive ? "green" : "red";

        return (
          <span style={{ color }}>
            {amount !== null && amount !== undefined ? amount : "-"}
          </span>
        );
      },
    },

    {
      key: "5",
      title: "Date",
      dataIndex: "date",
      align: "center",
      width: 120,
      render: (title) => (title ? dayjs(title).format("DD MMM YYYY") : "-"),
    },
    {
      key: "6",
      title: "Description",
      dataIndex: "description",
      align: "center",
      render: (title) => (title ? title : "-"),
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
                    title: "Update Cash",
                    content: <UpdateCash record={record?.id} />,
                  })
                )
              }
            />
          )}
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
          {/* <ViewButton to={`student-view/1`} /> */}
          {/* <DeleteButton
          onClick={() => handleDelete(record.id)}>
            Delete
          </DeleteButton> */}
        </Space>
      ),
    },
  ];
};

export default useCashColumns;
