import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Space, Tag } from "antd";
import { useDispatch } from "react-redux";
import { useGetDashboardDataQuery } from "../../../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../../../utilities/permissionConstant";
import { capitalize } from "../../../../../../common/capitalize/Capitalize";
import EditButton from "../../../../../../common/CommonAnt/Button/EditButton";
import { showModal } from "../../../../../../app/features/modalSlice";
import UpdateVendorPaymentEntry from "../components/UpdateVendorEntry";
import ViewVendorPaymentEntry from "../components/ViewVendorPaymentEntry";
import { FaEye, FaFilePdf } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useLazyGetVendorPaymentFormQuery } from "../api/VendorEntryEndPoints";

const useVendorPaymentEntryColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();
  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.financialentry,
    actionNames.change
  );

  const [pdfTitle, setPdfTitle] = useState<string>("Invoice PDF");

  const [getCollectFeeForm, { data: singleFeeForm }] =
    useLazyGetVendorPaymentFormQuery();

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
      title: "vendor Name",
      dataIndex: "vendor",
      align: "center",
      render: (title) => (title ? capitalize(title?.name) : "-"),
    },

    {
      key: "111",
      title: "Type",
      dataIndex: "type",
      align: "center",
      render: (title) => (title ? capitalize(title) : "-"),
    },

    {
      key: "22",
      title: "Created By",
      dataIndex: "created_by",
      align: "center",
      render: (title) => (title ? title?.username : "-"),
    },
    // {
    //   key: "2",
    //   title: "Payment Method",
    //   dataIndex: "payment_method",
    //   align: "center",
    //   render: (method: string) => {
    //     const lowerMethod = method?.toLowerCase();
    //     let color: string;

    //     switch (lowerMethod) {
    //       case "card":
    //         color = "blue";
    //         break;
    //       case "cash":
    //         color = "orange";
    //         break;
    //       case "online":
    //         color = "purple";
    //         break;
    //       default:
    //         color = "default";
    //     }

    //     return (
    //       <Tag color={color} className="uppercase">
    //         {method ? method.toLowerCase() : "-"}
    //       </Tag>
    //     );
    //   },
    // },
    // {
    //   key: "3",
    //   title: "Entry Type",
    //   dataIndex: "entry_type",
    //   align: "center",
    //   render: (title) => (title ? capitalize(title) : "-"),
    // },

    {
      key: "4",
      title: "Amount",
      dataIndex: "amount",
      align: "center",
      render: (amount: number) => {
        const isPositive = Number(amount) > 0;
        const color = isPositive ? "green" : "red";

        return (
          <Tag color={color}>
            {amount !== null && amount !== undefined ? amount : "-"}
          </Tag>
        );
      },
    },

    {
      key: "5",
      title: "Payment Date",
      dataIndex: "payment_date",
      align: "center",
      render: (title) => (title ? dayjs(title).format("DD MMM YYYY") : "-"),
    },
    // {
    //   key: "6",
    //   title: "Description",
    //   dataIndex: "description",
    //   align: "center",
    //   render: (title) => (title ? title : "-"),
    // },

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
                    title: "Update Vendor Payment",
                    content: <UpdateVendorPaymentEntry record={record?.id} />,
                  })
                )
              }
            />
          )}
          <Button
            onClick={() =>
              dispatch(
                showModal({
                  title: "View Vendor Payment",
                  content: <ViewVendorPaymentEntry record={record?.id} />,
                })
              )
            }
            size="small"
            type="default"
            style={{
              color: "#3892E3",
              // background: "#3892E3",
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
            onClick={() => handleForm(record.id)}
          >
            <FaFilePdf />
          </Button>
          {/* <DeleteButton
          onClick={() => handleDelete(record.id)}>
            Delete
          </DeleteButton> */}
        </Space>
      ),
    },
  ];
};

export default useVendorPaymentEntryColumns;
