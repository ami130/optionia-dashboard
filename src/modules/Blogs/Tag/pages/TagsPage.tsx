import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/store";
import { FilterState } from "../../../../app/features/filterSlice";
import BreadCrumb from "../../../../common/BreadCrumb/BreadCrumb";
import { Button, Card, Row } from "antd";
import { showModal } from "../../../../app/features/modalSlice";
import { Table } from "../../../../common/CommonAnt";
import { usePermission } from "../../../../app/utils/usePermissions";
import { moduleNames } from "../../../../utilities/permissionConstant";
import useTagsColumns from "../utils/tagsColumns";
import CreateTags from "../components/CreateTags";
import { useGetTagsQuery } from "../api/tagsEndPoints";

const TagsPage = () => {
  const dispatch = useDispatch();
  const { page_size, page } = useAppSelector(FilterState);
  const { canView, canCreate } = usePermission(moduleNames.tag);

  const columns = useTagsColumns();

  const {
    data: tagData,
    isFetching,
    refetch,
    isLoading,
  } = useGetTagsQuery<any>({
    page_size: page_size,
    page: Number(page) || undefined,
  });

  const total = Array.isArray(tagData?.data)
    ? tagData.data.length
    : Array.isArray((tagData as any)?.data?.data)
    ? (tagData as any).data.data.length
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
                    title: "Create Tags",
                    content: <CreateTags />,
                  })
                )
              }
            >
              Create Tag
            </Button>
          </Row>
        </Card>
      )}

      {canCreate && (
        <Card
          title={
            <div className="flex justify-between items-center">
              <div className="space-x-5">
                <span>All Tags</span>
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
              Array.isArray(tagData?.data)
                ? tagData.data
                : Array.isArray((tagData as any)?.data?.data)
                ? (tagData as any).data.data
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

export default TagsPage;
