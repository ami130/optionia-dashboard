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
  List,
  FloatButton,
  Progress,
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
  FileTextOutlined,
  ArrowUpOutlined,
  LinkOutlined,
  StarOutlined,
  RocketOutlined,
  FireOutlined,
  CrownOutlined,
  BulbOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { baseUrl } from "../../../../utilities/baseQuery";
import { CSSProperties, useState, useEffect } from "react";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

export default function ViewBlogs() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blogData, isLoading, error } = useGetSingleBlogQuery(slug);
  const screens = useBreakpoint();
  const [tableOfContents, setTableOfContents] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);

  // Modern CSS Styles with glassmorphism and gradients
  const styles: { [key: string]: CSSProperties } = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      position: "relative",
      overflow: "hidden",
    },
    headerOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
    },
    headerInner: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: screens.xs ? "40px 20px" : "80px 40px",
      position: "relative",
      zIndex: 2,
    },
    mainContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: screens.xs ? "20px 16px" : "40px 24px",
    },
    loadingContainer: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    featuredBadge: {
      position: "absolute",
      top: "20px",
      right: "20px",
      zIndex: 10,
    },
    imageContainer: {
      position: "relative",
      height: screens.xs ? "300px" : screens.md ? "450px" : "500px",
      borderRadius: "20px",
      overflow: "hidden",
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
      fontSize: "17px",
      maxWidth: "100%",
      overflowWrap: "break-word",
    },
    authorCard: {
      textAlign: "center",
      padding: "24px",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "16px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
    },
    metaItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: "12px 0",
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    },
    footerActions: {
      display: "flex",
      flexDirection: screens.xs ? "column" : "row",
      justifyContent: "space-between",
      alignItems: screens.xs ? "stretch" : "center",
      gap: "16px",
      padding: "32px",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "20px",
      marginTop: "48px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    },
    sidebarCard: {
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      overflow: "hidden",
      backdropFilter: "blur(10px)",
    },
    mainContentCard: {
      borderRadius: "20px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
      overflow: "hidden",
      backdropFilter: "blur(10px)",
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
      borderRadius: "16px",
      padding: "24px",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
    },
    tableOfContents: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "16px",
      padding: "28px",
      marginBottom: "32px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    },
    tocItem: {
      padding: "12px 16px",
      margin: "6px 0",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      borderLeft: "4px solid transparent",
      background: "transparent",
    },
    tocItemActive: {
      background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
      borderLeft: "4px solid #667eea",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.1)",
      transform: "translateX(4px)",
    },
    actionButtons: {
      display: "flex",
      gap: "12px",
      marginBottom: "32px",
      flexWrap: "wrap",
    },
    promotionalSection: {
      background: "linear-gradient(135deg, #fff9db 0%, #ffe7ba 100%)",
      border: "1px solid #ffd591",
      borderRadius: "16px",
      padding: "28px",
      margin: "32px 0",
      boxShadow: "0 10px 30px rgba(255, 213, 145, 0.2)",
    },
    faqSection: {
      background: "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
      border: "1px solid #b7eb8f",
      borderRadius: "16px",
      padding: "28px",
      margin: "32px 0",
      boxShadow: "0 10px 30px rgba(183, 235, 143, 0.2)",
    },
    engagementStats: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "20px",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "16px",
      marginBottom: "24px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    readingProgress: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",
      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
      transform: "scaleX(0)",
      transformOrigin: "left",
      transition: "transform 0.3s ease",
      zIndex: 1000,
    },
    keyTakeawaysCard: {
      background: "linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%)",
      border: "1px solid #91d5ff",
      borderRadius: "16px",
      marginTop: "32px",
      boxShadow: "0 10px 30px rgba(145, 213, 255, 0.2)",
    },
    imageGallery: {
      marginTop: "40px",
    },
    galleryTitle: {
      marginBottom: "24px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
  };

  // Reading progress indicator
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  // Generate Table of Contents from H2 tags
  useEffect(() => {
    if (blogData) {
      const blog = blogData?.data || blogData;
      const parser = new DOMParser();
      const doc = parser.parseFromString(blog.content || "", "text/html");
      const headings = doc.querySelectorAll("h2, h3");

      const toc = Array.from(headings).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent || `Section ${index + 1}`,
          level: parseInt(heading.tagName.charAt(1)),
        };
      });

      setTableOfContents(toc);
    }
  }, [blogData]);

  // Intersection Observer for active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    tableOfContents.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tableOfContents]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  // Calculate SEO Score
  const calculateSeoScore = () => {
    if (!blogData) return 0;

    const blog = blogData?.data || blogData;
    const metaData =
      typeof blog.metaData === "string"
        ? JSON.parse(blog.metaData)
        : blog.metaData;

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

  const getSeoStatusColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  const getSeoStatusText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Poor";
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
      <div
        style={{
          ...styles.loadingContainer,
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
        }}
      >
        <Card
          style={{
            maxWidth: "500px",
            textAlign: "center",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>❌</div>
          <Title level={3} style={{ marginBottom: "16px" }}>
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
            style={{ borderRadius: "12px", height: "48px", padding: "0 32px" }}
          >
            Retry
          </Button>
        </Card>
      </div>
    );

  if (!blogData)
    return (
      <div style={styles.loadingContainer}>
        <Card
          style={{
            maxWidth: "500px",
            textAlign: "center",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            border: "none",
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
            style={{ borderRadius: "12px", height: "48px", padding: "0 32px" }}
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
  const seoScore = calculateSeoScore();

  return (
    <div style={styles.container}>
      {/* Reading Progress Bar */}
      <div
        style={{
          ...styles.readingProgress,
          transform: `scaleX(${readingProgress / 100})`,
        }}
      />

      {/* Enhanced Header Section */}
      <div style={styles.header}>
        <div style={styles.headerOverlay} />
        <div style={styles.headerInner}>
          <Breadcrumb
            separator="›"
            style={{
              color: "rgba(255,255,255,0.8)",
              marginBottom: "24px",
              fontSize: "14px",
            }}
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

          <div style={{ marginBottom: "24px" }}>
            <Tag
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "4px 16px",
                fontSize: "14px",
                fontWeight: 500,
              }}
              icon={<FolderOutlined />}
            >
              {blog.category?.name || "Uncategorized"}
            </Tag>
            {blog.featured && (
              <Tag
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "4px 16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginLeft: "8px",
                }}
                icon={<CrownOutlined />}
              >
                Featured
              </Tag>
            )}
          </div>

          <Title
            level={1}
            style={{
              color: "white",
              marginBottom: "24px",
              fontSize: screens.xs ? "32px" : screens.md ? "48px" : "56px",
              lineHeight: 1.2,
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {blog.title}
          </Title>

          <Paragraph
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: screens.xs ? "18px" : "20px",
              marginBottom: "32px",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            {blog.subtitle}
          </Paragraph>

          {/* Enhanced Meta Information */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "24px",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            <Space size="middle" wrap>
              <Space>
                <Avatar
                  size="default"
                  icon={<UserOutlined />}
                  src={blog.createdBy?.profileImage}
                  style={{
                    border: "3px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.2)",
                  }}
                />
                <div>
                  <Text strong style={{ color: "white", display: "block" }}>
                    {blog.createdBy?.username || "Admin"}
                  </Text>
                  <Text
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}
                  >
                    Author
                  </Text>
                </div>
              </Space>

              <Space>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalendarOutlined
                    style={{ color: "white", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <Text strong style={{ color: "white", display: "block" }}>
                    {dayjs(blog.createdAt).format("MMM DD, YYYY")}
                  </Text>
                  <Text
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}
                  >
                    Published
                  </Text>
                </div>
              </Space>

              <Space>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ClockCircleOutlined
                    style={{ color: "white", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <Text strong style={{ color: "white", display: "block" }}>
                    {blog.readingTime || 5} min read
                  </Text>
                  <Text
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}
                  >
                    Reading time
                  </Text>
                </div>
              </Space>
            </Space>
          </div>
        </div>
      </div>

      <div className=" my-5">
        <Row gutter={[32, 32]}>
          {/* Main Content */}
          <Col xs={24} lg={16} xl={17}>
            <Card style={styles.mainContentCard} bodyStyle={{ padding: 0 }}>
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
                </div>
              )}

              {/* Blog Content */}
              <div className="px-5 my-5">
                {/* Table of Contents */}
                {tableOfContents.length > 0 && (
                  <div style={styles.tableOfContents}>
                    <Title level={3} style={{ ...styles.gradientText }}>
                      📑 Table of Contents
                    </Title>
                    <List
                      dataSource={tableOfContents}
                      renderItem={(item) => (
                        <List.Item style={{ padding: "2px 0", border: "none" }}>
                          <div
                            style={{
                              ...styles.tocItem,
                              ...(activeHeading === item.id
                                ? styles.tocItemActive
                                : {}),
                              paddingLeft: `${(item.level - 2) * 20 + 16}px`,
                            }}
                            onClick={() => scrollToHeading(item.id)}
                          >
                            <LinkOutlined
                              style={{ marginRight: "12px", color: "#667eea" }}
                            />
                            <Text
                              style={{
                                color:
                                  activeHeading === item.id
                                    ? "#667eea"
                                    : "#4b5563",
                                fontWeight:
                                  activeHeading === item.id ? 600 : 400,
                                fontSize: "15px",
                              }}
                            >
                              {item.text}
                            </Text>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                )}

                {/* Promotional Section */}
                {blog.promotionalData && blog.promotionalData.title && (
                  <div style={styles.promotionalSection}>
                    <Row gutter={[16, 16]} align="middle">
                      {blog.promotionalData.image && (
                        <Col xs={24} md={6}>
                          <Image
                            src={baseUrl + blog?.promotionalData.image}
                            alt={blog.promotionalData.title}
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "12px",
                            }}
                          />
                        </Col>
                      )}
                      <Col xs={24} md={blog.promotionalData.image ? 18 : 24}>
                        <Title level={4} style={{ color: "#d48806" }}>
                          🎯 {blog.promotionalData.title}
                        </Title>
                        {blog.promotionalData.keywords &&
                          blog.promotionalData.keywords.length > 0 && (
                            <Space wrap style={{ marginBottom: "16px" }}>
                              {blog.promotionalData.keywords.map(
                                (keyword: string, index: number) => (
                                  <Tag
                                    key={index}
                                    color="orange"
                                    style={{ borderRadius: "12px" }}
                                  >
                                    {keyword}
                                  </Tag>
                                )
                              )}
                            </Space>
                          )}
                        {blog.promotionalData.promotional_url && (
                          <Button
                            type="primary"
                            size="large"
                            href={blog.promotionalData.promotional_url}
                            target="_blank"
                            style={{ borderRadius: "12px", height: "44px" }}
                            icon={<RocketOutlined />}
                          >
                            Explore More
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div style={styles.tagsContainer}>
                    <Space wrap>
                      <TagOutlined
                        style={{ color: "#9ca3af", fontSize: "16px" }}
                      />
                      {blog.tags.map((tag: any) => (
                        <Tag
                          key={tag.id}
                          color="blue"
                          style={{
                            borderRadius: "12px",
                            fontWeight: 500,
                            padding: "4px 12px",
                            fontSize: "13px",
                          }}
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
                    className="blog-content"
                    dangerouslySetInnerHTML={{
                      __html: blog.content || "<p>No content available.</p>",
                    }}
                  />
                </div>

                {/* FAQ Section */}
                {blog.faqData &&
                  blog.faqData.items &&
                  blog.faqData.items.length > 0 && (
                    <div style={styles.faqSection}>
                      <Title
                        level={3}
                        style={{ marginBottom: "24px", color: "#389e0d" }}
                      >
                        ❓{" "}
                        {blog.faqData.faqTitle || "Frequently Asked Questions"}
                      </Title>
                      <Collapse
                        accordion
                        size="large"
                        style={{ background: "transparent" }}
                      >
                        {blog.faqData.items.map((faq: any, index: number) => (
                          <Panel
                            header={
                              <Space>
                                <BulbOutlined style={{ color: "#389e0d" }} />
                                {faq.question}
                              </Space>
                            }
                            key={index}
                            style={{
                              marginBottom: "12px",
                              border: "1px solid #b7eb8f",
                              borderRadius: "12px",
                              background: "rgba(255,255,255,0.5)",
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                              style={{ lineHeight: 1.6, paddingLeft: "8px" }}
                            />
                          </Panel>
                        ))}
                      </Collapse>
                    </div>
                  )}

                {/* Key Takeaways */}
                {blog.keyTakeaways && (
                  <Card
                    title={
                      <Space>
                        <CheckCircleOutlined style={{ color: "#1890ff" }} />
                        Key Takeaways
                      </Space>
                    }
                    style={styles.keyTakeawaysCard}
                    headStyle={{
                      border: "none",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: blog.keyTakeaways }}
                      style={{ lineHeight: 1.6, fontSize: "15px" }}
                    />
                  </Card>
                )}

                {/* Additional Images Gallery */}
                {blog.image && blog.image.length > 0 && blog.image[0] && (
                  <div style={styles.imageGallery}>
                    <Title level={3} style={styles.galleryTitle}>
                      📸 Image Gallery
                    </Title>
                    <Row gutter={[16, 16]}>
                      {blog.image.map((img: any, index: number) => (
                        <Col key={index} xs={12} md={8} lg={6}>
                          <Card
                            bodyStyle={{ padding: "12px" }}
                            style={{
                              borderRadius: "12px",
                              border: "1px solid rgba(0, 0, 0, 0.06)",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                            }}
                            hoverable
                          >
                            <Image
                              src={baseUrl + img}
                              alt={`${blog.title} - Image ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "140px",
                                objectFit: "cover",
                                borderRadius: "8px",
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
                style={styles.sidebarCard}
                headStyle={{
                  border: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "16px",
                    padding: "16px",
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    borderRadius: "12px",
                  }}
                >
                  <Badge
                    count={seoScore}
                    showZero
                    color={getSeoStatusColor(seoScore)}
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <div>
                    <Text strong style={{ fontSize: "16px", display: "block" }}>
                      {getSeoStatusText(seoScore)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Overall SEO Score
                    </Text>
                  </div>
                </div>

                <Progress
                  percent={seoScore}
                  strokeColor={{
                    "0%": "#667eea",
                    "100%": "#764ba2",
                  }}
                  style={{ marginBottom: "16px" }}
                />

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
                style={styles.sidebarCard}
                headStyle={{
                  border: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                <div style={styles.authorCard}>
                  <Avatar
                    size={96}
                    icon={<UserOutlined />}
                    src={blog.createdBy?.profileImage}
                    style={{
                      marginBottom: "20px",
                      border: "4px solid #e2e8f0",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Title level={4} style={{ marginBottom: "8px" }}>
                    {blog.createdBy?.username || "Admin"}
                  </Title>
                  <Paragraph
                    type="secondary"
                    style={{ marginBottom: "16px", fontSize: "14px" }}
                  >
                    {blog.createdBy?.email}
                  </Paragraph>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Tag
                      color="blue"
                      icon={<FileTextOutlined />}
                      style={{ borderRadius: "12px" }}
                    >
                      {blog.authors?.length || 1} Articles
                    </Tag>
                    <Tag
                      color="green"
                      icon={<StarOutlined />}
                      style={{ borderRadius: "12px" }}
                    >
                      Pro Writer
                    </Tag>
                  </div>
                </div>
              </Card>

              {/* Article Stats */}
              <Card
                title="📊 Article Statistics"
                style={styles.sidebarCard}
                headStyle={{
                  border: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div style={styles.metaItem}>
                    <Text type="secondary">Status:</Text>
                    <Tag
                      color={blog.status === "published" ? "green" : "orange"}
                      style={{ borderRadius: "12px", fontWeight: 500 }}
                    >
                      {blog.status?.toUpperCase() || "DRAFT"}
                    </Tag>
                  </div>

                  <div style={styles.metaItem}>
                    <Text type="secondary">Type:</Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {blog.blogType}
                    </Text>
                  </div>

                  <div style={styles.metaItem}>
                    <Text type="secondary">Category:</Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {blog.category?.name}
                    </Text>
                  </div>

                  <div style={styles.metaItem}>
                    <Text type="secondary">Word Count:</Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {blog.wordCount}
                    </Text>
                  </div>

                  <div style={styles.metaItem}>
                    <Text type="secondary">Reading Time:</Text>
                    <Text strong style={{ fontSize: "14px" }}>
                      {blog.readingTime || 5} min
                    </Text>
                  </div>
                </Space>
              </Card>

              {/* Quick Stats */}
              <div style={styles.statCard}>
                <Title
                  level={4}
                  style={{ color: "white", marginBottom: "16px" }}
                >
                  📈 Quick Stats
                </Title>
                <Row gutter={[16, 16]} style={{ textAlign: "center" }}>
                  <Col span={8}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          color: "white",
                          fontSize: "18px",
                          display: "block",
                        }}
                      >
                        {blog.wordCount}
                      </Text>
                      <Text
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "12px",
                        }}
                      >
                        WORDS
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          color: "white",
                          fontSize: "18px",
                          display: "block",
                        }}
                      >
                        {blog.readingTime || 5}m
                      </Text>
                      <Text
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "12px",
                        }}
                      >
                        READ
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          color: "white",
                          fontSize: "18px",
                          display: "block",
                        }}
                      >
                        {blog.authors?.length || 1}
                      </Text>
                      <Text
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "12px",
                        }}
                      >
                        AUTHORS
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Related Articles */}
              {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
                <Card
                  title={
                    <Space>
                      <FireOutlined />
                      Trending Reads
                    </Space>
                  }
                  style={styles.sidebarCard}
                  headStyle={{
                    border: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  <List
                    dataSource={blog.relatedBlogs.slice(0, 4)}
                    renderItem={(relatedBlog: any) => (
                      <List.Item style={{ padding: "12px 0", border: "none" }}>
                        <Card
                          size="small"
                          style={{
                            width: "100%",
                            cursor: "pointer",
                            borderRadius: "12px",
                            border: "1px solid rgba(0, 0, 0, 0.06)",
                          }}
                          bodyStyle={{ padding: "16px" }}
                          hoverable
                          onClick={() =>
                            (window.location.href = `/blog/${relatedBlog.slug}`)
                          }
                        >
                          <Text
                            strong
                            style={{
                              fontSize: "14px",
                              lineHeight: 1.4,
                              display: "block",
                              marginBottom: "8px",
                            }}
                          >
                            {relatedBlog.title}
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {dayjs(relatedBlog.createdAt).format("MMM DD")}
                            </Text>
                            <Tag color="blue" style={{ borderRadius: "8px" }}>
                              {relatedBlog.readingTime || 5}m
                            </Tag>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                  />
                </Card>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      {/* Floating Action Button */}
      <FloatButton.BackTop
        icon={<ArrowUpOutlined />}
        style={{
          bottom: 24,
          right: 24,
          width: "50px",
          height: "50px",
        }}
      />
    </div>
  );
}
