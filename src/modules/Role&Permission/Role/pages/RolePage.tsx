import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/store";
import { FilterState } from "../../../../app/features/filterSlice";
import BreadCrumb from "../../../../common/BreadCrumb/BreadCrumb";
import { Button, Card, message, Row } from "antd";
import { showModal } from "../../../../app/features/modalSlice";
import { Table } from "../../../../common/CommonAnt";
import useRoleColumns from "../utils/roleColumns";
import {
  useCreateRoleAssignWithPermissionMutation,
  useGetRoleQuery,
} from "../api/roleEndPoints";
import { CreateRole } from "../components/CreateRole";
import { useGetModuleQuery } from "../../Module/api/moduleEndPoints";

const RolePage = () => {
  const dispatch = useDispatch();
  const { page_size, page } = useAppSelector(FilterState);
  const [createRoleAssignWithPermission] =
    useCreateRoleAssignWithPermissionMutation();
  const columns = useRoleColumns();

  const {
    data: roleData,
    isFetching,
    refetch,
    isLoading,
  } = useGetRoleQuery<any>({
    page_size: page_size,
    page: Number(page) || undefined,
  });

  const total = Array.isArray(roleData?.data)
    ? roleData.data.length
    : Array.isArray((roleData as any)?.data?.data)
    ? (roleData as any).data.data.length
    : 0;

  const { data: modulesData, isLoading: modulesLoading } =
    useGetModuleQuery<any>({
      page_size: page_size,
      page: Number(page) || undefined,
    });

  const handleRoleSubmit = async (payload: any) => {
    try {
      // Send JSON directly
      await createRoleAssignWithPermission(payload).unwrap();
      message.success("Role created successfully!");
    } catch (err: any) {
      message.error(err?.data?.message || "Something went wrong");
    }
  };

  if (modulesLoading) return <p>Loading modules...</p>;

  return (
    <div className="space-y-5">
      <div className="my-5">
        <BreadCrumb />
      </div>

      <Card>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          {/* create Page */}
          <Button
            onClick={() =>
              dispatch(
                showModal({
                  title: "Create Role",
                  content: (
                    <CreateRole
                      modules={modulesData?.data || []}
                      onSubmit={handleRoleSubmit}
                    />
                  ),
                })
              )
            }
          >
            Create Role
          </Button>
        </Row>
      </Card>
      <Card
        title={
          <div className="flex justify-between items-center">
            <div className="space-x-5">
              <span>All Role</span>
            </div>
          </div>
        }
      >
        <Table
          rowKey={"id"}
          loading={isLoading || isFetching}
          refetch={refetch}
          total={total}
          dataSource={
            Array.isArray(roleData?.data)
              ? roleData.data
              : Array.isArray((roleData as any)?.data?.data)
              ? (roleData as any).data.data
              : []
          }
          columns={columns}
          // expandable={{
          //   rowExpandable: (record) =>
          //     record.children && record.children.length > 0,
          //   expandIconColumnIndex: 10, // put + in another column
          // }}
        />
      </Card>
    </div>
  );
};

export default RolePage;
