import { Card, Col, Row, Tag, Typography, Divider, Skeleton, Image, Space } from "antd";
import { 
  CalendarOutlined, 
  LinkOutlined, 
  EditOutlined, 
  EyeOutlined,
  TagOutlined,
  FileTextOutlined,
  BgColorsOutlined
} from "@ant-design/icons";
import { useGetSinglePagesQuery } from "../api/pagesEndPoints";

const { Title, Text, Paragraph } = Typography;

const typeColors: Record<string, string> = {
  page: "blue",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* HEADER SECTION */}
      <div className="text-center mb-8">
        <Title level={1} className="text-4xl font-bold text-gray-900 mb-4">
          {page.title}
        </Title>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <Tag 
            color={page.isActive ? "green" : "red"} 
            className="text-sm font-semibold px-3 py-1"
          >
            {page.isActive ? "🟢 Active" : "🔴 Inactive"}
          </Tag>
          <Tag 
            color={typeColors[page.type] || "gray"} 
            className="text-sm font-semibold px-3 py-1"
          >
            {page.type.toUpperCase()}
          </Tag>
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarOutlined />
            <Text>Updated: {formatDate(page.updatedAt)}</Text>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* MAIN CONTENT SECTION */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size="large" className="w-full">
            {/* PAGE DETAILS CARD */}
            <Card 
              className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white to-blue-50"
              title={
                <div className="flex items-center gap-2">
                  <FileTextOutlined className="text-blue-600" />
                  <Title level={3} className="m-0 text-gray-800">Page Details</Title>
                </div>
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div className="space-y-2">
                    <Text strong className="text-gray-600">Internal Name:</Text>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <Text className="text-gray-800 font-medium">{page.name}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="space-y-2">
                    <Text strong className="text-gray-600">URL Slug:</Text>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <Text className="text-gray-800 font-medium">{page.slug}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="space-y-2">
                    <Text strong className="text-gray-600">Full URL:</Text>
                    <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                      <LinkOutlined className="text-blue-500" />
                      <Text className="text-blue-600 font-medium">{page.url}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="space-y-2">
                    <Text strong className="text-gray-600">Display Order:</Text>
                    <div className="p-3 bg-gray-50 rounded-lg border text-center">
                      <Tag color="blue" className="text-lg font-bold">
                        #{page.order}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* CONTENT SECTION */}
            {(page.subtitle || page.description || page.content) && (
              <Card 
                className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white to-green-50"
                title={
                  <div className="flex items-center gap-2">
                    <EditOutlined className="text-green-600" />
                    <Title level={3} className="m-0 text-gray-800">Content</Title>
                  </div>
                }
              >
                <Space direction="vertical" size="middle" className="w-full">
                  {page.subtitle && (
                    <div>
                      <Text strong className="text-gray-600 block mb-2">Subtitle:</Text>
                      <Paragraph className="text-lg text-gray-800 bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                        {page.subtitle}
                      </Paragraph>
                    </div>
                  )}
                  
                  {page.description && (
                    <div>
                      <Text strong className="text-gray-600 block mb-2">Description:</Text>
                      <Paragraph className="text-gray-700 bg-white p-4 rounded-lg border">
                        {page.description}
                      </Paragraph>
                    </div>
                  )}
                  
                  {page.content && (
                    <div>
                      <Text strong className="text-gray-600 block mb-2">Main Content:</Text>
                      <div className="bg-white p-4 rounded-lg border max-h-60 overflow-y-auto">
                        <Paragraph className="text-gray-700 whitespace-pre-wrap">
                          {page.content}
                        </Paragraph>
                      </div>
                    </div>
                  )}
                </Space>
              </Card>
            )}

            {/* SEO INFORMATION */}
            <Card 
              className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white to-purple-50"
              title={
                <div className="flex items-center gap-2">
                  <EyeOutlined className="text-purple-600" />
                  <Title level={3} className="m-0 text-gray-800">SEO Information</Title>
                </div>
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <div className="space-y-2">
                    <Text strong className="text-gray-600">Meta Title:</Text>
                    <div className="p-3 bg-white rounded-lg border">
                      <Text className="text-gray-800">{page.metaTitle || "Not set"}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24}>
                  <div className="space-y-2">
                    <Text strong className="text-gray-600">Meta Description:</Text>
                    <div className="p-3 bg-white rounded-lg border">
                      <Text className="text-gray-800">{page.metaDescription || "Not set"}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24}>
                  <div className="space-y-2">
                    <Text strong className="text-gray-600">Canonical URL:</Text>
                    <div className="p-3 bg-white rounded-lg border flex items-center gap-2">
                      <LinkOutlined className="text-purple-500" />
                      <Text className="text-purple-600 break-all">{page.canonicalUrl || "Not set"}</Text>
                    </div>
                  </div>
                </Col>
                {page.metaKeywords && page.metaKeywords.length > 0 && (
                  <Col xs={24}>
                    <div className="space-y-2">
                      <Text strong className="text-gray-600">Meta Keywords:</Text>
                      <div className="p-3 bg-white rounded-lg border">
                        <Space wrap>
                          {page.metaKeywords.map((keyword: string, index: number) => (
                            <Tag 
                              key={index} 
                              color="purple" 
                              className="flex items-center gap-1"
                            >
                              <TagOutlined />
                              {keyword}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </Card>
          </Space>
        </Col>

        {/* SIDEBAR SECTION */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" className="w-full">
            {/* DESIGN SETTINGS */}
            <Card 
              className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white to-orange-50"
              title={
                <div className="flex items-center gap-2">
                  <BgColorsOutlined className="text-orange-600" />
                  <Title level={4} className="m-0 text-gray-800">Design Settings</Title>
                </div>
              }
            >
              <Space direction="vertical" size="middle" className="w-full">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <Text strong>Navbar Visibility:</Text>
                  <Tag color={page.navbarShow ? "green" : "red"}>
                    {page.navbarShow ? "Visible" : "Hidden"}
                  </Tag>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <Text strong>Background Color:</Text>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: page.backgroundColor }}
                    />
                    <Text code>{page.backgroundColor}</Text>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <Text strong>Text Color:</Text>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: page.textColor }}
                    />
                    <Text code>{page.textColor}</Text>
                  </div>
                </div>
              </Space>
            </Card>

            {/* BACKGROUND IMAGE */}
            {page.backgroundImage && (
              <Card 
                className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white to-pink-50"
                title={
                  <div className="flex items-center gap-2">
                    <EyeOutlined className="text-pink-600" />
                    <Title level={4} className="m-0 text-gray-800">Background Image</Title>
                  </div>
                }
              >
                <div className="text-center">
                  <Image
                    src={page.backgroundImage}
                    alt="Background"
                    className="rounded-lg shadow-md max-h-48 object-cover"
                    placeholder={
                      <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                        <Text className="text-gray-400">Loading image...</Text>
                      </div>
                    }
                  />
                  <Text className="block mt-2 text-gray-500 text-sm break-all">
                    {page.backgroundImage.split('/').pop()}
                  </Text>
                </div>
              </Card>
            )}

            {/* PAGE METADATA */}
            <Card 
              className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white to-gray-100"
              title={
                <Title level={4} className="m-0 text-gray-800">Page Metadata</Title>
              }
            >
              <Space direction="vertical" size="small" className="w-full">
                <div className="flex justify-between p-2">
                  <Text className="text-gray-600">Page ID:</Text>
                  <Text strong className="text-gray-800">{page.id}</Text>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between p-2">
                  <Text className="text-gray-600">Created:</Text>
                  <Text className="text-gray-800">{formatDate(page.createdAt)}</Text>
                </div>
                <div className="flex justify-between p-2">
                  <Text className="text-gray-600">Last Updated:</Text>
                  <Text className="text-gray-800">{formatDate(page.updatedAt)}</Text>
                </div>
                {page.parentId && (
                  <>
                    <Divider className="my-2" />
                    <div className="flex justify-between p-2">
                      <Text className="text-gray-600">Parent Page ID:</Text>
                      <Text strong className="text-blue-600">{page.parentId}</Text>
                    </div>
                  </>
                )}
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* CHILD PAGES SECTION */}
      {page.children && page.children.length > 0 && (
        <Card 
          className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-white to-indigo-50 mt-8"
          title={
            <div className="flex items-center gap-2">
              <FileTextOutlined className="text-indigo-600" />
              <Title level={3} className="m-0 text-gray-800">
                Child Pages ({page.children.length})
              </Title>
            </div>
          }
        >
          <Row gutter={[16, 16]}>
            {page.children.map((child: any) => (
              <Col xs={24} sm={12} lg={8} key={child.id}>
                <Card
                  className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-xl"
                  bodyStyle={{ padding: '16px' }}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Title level={5} className="m-0 text-gray-800 line-clamp-2 flex-1">
                        {child.title}
                      </Title>
                      <Tag 
                        color={typeColors[child.type] || "gray"} 
                      >
                        {child.type}
                      </Tag>
                    </div>
                    
                    <div className="flex items-center gap-1 text-blue-600">
                      <LinkOutlined className="text-sm" />
                      <Text className="text-sm font-medium">{child.url}</Text>
                    </div>

                    <div className="flex justify-between items-center">
                      <Tag color={child.isActive ? "green" : "red"}>
                        {child.isActive ? "Active" : "Inactive"}
                      </Tag>
                      <Tag color="blue">
                        Order: {child.order}
                      </Tag>
                    </div>

                    {child.metaTitle && (
                      <Text className="block text-gray-600 text-sm line-clamp-2">
                        {child.metaTitle}
                      </Text>
                    )}
                    
                    {child.content && (
                      <Text className="block text-gray-500 text-xs line-clamp-3">
                        {child.content}
                      </Text>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* EMPTY STATE FOR NO CHILDREN */}
      {(!page.children || page.children.length === 0) && (
        <Card className="rounded-2xl shadow-lg border-0 text-center py-12 bg-gray-50">
          <FileTextOutlined className="text-4xl text-gray-400 mb-4" />
          <Title level={4} className="text-gray-500">No Child Pages</Title>
          <Text className="text-gray-400">This page doesn't have any child pages yet.</Text>
        </Card>
      )}
    </div>
  );
}