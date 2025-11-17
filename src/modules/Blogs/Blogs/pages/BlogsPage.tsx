import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/store";
import { FilterState } from "../../../../app/features/filterSlice";
import BreadCrumb from "../../../../common/BreadCrumb/BreadCrumb";
import { Button, Card, Col, Input, Row, Select, Space } from "antd";
import { showModal } from "../../../../app/features/modalSlice";
import { Table } from "../../../../common/CommonAnt";
import { usePermission } from "../../../../app/utils/usePermissions";
import { moduleNames } from "../../../../utilities/permissionConstant";
import { useGetBlogQuery } from "../api/blogsEndPoints";
import useBlogColumns from "../utils/blogColumns";
import { useGetCategoriesQuery } from "../../Categories/api/categoriesEndPoints";
import { useEffect, useState } from "react";
import { useGetTagsQuery } from "../../Tag/api/tagsEndPoints";
import { useGetUsersQuery } from "../../../User/api/userEndPoints";
import CreateBlog from "../components/CreateBlog";
import { Link } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;

const BlogsPage = () => {
  const dispatch = useDispatch();
  const { page } = useAppSelector(FilterState);
  const { canView, canCreate } = usePermission(moduleNames.blog);
  const columns = useBlogColumns();

  const [filters, setFilters] = useState({
    search: "",
    categoryId: undefined as number | undefined,
    tagId: undefined as number | undefined,
    author: undefined as number | undefined,
  });

  const { data: categoryData } = useGetCategoriesQuery<any>({});
  const { data: tagsData } = useGetTagsQuery<any>({});
  const { data: userData } = useGetUsersQuery<any>({});
  const {
    data: blogData,
    isFetching,
    refetch,
    isLoading,
  } = useGetBlogQuery<any>({
    page: Number(page) || 1,
    search: filters.search || undefined,
    category: filters.categoryId || undefined,
    tagIds: filters.tagId || undefined,
    author: filters.author || undefined,
  });

  useEffect(() => {
    refetch();
  }, [filters, page, refetch]);

  const total = Array.isArray(blogData?.data)
    ? blogData.data.length
    : Array.isArray((blogData as any)?.data?.data)
    ? (blogData as any).data.data.length
    : 0;

  return (
    <div className="space-y-5">
      <div className="my-5">
        <BreadCrumb />
      </div>

      {canView && (
        <Card>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col>
              {canCreate && (
                <Link to="/blog/create" className="border px-5 py-2 rounded">Create Blog</Link>
                // <Button
                //   type="primary"
                //   onClick={() =>
                //     dispatch(
                //       showModal({
                //         title: "Create Blog",
                //         content: <CreateBlog />,
                //       })
                //     )
                //   }
                // >
                //   Create Blog
                // </Button>
              )}
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search blogs..."
                  allowClear
                  style={{ width: 220 }}
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  onSearch={(value) =>
                    setFilters({ ...filters, search: value.trim() })
                  }
                />
                <Select
                  placeholder="Select category"
                  allowClear
                  style={{ width: 180 }}
                  value={filters.categoryId}
                  onChange={(value) =>
                    setFilters({ ...filters, categoryId: value })
                  }
                >
                  {categoryData?.data?.map((cat: any) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder="Select Tag"
                  allowClear
                  style={{ width: 180 }}
                  value={filters.tagId}
                  onChange={(value) => setFilters({ ...filters, tagId: value })}
                >
                  {tagsData?.data?.map((cat: any) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder="Select Author"
                  allowClear
                  style={{ width: 180 }}
                  value={filters.author}
                  onChange={(value) =>
                    setFilters({ ...filters, author: value })
                  }
                >
                  {userData?.data?.map((cat: any) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.username}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {canCreate && (
        <Card
          title={
            <div className="flex justify-between items-center">
              <div className="space-x-5">
                <span>All Blog</span>
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
              Array.isArray(blogData?.data?.blogs)
                ? blogData.data?.blogs
                : Array.isArray((blogData as any)?.data?.data?.blogs)
                ? (blogData as any).data.data?.blogs
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

export default BlogsPage;
