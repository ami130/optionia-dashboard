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
  Collapse,
  Badge,
  Tooltip,
  Grid,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  TagOutlined,
  FolderOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  ReadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { baseUrl } from "../../../../utilities/baseQuery";
import { CSSProperties } from "react";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

export default function ViewBlogs() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blogData, isLoading, error } = useGetSingleBlogQuery(slug);
  const screens = useBreakpoint();

  // Enhanced CSS Styles with better responsive design
  const styles: { [key: string]: CSSProperties } = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    headerInner: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: screens.xs ? "20px 16px" : "32px 24px",
    },
    mainContainer: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: screens.xs ? "20px 12px" : "40px 20px",
    },
    loadingContainer: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    errorContainer: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    featuredBadge: {
      position: "absolute",
      top: "16px",
      right: "16px",
      zIndex: 10,
    },
    imageContainer: {
      position: "relative",
      height: screens.xs ? "250px" : screens.md ? "400px" : "500px",
      borderRadius: screens.xs ? "0" : "12px 12px 0 0",
      overflow: "hidden",
    },
    metaContainer: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: screens.xs ? "12px" : "20px",
      color: "#6b7280",
      marginBottom: "24px",
      padding: screens.xs ? "16px 0" : "24px 0",
    },
    tagsContainer: {
      marginBottom: "24px",
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    blogContent: {
      lineHeight: 1.8,
      color: "#374151",
      fontSize: screens.xs ? "15px" : "16px",
      maxWidth: "100%",
      overflowWrap: "break-word",
    },
    blogContentHeading: {
      marginTop: "1.5em",
      marginBottom: "0.5em",
      color: "#1f2937",
      fontWeight: 600,
    },
    blogContentParagraph: {
      marginBottom: "1.2em",
      textAlign: "justify",
    },
    authorCard: {
      textAlign: "center",
      padding: screens.xs ? "16px" : "24px",
    },
    metaItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: "8px 0",
      borderBottom: "1px solid #f1f5f9",
    },
    footerActions: {
      display: "flex",
      flexDirection: screens.xs ? "column" : "row",
      justifyContent: "space-between",
      alignItems: screens.xs ? "stretch" : "center",
      gap: "16px",
      padding: screens.xs ? "16px" : "24px",
      background: "#f8fafc",
      borderRadius: "12px",
      marginTop: "32px",
    },
    seoSection: {
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "20px",
    },
    seoScore: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "16px",
      padding: "16px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    socialShare: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
    sidebarCard: {
      borderRadius: "12px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: "none",
      overflow: "hidden",
    },
    mainContentCard: {
      borderRadius: "12px",
      boxShadow:
        "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      border: "none",
      overflow: "hidden",
      background: "white",
    },
    gradientText: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    statCard: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      borderRadius: "12px",
      padding: "20px",
      textAlign: "center",
    },
  };

  if (isLoading)
    return (
      <div style={styles.loadingContainer}>
        <Space direction="vertical" size="large" align="center">
          <Spin size="large" />
          <Text style={{ color: "white", fontSize: "18px" }}>
            Loading Blog Content...
          </Text>
        </Space>
      </div>
    );

  if (error)
    return (
      <div style={styles.errorContainer}>
        <Card
          style={{
            maxWidth: "500px",
            textAlign: "center",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{ fontSize: "64px", color: "#ef4444", marginBottom: "16px" }}
          >
            ❌
          </div>
          <Title level={3} style={{ color: "#ef4444", marginBottom: "16px" }}>
            Error Loading Blog
          </Title>
          <Paragraph style={{ color: "#6b7280", marginBottom: "24px" }}>
            We encountered an issue while loading the blog post. Please try
            again later.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            onClick={() => window.location.reload()}
            style={{ borderRadius: "8px" }}
          >
            Retry
          </Button>
        </Card>
      </div>
    );

  if (!blogData)
    return (
      <div style={styles.errorContainer}>
        <Card
          style={{
            maxWidth: "500px",
            textAlign: "center",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{ fontSize: "64px", color: "#6b7280", marginBottom: "16px" }}
          >
            🔍
          </div>
          <Title level={3} style={{ marginBottom: "16px" }}>
            Blog Not Found
          </Title>
          <Paragraph style={{ color: "#6b7280", marginBottom: "24px" }}>
            The blog post you're looking for doesn't exist or may have been
            moved.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            href="/blog"
            style={{ borderRadius: "8px" }}
          >
            Back to Blog
          </Button>
        </Card>
      </div>
    );

  const blog = blogData?.data || blogData;
  const metaData =
    typeof blog.metaData === "string"
      ? JSON.parse(blog.metaData)
      : blog.metaData;
  const seoData = blogData?.data?.seo || {};
  const openGraphData = blog.openGraph || seoData.openGraph || {};
  const twitterData = blog.twitter || seoData.twitter || {};

  console.log("openGraphData", openGraphData, twitterData);

  // Calculate SEO Score
  const calculateSeoScore = () => {
    let score = 0;
    let maxScore = 0;

    // Meta Title
    maxScore += 20;
    if (metaData?.metaTitle && metaData.metaTitle.length > 0) {
      score += 10;
      if (metaData.metaTitle.length >= 50 && metaData.metaTitle.length <= 60) {
        score += 10;
      }
    }

    // Meta Description
    maxScore += 20;
    if (metaData?.metaDescription && metaData.metaDescription.length > 0) {
      score += 10;
      if (
        metaData.metaDescription.length >= 120 &&
        metaData.metaDescription.length <= 160
      ) {
        score += 10;
      }
    }

    // Content
    maxScore += 20;
    if (blog.content && blog.content.length > 300) {
      score += 20;
    }

    // Images
    maxScore += 10;
    if (blog.thumbnailUrl) {
      score += 10;
    }

    // Keywords
    maxScore += 10;
    if (metaData?.metaKeywords && metaData.metaKeywords.length > 0) {
      score += 10;
    }

    // URL Structure
    maxScore += 10;
    if (blog.slug && blog.slug.length > 0) {
      score += 10;
    }

    // Headings
    maxScore += 10;
    if (
      blog.content &&
      blog.content.includes("<h1") &&
      blog.content.includes("<h2")
    ) {
      score += 10;
    }

    return Math.round((score / maxScore) * 100);
  };

  const seoScore = calculateSeoScore();

  // Get SEO Status Color
  const getSeoStatusColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  // Get SEO Status Text
  const getSeoStatusText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Poor";
  };

  // Share functionality

  return (
    <div style={styles.container}>
      {/* Enhanced Header Section */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <Breadcrumb
            separator="›"
            style={{ color: "rgba(255,255,255,0.8)", marginBottom: "16px" }}
          >
            <Breadcrumb.Item>
              <a href="/" style={{ color: "rgba(255,255,255,0.9)" }}>
                Home
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/blog" style={{ color: "rgba(255,255,255,0.9)" }}>
                Blog
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span style={{ color: "white", fontWeight: 600 }}>
                {blog.category?.name || "Uncategorized"}
              </span>
            </Breadcrumb.Item>
          </Breadcrumb>

          <Tag
            color="rgba(255,255,255,0.2)"
            style={{
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              marginBottom: "16px",
              backdropFilter: "blur(10px)",
            }}
            icon={<FolderOutlined />}
          >
            {blog.category?.name || "Uncategorized"}
          </Tag>

          <Title
            level={1}
            style={{
              color: "white",
              marginBottom: "16px",
              fontSize: screens.xs ? "28px" : screens.md ? "42px" : "48px",
              lineHeight: 1.2,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {blog.title}
          </Title>

          <Paragraph
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: screens.xs ? "16px" : "18px",
              marginBottom: "24px",
              lineHeight: 1.6,
            }}
          >
            {blog.subtitle}
          </Paragraph>

          {/* Enhanced Meta Information */}
          <div style={styles.metaContainer}>
            <Space size="large" wrap>
              <Space>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={blog.createdBy?.profileImage}
                  style={{ border: "2px solid rgba(255,255,255,0.3)" }}
                />
                <Text style={{ color: "white" }}>
                  {blog.createdBy?.username || "Admin"}
                </Text>
              </Space>

              <Space>
                <CalendarOutlined style={{ color: "rgba(255,255,255,0.8)" }} />
                <Text style={{ color: "white" }}>
                  {dayjs(blog.createdAt).format("MMM DD, YYYY")}
                </Text>
              </Space>

              <Space>
                <ClockCircleOutlined
                  style={{ color: "rgba(255,255,255,0.8)" }}
                />
                <Text style={{ color: "white" }}>
                  {blog.readingTime || 5} min read
                </Text>
              </Space>

              <Space>
                <ReadOutlined style={{ color: "rgba(255,255,255,0.8)" }} />
                <Text style={{ color: "white" }}>
                  {blog.wordCount || 0} words
                </Text>
              </Space>
            </Space>
          </div>
        </div>
      </div>

      <div style={styles.mainContainer}>
        <Row gutter={[32, 32]}>
          {/* Main Content */}
          <Col xs={24} lg={16} xl={17}>
            <Card style={styles.mainContentCard}>
              {/* Featured Image */}
              {blog.thumbnailUrl && (
                <div style={styles.imageContainer}>
                  <Image
                    src={baseUrl + blog.thumbnailUrl}
                    alt={metaData?.metaImage?.alt || blog.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    preview={{
                      mask: (
                        <Space>
                          <EyeOutlined />
                          Preview
                        </Space>
                      ),
                    }}
                    placeholder={
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Spin size="large" />
                      </div>
                    }
                  />
                  {blog.featured && (
                    <div style={styles.featuredBadge}>
                      <Badge.Ribbon
                        text="Featured"
                        color="red"
                        style={{ fontSize: "12px", fontWeight: 600 }}
                      >
                        <div style={{ width: "50px", height: "50px" }}></div>
                      </Badge.Ribbon>
                    </div>
                  )}
                </div>
              )}

              {/* Blog Content */}
              <div style={{ padding: screens.xs ? "20px" : "32px" }}>
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div style={styles.tagsContainer}>
                    <Space wrap>
                      <TagOutlined style={{ color: "#9ca3af" }} />
                      {blog.tags.map((tag: any) => (
                        <Tag
                          key={tag.id}
                          color="blue"
                          style={{ borderRadius: "6px", fontWeight: 500 }}
                        >
                          {tag.name}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                )}

                <Divider />

                {/* Blog Content */}
                <div style={styles.blogContent}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: blog.content || "<p>No content available.</p>",
                    }}
                  />
                </div>

                {/* Additional Images Gallery */}
                {blog.image && blog.image.length > 0 && blog.image[0] && (
                  <div style={{ marginTop: "40px" }}>
                    <Title
                      level={3}
                      style={{ marginBottom: "24px", ...styles.gradientText }}
                    >
                      📸 Image Gallery
                    </Title>
                    <Row gutter={[16, 16]}>
                      {blog.image.map((img: any, index: number) => (
                        <Col key={index} xs={12} md={8} lg={6}>
                          <Card
                            bodyStyle={{ padding: "8px" }}
                            style={{ borderRadius: "8px" }}
                            hoverable
                          >
                            <Image
                              src={baseUrl + img}
                              alt={`${blog.title} - Image ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                              preview={{
                                mask: <EyeOutlined />,
                              }}
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Blog Footer Actions */}
                <div style={styles.footerActions}>
                  <div style={{ textAlign: screens.xs ? "center" : "right" }}>
                    <Text type="secondary" style={{ fontSize: "14px" }}>
                      Last updated:{" "}
                      {dayjs(blog.updatedAt).format("DD MMM YYYY")}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Enhanced Sidebar */}
          <Col xs={24} lg={8} xl={7}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* SEO Score Card */}
              <Card
                title={
                  <Space>
                    <SearchOutlined />
                    SEO Analysis
                  </Space>
                }
                size="default"
                style={styles.sidebarCard}
              >
                <div style={styles.seoScore}>
                  <Badge
                    count={seoScore}
                    showZero
                    color={getSeoStatusColor(seoScore)}
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <div>
                    <Text strong style={{ fontSize: "16px" }}>
                      {getSeoStatusText(seoScore)}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Overall SEO Score
                    </Text>
                  </div>
                </div>

                <Collapse size="small" ghost>
                  <Panel header="View SEO Details" key="1">
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div style={styles.metaItem}>
                        <Text type="secondary">Meta Title:</Text>
                        <Tooltip title={metaData?.metaTitle || "Not set"}>
                          <InfoCircleOutlined />
                        </Tooltip>
                      </div>
                      <div style={styles.metaItem}>
                        <Text type="secondary">Meta Description:</Text>
                        <Tooltip title={metaData?.metaDescription || "Not set"}>
                          <InfoCircleOutlined />
                        </Tooltip>
                      </div>
                      <div style={styles.metaItem}>
                        <Text type="secondary">Keywords:</Text>
                        <Text strong>
                          {metaData?.metaKeywords?.length || 0}
                        </Text>
                      </div>
                    </Space>
                  </Panel>
                </Collapse>
              </Card>

              {/* Author Info */}
              <Card
                title="👤 About the Author"
                size="default"
                style={styles.sidebarCard}
              >
                <div style={styles.authorCard}>
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    src={blog.createdBy?.profileImage}
                    style={{
                      marginBottom: "16px",
                      border: "4px solid #e2e8f0",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Title level={5} style={{ marginBottom: "8px" }}>
                    {blog.createdBy?.username || "Admin"}
                  </Title>
                  <Paragraph type="secondary" style={{ marginBottom: "16px" }}>
                    {blog.createdBy?.email}
                  </Paragraph>
                  <Tag color="blue" icon={<FileTextOutlined />}>
                    {blog.authors?.length || 1} Article(s)
                  </Tag>
                </div>
              </Card>

              {/* Article Stats */}
              <Card
                title="📊 Article Statistics"
                size="default"
                style={styles.sidebarCard}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div style={styles.metaItem}>
                    <Text type="secondary">Status:</Text>
                    <Tag
                      color={blog.status === "published" ? "green" : "orange"}
                      style={{ borderRadius: "6px" }}
                    >
                      {blog.status?.toUpperCase()}
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

                  <div style={styles.metaItem}>
                    <Text type="secondary">Reading Time:</Text>
                    <Text strong>{blog.readingTime || 5} min</Text>
                  </div>
                </Space>
              </Card>

              {/* Quick Stats */}
              <div style={styles.statCard}>
                <Title
                  level={4}
                  style={{ color: "white", marginBottom: "8px" }}
                >
                  📈 Quick Stats
                </Title>
                <Row gutter={[16, 16]} style={{ textAlign: "center" }}>
                  <Col span={12}>
                    <Text style={{ color: "white", fontSize: "12px" }}>
                      WORDS
                    </Text>
                    <br />
                    <Text strong style={{ color: "white", fontSize: "18px" }}>
                      {blog.wordCount}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text style={{ color: "white", fontSize: "12px" }}>
                      READ TIME
                    </Text>
                    <br />
                    <Text strong style={{ color: "white", fontSize: "18px" }}>
                      {blog.readingTime || 5}m
                    </Text>
                  </Col>
                </Row>
              </div>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}
