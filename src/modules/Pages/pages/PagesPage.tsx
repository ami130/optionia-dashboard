/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Card, Row } from "antd";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import Table from "../../../common/CommonAnt/Table";
import { useAppSelector } from "../../../app/store";
import { FilterState } from "../../../app/features/filterSlice";
import { useGetPagesQuery } from "../api/pagesEndPoints";
import { showModal } from "../../../app/features/modalSlice";
import CreatePages from "../components/CreatePages";
import { useDispatch } from "react-redux";
import usePagesColumns from "../utils/pagesColumns";

const PagesPage = () => {
  const dispatch = useDispatch();
  const columns = usePagesColumns();

  const { page_size, page } = useAppSelector(FilterState);

  const {
    data: PagesData,
    isLoading,
    refetch,
    isFetching,
  } = useGetPagesQuery({
    page_size: page_size,
    page: Number(page) || undefined,
  });

  // const viewPermission = GetPermission(
  //   dashboardData?.data?.permissions,
  //   moduleNames.student,
  //   actionNames.view
  // );
  // const createPermission = GetPermission(
  //   dashboardData?.data?.permissions,
  //   moduleNames.student,
  //   actionNames.add
  // );

  // compute total safely whether PagesData.data is an array or a nested paginated response
  const total = Array.isArray(PagesData?.data)
    ? PagesData.data.length
    : Array.isArray((PagesData as any)?.data?.data)
    ? (PagesData as any).data.data.length
    : 0;

  return (
    <div className="space-y-5">
      <div className="my-5">
        <BreadCrumb />
      </div>

      <Card
        bodyStyle={{
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          {/* create Page */}
          <Button
            onClick={() =>
              dispatch(
                showModal({
                  title: "Create Page",
                  content: <CreatePages />,
                })
              )
            }
          >
            Create Page
          </Button>
        </Row>
      </Card>
      <Card
        title={
          <div className="flex justify-between items-center">
            <div className="space-x-5">
              <span>All Pages</span>
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
            Array.isArray(PagesData?.data)
              ? PagesData.data
              : Array.isArray((PagesData as any)?.data?.data)
              ? (PagesData as any).data.data
              : []
          }
          columns={columns}
          expandable={{
            rowExpandable: (record) =>
              record.children && record.children.length > 0,
            expandIconColumnIndex: 10, // put + in another column
          }}
        />
      </Card>
    </div>
  );
};

export default PagesPage;
