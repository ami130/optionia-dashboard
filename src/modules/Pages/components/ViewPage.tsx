import { Card, Col, Row, Tag, Typography, Divider, Skeleton } from "antd";
import { useGetSinglePagesQuery } from "../api/pagesEndPoints";

const { Title, Text } = Typography;

const typeColors: Record<string, string> = {
  service: "indigo",
  general: "cyan",
  blog: "purple",
  default: "gray",
};

export default function ViewPage({ id }: { id: number }) {
  const { data: PageData, isLoading } = useGetSinglePagesQuery(Number(id));
  const page = PageData?.data;

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );

  if (!page)
    return (
      <div className="flex justify-center items-center h-64 text-red-500 font-semibold">
        Page not found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* MAIN PAGE CARD */}
      <Card className="rounded-3xl shadow-xl bg-white p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <Title level={2} className="text-gray-900">
              {page.title}
            </Title>
            <Text className="text-indigo-600 font-semibold text-lg">{page.url}</Text>
            <div className="mt-4 flex flex-wrap gap-3">
              <Tag color={page.isActive ? "green" : "red"} className="font-medium">
                {page.isActive ? "Active" : "Inactive"}
              </Tag>
              <Tag color={typeColors[page.type] || "gray"} className="font-medium">
                {page.type}
              </Tag>
              <Tag color="geekblue" className="font-medium">
                Order: {page.order}
              </Tag>
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:text-right">
            {page.metaTitle && <Text className="block text-gray-500 text-md">{page.metaTitle}</Text>}
            {page.metaDescription && (
              <Text className="block mt-1 text-gray-400 italic">{page.metaDescription}</Text>
            )}
          </div>
        </div>
      </Card>

      {/* CHILD PAGES SECTION */}
      {page.children && page.children.length > 0 && (
        <Card className="rounded-3xl shadow-xl p-6 border border-gray-100 bg-white">
          <Title level={4} className="text-gray-800 mb-6">
            Child Pages
          </Title>
          <Divider className="border-gray-200" />
          <Row gutter={[24, 24]}>
            {page.children.map((child: any) => (
              <Col xs={24} sm={12} md={8} key={child.id}>
                <Card
                  className={`p-5 border-l-8 border-${typeColors[child.type] || "gray"}-400 rounded-2xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-r from-gray-50 to-white`}
                >
                  <Title level={5} className="text-gray-800 mb-1 truncate">
                    {child.title}
                  </Title>
                  <Text className="text-indigo-600 font-medium truncate">{child.url}</Text>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Tag color={child.isActive ? "green" : "red"} className="font-medium">
                      {child.isActive ? "Active" : "Inactive"}
                    </Tag>
                    <Tag color={typeColors[child.type] || "gray"} className="font-medium">
                      {child.type}
                    </Tag>
                    <Tag color="geekblue" className="font-medium">
                      Order: {child.order}
                    </Tag>
                  </div>
                  {child.metaTitle && (
                    <Text className="block mt-2 text-gray-500 font-medium truncate">{child.metaTitle}</Text>
                  )}
                  {child.metaDescription && (
                    <Text className="block mt-1 text-gray-400 italic truncate">{child.metaDescription}</Text>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
}
