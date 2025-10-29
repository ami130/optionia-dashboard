import { useDispatch } from "react-redux";
import { useGetModuleQuery } from "../api/moduleEndPoints";
import { useAppSelector } from "../../../../app/store";
import { FilterState } from "../../../../app/features/filterSlice";
import BreadCrumb from "../../../../common/BreadCrumb/BreadCrumb";
import { Button, Card, Row } from "antd";
import { showModal } from "../../../../app/features/modalSlice";
import { Table } from "../../../../common/CommonAnt";
import useModulesColumns from "../utils/modulesColumns";
import CreateModule from "../components/CreateModule";

const ModulePage = () => {
  const dispatch = useDispatch();
  const { page_size, page } = useAppSelector(FilterState);
  const columns = useModulesColumns();

  const {
    data: moduleData,
    isLoading,
    isFetching,
    refetch,
  } = useGetModuleQuery<any>({
    page_size: page_size,
    page: Number(page) || undefined,
  });

  const total = Array.isArray(moduleData?.data)
    ? moduleData.data.length
    : Array.isArray((moduleData as any)?.data?.data)
    ? (moduleData as any).data.data.length
    : 0;

  return (
    <div className="space-y-5">
      <div className="my-5">
        <BreadCrumb />
      </div>

      <Card
     
      >
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          {/* create Page */}
          <Button
            onClick={() =>
              dispatch(
                showModal({
                  title: "Create Module",
                  content: <CreateModule />,
                })
              )
            }
          >
            Create Module
          </Button>
        </Row>
      </Card>
      <Card
        title={
          <div className="flex justify-between items-center">
            <div className="space-x-5">
              <span>All Modules</span>
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
            Array.isArray(moduleData?.data)
              ? moduleData.data
              : Array.isArray((moduleData as any)?.data?.data)
              ? (moduleData as any).data.data
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

export default ModulePage;
