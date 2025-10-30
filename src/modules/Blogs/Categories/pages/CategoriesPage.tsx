import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/store";
import { FilterState } from "../../../../app/features/filterSlice";
import BreadCrumb from "../../../../common/BreadCrumb/BreadCrumb";
import { Button, Card, Row } from "antd";
import { showModal } from "../../../../app/features/modalSlice";
import { Table } from "../../../../common/CommonAnt";
import useCategoriesColumns from "../utils/categoriesColumns";
import { useGetCategoriesQuery } from "../api/categoriesEndPoints";
import CreateCategories from "../components/CreateCategories";
import { usePermission } from "../../../../app/utils/usePermissions";
import { moduleNames } from "../../../../utilities/permissionConstant";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { page_size, page } = useAppSelector(FilterState);
  const { canView, canCreate } = usePermission(moduleNames.category);

  const columns = useCategoriesColumns();

  const {
    data: categoriesData,
    isFetching,
    refetch,
    isLoading,
  } = useGetCategoriesQuery<any>({
    page_size: page_size,
    page: Number(page) || undefined,
  });

  const total = Array.isArray(categoriesData?.data)
    ? categoriesData.data.length
    : Array.isArray((categoriesData as any)?.data?.data)
    ? (categoriesData as any).data.data.length
    : 0;

  return (
    <div className="space-y-5">
      <div className="my-5">
        <BreadCrumb />
      </div>

      {canView && (
        <Card>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            {/* create Page */}
            <Button
              onClick={() =>
                dispatch(
                  showModal({
                    title: "Create Categories",
                    content: <CreateCategories />,
                  })
                )
              }
            >
              Create Categories
            </Button>
          </Row>
        </Card>
      )}

      {canCreate && (
        <Card
          title={
            <div className="flex justify-between items-center">
              <div className="space-x-5">
                <span>All Categories</span>
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
              Array.isArray(categoriesData?.data)
                ? categoriesData.data
                : Array.isArray((categoriesData as any)?.data?.data)
                ? (categoriesData as any).data.data
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

export default CategoriesPage;
