import { useDispatch } from "react-redux";
import { Button, Card, Row } from "antd";
import useModulesColumns from "../utils/userColumns";
import { useAppSelector } from "../../../app/store";
import { FilterState } from "../../../app/features/filterSlice";
import { useGetUsersQuery } from "../api/userEndPoints";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import { showModal } from "../../../app/features/modalSlice";
import { Table } from "../../../common/CommonAnt";
import CreateUser from "../components/CreateUser";
import { usePermission } from "../../../app/utils/usePermissions";
import { moduleNames } from "../../../utilities/permissionConstant";

const UserPage = () => {
  const dispatch = useDispatch();
  const { page_size, page } = useAppSelector(FilterState);
  const columns = useModulesColumns();
  const { canView, canCreate } = usePermission(moduleNames.users);

  const {
    data: userData,
    isLoading,
    isFetching,
    refetch,
  } = useGetUsersQuery<any>({
    page_size: page_size,
    page: Number(page) || undefined,
  });

  const total = Array.isArray(userData?.data)
    ? userData.data.length
    : Array.isArray((userData as any)?.data?.data)
    ? (userData as any).data.data.length
    : 0;

  return (
    <div className="space-y-5">
      <div className="my-5">
        <BreadCrumb />
      </div>

      {canCreate && (
        <Card>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            {/* create Page */}
            <Button
              onClick={() =>
                dispatch(
                  showModal({
                    title: "Create User",
                    content: <CreateUser />,
                  })
                )
              }
            >
              Create User
            </Button>
          </Row>
        </Card>
      )}
      {canView && (
        <Card
          title={
            <div className="flex justify-between items-center">
              <div className="space-x-5">
                <span>All User</span>
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
              Array.isArray(userData?.data)
                ? userData.data
                : Array.isArray((userData as any)?.data?.data)
                ? (userData as any).data.data
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
      )}
    </div>
  );
};

export default UserPage;
