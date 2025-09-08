import type { ColumnsType } from "antd/es/table";
import { Button, Space } from "antd";
import { useDispatch } from "react-redux";
import { useGetDashboardDataQuery } from "../../../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../../../utilities/permissionConstant";
import EditButton from "../../../../../../common/CommonAnt/Button/EditButton";
import { showModal } from "../../../../../../app/features/modalSlice";
import UpdateVendor from "../Components/UpdateVendor";
import ViewVendor from "../Components/ViewVendor";
import { FaEye } from "react-icons/fa6";

const useVendorColumns = (): ColumnsType<any> => {
  const dispatch = useDispatch();
  const { data: dashboardData } = useGetDashboardDataQuery({});

  const updatePermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.financialentry,
    actionNames.change
  );

  // const [deleteCartItem] = useDeleteOrderItemMutation();

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
      title: "Vendor Name",
      dataIndex: "name",
      align: "center",
      render: (text) => text || "-",
    },
    {
      key: "2",
      title: "Contact Number",
      dataIndex: "contact_number",
      align: "center",
      render: (text) => text || "-",
    },
    {
      key: "3",
      title: "Email",
      dataIndex: "email",
      align: "center",
      render: (text) => text || "-",
    },
    {
      key: "4",
      title: "Number Of Invoices",
      dataIndex: "invoices",
      align: "center",
      render: (text) => text?.length || "-",
    },
    {
      key: "5",
      title: "Purpose",
      dataIndex: "purpose",
      align: "center",
      render: (text) => text || "-",
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
                    content: <UpdateVendor record={record?.id} />,
                  })
                )
              }
            />
          )}

          <Button
            onClick={() =>
              dispatch(
                showModal({
                  title: "View Vendor",
                  content: <ViewVendor record={record} />,
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

export default useVendorColumns;
