import { useParams } from "react-router-dom";
import { useGetSingleBlogQuery } from "../api/blogsEndPoints";
import {
  Spin,
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Avatar,
  Divider,
  Image,
  Space,
  Breadcrumb,
  Button,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  ShareAltOutlined,
  TagOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { baseUrl } from "../../../../utilities/baseQuery";
import { CSSProperties } from "react";

const { Title, Paragraph, Text } = Typography;

export default function ViewBlogs() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blogData, isLoading, error } = useGetSingleBlogQuery(slug);

  // Properly typed CSS Styles
  const styles: { [key: string]: CSSProperties } = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
    },
    header: {
      backgroundColor: "white",
      borderBottom: "1px solid #e5e7eb",
    },
    headerInner: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "24px 16px",
    },
    mainContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "32px 16px",
    },
    loadingContainer: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    errorContainer: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    featuredBadge: {
      position: "absolute",
      top: "16px",
      right: "16px",
    },
    imageContainer: {
      position: "relative",
      height: "320px",
    },
    mobileImageContainer: {
      position: "relative",
      height: "200px",
    },
    metaContainer: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "16px",
      color: "#6b7280",
      marginBottom: "24px",
    },
    tagsContainer: {
      marginBottom: "24px",
    },
    blogContent: {
      lineHeight: 1.8,
      color: "#374151",
      fontSize: "16px",
    },
    blogContentHeading: {
      marginTop: "1.5em",
      marginBottom: "0.5em",
      color: "#1f2937",
    },
    blogContentParagraph: {
      marginBottom: "1.2em",
    },
    blogContentImage: {
      borderRadius: "8px",
      margin: "1.5em 0",
      maxWidth: "100%",
      height: "auto",
    },
    blogContentBlockquote: {
      borderLeft: "4px solid #3b82f6",
      paddingLeft: "1em",
      margin: "1.5em 0",
      fontStyle: "italic",
      color: "#6b7280",
    },
    blogContentList: {
      margin: "1em 0",
      paddingLeft: "1.5em",
    },
    blogContentListItem: {
      marginBottom: "0.5em",
    },
    blogContentLink: {
      color: "#3b82f6",
      textDecoration: "none",
    },
    blogContentTable: {
      width: "100%",
      borderCollapse: "collapse",
      margin: "1.5em 0",
    },
    blogContentTableCell: {
      border: "1px solid #e5e7eb",
      padding: "0.75em",
      textAlign: "left",
    },
    blogContentTableHeader: {
      backgroundColor: "#f9fafb",
      fontWeight: 600,
    },
    authorCard: {
      textAlign: "center",
    },
    metaItem: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    footerActions: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    footerActionsDesktop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
  };

  if (isLoading)
    return (
      <div style={styles.loadingContainer}>
        <Spin size="large" tip="Loading blog..." />
      </div>
    );

  if (error)
    return (
      <div style={styles.errorContainer}>
        <Card style={{ textAlign: "center" }}>
          <Title level={3} style={{ color: "#ff4d4f" }}>
            Error loading blog
          </Title>
          <Paragraph>Please try again later</Paragraph>
        </Card>
      </div>
    );

  if (!blogData)
    return (
      <div style={styles.errorContainer}>
        <Card style={{ textAlign: "center" }}>
          <Title level={3}>Blog not found</Title>
          <Paragraph>The blog you're looking for doesn't exist.</Paragraph>
        </Card>
      </div>
    );

  const blog = blogData?.data || blogData;

  // Helper function to convert style object to CSS string
  const styleToCssString = (styleObj: CSSProperties): string => {
    return Object.entries(styleObj)
      .map(([key, value]) => {
        const cssProperty = key.replace(
          /[A-Z]/g,
          (match) => `-${match.toLowerCase()}`
        );
        return `${cssProperty}:${value}`;
      })
      .join(";");
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/blog">Blog</Breadcrumb.Item>
            <Breadcrumb.Item>
              {blog.category?.name || "Uncategorized"}
            </Breadcrumb.Item>
            <Breadcrumb.Item>{blog.title}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <div style={styles.mainContainer}>
        <Row gutter={[32, 32]}>
          {/* Main Content */}
          <Col xs={24} lg={18}>
            <Card
              bordered={false}
              style={{ backgroundColor: "white" }}
              cover={
                blog.thumbnailUrl && (
                  <div
                    style={
                      window.innerWidth < 768
                        ? styles.mobileImageContainer
                        : styles.imageContainer
                    }
                  >
                    <Image
                      src={baseUrl + blog.thumbnailUrl}
                      alt={blog.metaData?.metaImage?.alt || blog.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      preview={false}
                      placeholder={
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Spin size="large" />
                        </div>
                      }
                    />
                  </div>
                )
              }
            >
              {/* Featured Badge */}
              {blog.featured && (
                <div style={styles.featuredBadge}>
                  <Tag
                    color="red"
                    style={{ fontSize: "14px", fontWeight: 600 }}
                  >
                    Featured
                  </Tag>
                </div>
              )}

              {/* Blog Header */}
              <div style={{ marginBottom: "24px" }}>
                <Tag
                  color="blue"
                  icon={<FolderOutlined />}
                  style={{ marginBottom: "16px" }}
                >
                  {blog.category?.name || "Uncategorized"}
                </Tag>

                <Title
                  level={1}
                  style={{
                    fontSize:
                      window.innerWidth < 768
                        ? "28px"
                        : window.innerWidth < 1024
                        ? "36px"
                        : "48px",
                    marginBottom: "16px",
                    lineHeight: 1.2,
                  }}
                >
                  {blog.title}
                </Title>

                <Paragraph
                  style={{
                    fontSize: "20px",
                    color: "#6b7280",
                    marginBottom: "24px",
                    lineHeight: 1.5,
                  }}
                >
                  {blog.subtitle}
                </Paragraph>

                {/* Meta Information */}
                <div style={styles.metaContainer}>
                  <Space>
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                      src={blog.createdBy?.profileImage}
                    />
                    <Text style={{ color: "#6b7280" }}>
                      {blog.createdBy?.username || "Admin"}
                    </Text>
                  </Space>

                  <Space>
                    <CalendarOutlined />
                    <Text style={{ color: "#6b7280" }}>
                      {dayjs(blog.createdAt).format("MMM DD, YYYY")}
                    </Text>
                  </Space>

                  <Space>
                    <ClockCircleOutlined />
                    <Text style={{ color: "#6b7280" }}>
                      {blog.readingTime || 5} min read
                    </Text>
                  </Space>

                  <Space>
                    <EyeOutlined />
                    <Text style={{ color: "#6b7280" }}>
                      {blog.wordCount || 0} words
                    </Text>
                  </Space>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div style={styles.tagsContainer}>
                    <Space wrap>
                      <TagOutlined style={{ color: "#9ca3af" }} />
                      {blog.tags.map((tag: any) => (
                        <Tag key={tag.id} color="default">
                          {tag.name}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                )}
              </div>

              <Divider />

              {/* Blog Content */}
              <div style={{ maxWidth: "none" }}>
                <div
                  style={styles.blogContent}
                  dangerouslySetInnerHTML={{
                    __html: blog.content?.replace(
                      /<(\w+)([^>]*)>/g,
                      (match: string, tag: string, attributes: string) => {
                        const styleMap: { [key: string]: CSSProperties } = {
                          h1: {
                            ...styles.blogContentHeading,
                            fontSize: "2em",
                            fontWeight: 700,
                          },
                          h2: {
                            ...styles.blogContentHeading,
                            fontSize: "1.5em",
                            fontWeight: 600,
                          },
                          h3: {
                            ...styles.blogContentHeading,
                            fontSize: "1.25em",
                            fontWeight: 600,
                          },
                          h4: {
                            ...styles.blogContentHeading,
                            fontSize: "1.1em",
                            fontWeight: 600,
                          },
                          h5: {
                            ...styles.blogContentHeading,
                            fontSize: "1em",
                            fontWeight: 600,
                          },
                          h6: {
                            ...styles.blogContentHeading,
                            fontSize: "0.9em",
                            fontWeight: 600,
                          },
                          p: styles.blogContentParagraph,
                          blockquote: styles.blogContentBlockquote,
                          ul: styles.blogContentList,
                          ol: styles.blogContentList,
                          li: styles.blogContentListItem,
                          a: { ...styles.blogContentLink, cursor: "pointer" },
                          table: styles.blogContentTable,
                          th: {
                            ...styles.blogContentTableCell,
                            ...styles.blogContentTableHeader,
                          },
                          td: styles.blogContentTableCell,
                        };

                        if (styleMap[tag]) {
                          return `<${tag} style="${styleToCssString(styleMap[tag])}"${attributes}>`;
                        }
                        return match;
                      }
                    ),
                  }}
                />
              </div>

              {/* Additional Images */}
              {blog.image && blog.image.length > 1 && (
                <div style={{ marginTop: "32px" }}>
                  <Title level={4}>Gallery</Title>
                  <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                    {blog.image.slice(1).map((img: any, index: number) => (
                      <Col key={index} xs={12} md={8}>
                        <Image
                          src={img}
                          alt={`${blog.title} - Image ${index + 2}`}
                          style={{ borderRadius: "8px" }}
                          preview={{
                            mask: <EyeOutlined />,
                          }}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* Blog Footer */}
              <Divider />

              <div
                style={
                  window.innerWidth < 640
                    ? styles.footerActions
                    : styles.footerActionsDesktop
                }
              >
                <Space>
                  <Text strong>Share this article:</Text>
                  <Button type="text" icon={<ShareAltOutlined />}>
                    Share
                  </Button>
                </Space>

                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  Last updated: {dayjs(blog.updatedAt).format("DD MMM YYYY")}
                </div>
              </div>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={6}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Author Info */}
              <Card title="About the Author" size="small">
                <div style={styles.authorCard}>
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    src={blog.createdBy?.profileImage}
                    style={{ marginBottom: "16px" }}
                  />
                  <Title level={5} style={{ marginBottom: "8px" }}>
                    {blog.createdBy?.username || "Admin"}
                  </Title>
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {blog.createdBy?.email}
                  </Paragraph>
                </div>
              </Card>

              {/* Blog Meta */}
              <Card title="Article Details" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div style={styles.metaItem}>
                    <Text type="secondary">Status:</Text>
                    <Tag
                      color={blog.status === "published" ? "green" : "orange"}
                    >
                      {blog.status}
                    </Tag>
                  </div>

                  <div style={styles.metaItem}>
                    <Text type="secondary">Type:</Text>
                    <Text strong>{blog.blogType}</Text>
                  </div>

                  <div style={styles.metaItem}>
                    <Text type="secondary">Category:</Text>
                    <Text strong>{blog.category?.name}</Text>
                  </div>

                  <div style={styles.metaItem}>
                    <Text type="secondary">Word Count:</Text>
                    <Text strong>{blog.wordCount}</Text>
                  </div>
                </Space>
              </Card>

              {/* SEO Meta Info */}
              {blog.metaData && (
                <Card title="SEO Information" size="small">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <Text strong>Meta Title:</Text>
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        style={{ marginBottom: "8px" }}
                      >
                        {blog.metaData.metaTitle}
                      </Paragraph>
                    </div>

                    <div>
                      <Text strong>Meta Description:</Text>
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 3 }}
                        style={{ marginBottom: 0 }}
                      >
                        {blog.metaData.metaDescription}
                      </Paragraph>
                    </div>
                  </Space>
                </Card>
              )}
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}