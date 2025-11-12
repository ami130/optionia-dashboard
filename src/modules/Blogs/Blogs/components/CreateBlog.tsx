import { useState, useEffect, useRef, useMemo } from "react";
import {
  Col,
  Input,
  Row,
  Form as AntForm,
  Upload,
  Modal,
  Select,
  Switch,
  InputNumber,
  Alert,
  Button,
  Card,
  Space,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form } from "../../../../common/CommonAnt";
import { slugify } from "../../../../common/AutoGenerateSlug/AutoGenerateSlug";
import { useCreateBlogMutation } from "../api/blogsEndPoints";
import { useGetCategoriesQuery } from "../../Categories/api/categoriesEndPoints";
import { useGetUsersQuery } from "../../../User/api/userEndPoints";
import { useGetTagsQuery } from "../../Tag/api/tagsEndPoints";
import { useGetPagesQuery } from "../../../Pages/api/pagesEndPoints";
import JoditEditor from "jodit-react";
import { BlogFAQItem } from "../types/blog.faq.types";
import { blogTypeOptions } from "../types/blogsType";
import {
  defaultJoditConfig,
  faqJoditConfig,
} from "../../../../config/joditConfig";

const CreateBlog = () => {
  const [form] = AntForm.useForm();
  const [thumbnailFileList, setThumbnailFileList] = useState<any[]>([]);
  const [galleryFileList, setGalleryFileList] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isMetaTitleTouched, setIsMetaTitleTouched] = useState(false);
  const [isMetaDescriptionTouched, setIsMetaDescriptionTouched] =
    useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [editorError, setEditorError] = useState<string | null>(null);

  // FAQ State
  const [faqSectionTitle, setFaqSectionTitle] = useState("");
  const [faqItems, setFaqItems] = useState<BlogFAQItem[]>([]);

  const editorRef = useRef<any>(null);
  const faqEditorRefs = useRef<{ [key: string]: any }>({});

  const [createBlog, { isLoading, isSuccess }] = useCreateBlogMutation();
  const { data: categoryData } = useGetCategoriesQuery<any>({});
  const { data: tagsData } = useGetTagsQuery<any>({});
  const { data: userData } = useGetUsersQuery<any>({});
  const { data: pageData } = useGetPagesQuery<any>({});

  const blogPage = pageData?.data?.find(
    (page: any) =>
      page.name?.toLowerCase().includes("blog") ||
      page.title?.toLowerCase().includes("blog")
  );

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setThumbnailFileList([]);
      setGalleryFileList([]);
      setIsPublished(true);
      setIsFeatured(true);
      setIsMetaTitleTouched(false);
      setIsMetaDescriptionTouched(false);
      setEditorContent("");
      setEditorError(null);
      // Reset FAQ state
      setFaqSectionTitle("");
      setFaqItems([]);
    }
    if (blogPage) form.setFieldsValue({ pageId: blogPage.id });
  }, [isSuccess, form, blogPage]);

  // FAQ Functions
  // FAQ Functions
  const addFaqItem = () => {
    const newFaqItem: BlogFAQItem = {
      id: Date.now().toString(),
      question: "",
      answer: "",
    };
    setFaqItems([...faqItems, newFaqItem]);
  };

  const removeFaqItem = (id: string) => {
    setFaqItems(faqItems.filter((item) => item.id !== id));
    // Clean up the editor ref
    if (faqEditorRefs.current[id]) {
      delete faqEditorRefs.current[id];
    }
  };

  const updateFaqItem = (
    id: string,
    field: keyof BlogFAQItem,
    value: string
  ) => {
    setFaqItems(
      faqItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Most Advanced Jodit configuration with all features
  const editorConfig = useMemo(() => defaultJoditConfig, []);
  const faqEditorConfig = useMemo(() => faqJoditConfig, []);

  // Enhanced editor handlers
  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    setEditorError(null);

    // Strip HTML tags to get pure text
    const textContent = newContent.replace(/<[^>]*>/g, "").trim();

    // Calculate word count
    const wordCount = textContent ? textContent.split(/\s+/).length : 0;

    // Estimate reading time (average 200 words/min)
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Update form fields dynamically
    form.setFieldsValue({ wordCount, readingTime });

    // Validate content in real-time
    if (!textContent) {
      setEditorError("Please enter some content for your blog");
    } else if (textContent.length < 50) {
      setEditorError("Content seems too short. Consider adding more details.");
    } else {
      setEditorError(null);
    }
  };

  const handleEditorBlur = (newContent: string) => {
    setEditorContent(newContent);
  };
  const handleFaqAnswerChange = (id: string, newContent: string) => {
    updateFaqItem(id, "answer", newContent);
  };

  const handleFaqAnswerBlur = (id: string, newContent: string) => {
    updateFaqItem(id, "answer", newContent);
  };

  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();

    // Enhanced content validation
    const textContent = editorContent?.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      form.setFields([
        {
          name: "content",
          errors: ["Please enter blog content"],
        },
      ]);
      setEditorError("Blog content is required");
      return;
    }

    if (textContent.length < 50) {
      form.setFields([
        {
          name: "content",
          errors: ["Blog content should be at least 50 characters long"],
        },
      ]);
      setEditorError("Blog content should be at least 50 characters long");
      return;
    }

    console.log("editorContent", editorContent);

    // Basic info
    formData.append("title", values.title);
    formData.append("slug", slugify(values.slug || values.title));
    formData.append("subtitle", values.subtitle);
    formData.append("content", editorContent);
    formData.append("readingTime", values.readingTime.toString());
    formData.append("wordCount", values.wordCount.toString());

    formData.append("featured", isFeatured ? "1" : "0");
    formData.append("status", isPublished.toString());

    formData.append("blogType", values.blogType);

    // IDs
    if (values.categoryId)
      formData.append("categoryId", values.categoryId.toString());
    if (values.authorIds && Array.isArray(values.authorIds)) {
      values.authorIds.forEach((id: number) => {
        formData.append("authorIds[]", id.toString());
      });
    }

    if (values.tagIds && Array.isArray(values.tagIds)) {
      values.tagIds.forEach((id: number) => {
        formData.append("tagIds[]", id.toString());
      });
    }

    if (blogPage) formData.append("pageId", blogPage.id.toString());

    // Images
    const thumbnailFile = thumbnailFileList[0]?.originFileObj;
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    galleryFileList.forEach(
      (file) =>
        file.originFileObj && formData.append(`image`, file.originFileObj)
    );

    // FAQ Data
    if (faqSectionTitle || faqItems.length > 0) {
      const faqData = {
        faqTitle: faqSectionTitle,
        items: faqItems.filter(
          (item) => item.question.trim() && item.answer.trim()
        ),
      };

      formData.append("faqData", JSON.stringify(faqData));
    }

    // Meta data
    const metaData = {
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      metaKeywords: values.metaKeywords || [],
      canonicalUrl: values.canonicalUrl,
    };
    formData.append("metaData", JSON.stringify(metaData));

    await createBlog(formData);
  };

  // Transform API data
  const categoryOptions =
    categoryData?.data?.map((c: any) => ({ value: c.id, label: c.name })) || [];
  const tagsOptions =
    tagsData?.data?.map((t: any) => ({ value: t.id, label: t.name })) || [];
  const authorOptions =
    userData?.data?.map((u: any) => ({
      value: u.id,
      label: u.username || u.email,
    })) || [];

  return (
    <div className="p-6">
      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        isSuccess={isSuccess}
        initialValues={{
          featured: true,
          status: true,
          blogType: "Article",
          readingTime: 0,
          wordCount: 0,
        }}
        onValuesChange={(changedValues) => {
          if (changedValues.title) {
            form.setFieldsValue({ slug: slugify(changedValues.title) });
          }
          if (changedValues.title && !isMetaTitleTouched) {
            form.setFieldsValue({ metaTitle: changedValues.title });
          }
          if (changedValues.subtitle && !isMetaDescriptionTouched) {
            form.setFieldsValue({ metaDescription: changedValues.subtitle });
          }
        }}
      >
        <Row gutter={[24, 24]}>
          {/* Basic Information */}
          <Col xs={24}>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input placeholder="Enter blog title" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
              <Input placeholder="Enter slug" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="subtitle" label="Subtitle">
              <Input placeholder="Enter subtitle" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="content"
              label="Content"
              rules={[
                {
                  required: true,
                  validator: () => {
                    const textContent = editorContent
                      ?.replace(/<[^>]*>/g, "")
                      .trim();
                    if (!textContent) {
                      return Promise.reject(
                        new Error("Please enter blog content")
                      );
                    }
                    if (textContent.length < 50) {
                      return Promise.reject(
                        new Error(
                          "Blog content should be at least 50 characters long"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <div>
                {editorError && (
                  <Alert
                    message={editorError}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}
                <div
                  style={{
                    border: editorError
                      ? "1px solid #ffa940"
                      : "1px solid #d9d9d9",
                    borderRadius: "6px",
                    overflow: "hidden",
                    minHeight: "600px",
                  }}
                >
                  <JoditEditor
                    ref={editorRef}
                    value={editorContent}
                    config={editorConfig}
                    onBlur={handleEditorBlur}
                    onChange={handleEditorChange}
                    tabIndex={1}
                  />
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                  💡 <strong>Pro Tips:</strong> Use blockquotes for quotes,
                  horizontal lines for section breaks, and numbered lists for
                  step-by-step guides.
                </div>
              </div>
            </Form.Item>
          </Col>

          {/* Blog Settings */}
          <Col xs={24}>
            <h2 className="text-lg font-semibold mb-4">Blog Settings</h2>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              name="readingTime"
              label="Reading Time"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={1}
                max={60}
                placeholder="5"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item name="wordCount" label="Word Count">
              <InputNumber
                min={0}
                placeholder="0"
                style={{ width: "100%" }}
                readOnly
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item label="Featured" name="featured">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Switch
                  checked={isFeatured}
                  onChange={setIsFeatured}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
                <span>{isFeatured ? "Featured" : "Not Featured"}</span>
              </div>
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item label="Status" name="status">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Switch
                  checked={isPublished}
                  onChange={setIsPublished}
                  checkedChildren="Published"
                  unCheckedChildren="Draft"
                />
                <span>{isPublished ? "Published" : "Draft"}</span>
              </div>
            </Form.Item>
          </Col>

          {/* Categories and Tags */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select category"
                options={categoryOptions}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="tagIds" label="Tags">
              <Select
                mode="multiple"
                placeholder="Select tags"
                options={tagsOptions}
                allowClear
              />
            </Form.Item>
          </Col>

          {/* Authors and Blog Type */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="authorIds"
              label="Authors"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                placeholder="Select authors"
                options={authorOptions}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="blogType" label="Blog Type">
              <Select
                placeholder="Select blog type"
                options={blogTypeOptions}
              />
            </Form.Item>
          </Col>

          {/* Images */}
          <Col xs={24}>
            <h2 className="text-lg font-semibold mb-4">Images</h2>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="thumbnail" label="Thumbnail">
              <Upload
                listType="picture-card"
                fileList={thumbnailFileList}
                onPreview={handlePreview}
                onChange={({ fileList }) => setThumbnailFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                {thumbnailFileList.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="image" label="Gallery Images">
              <Upload
                listType="picture-card"
                fileList={galleryFileList}
                onPreview={handlePreview}
                onChange={({ fileList }) => setGalleryFileList(fileList)}
                beforeUpload={() => false}
                multiple
              >
                {galleryFileList.length >= 8 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          {/* FAQ Section - FIXED */}
          <Col xs={24}>
            <Card
              title={
                <h2 className="text-lg font-semibold mb-0">FAQ Section</h2>
              }
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addFaqItem}
                >
                  Add FAQ
                </Button>
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <div className="ant-form-item">
                    <label className="ant-form-item-label">
                      FAQ Section Title
                    </label>
                    <div className="ant-form-item-control">
                      <Input
                        placeholder="Enter FAQ section title (e.g., Frequently Asked Questions)"
                        value={faqSectionTitle}
                        onChange={(e) => setFaqSectionTitle(e.target.value)}
                      />
                    </div>
                  </div>
                </Col>

                {faqItems.map((faq, index) => (
                  <Col xs={24} key={faq.id}>
                    <Card
                      size="small"
                      title={`FAQ Item ${index + 1}`}
                      extra={
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeFaqItem(faq.id)}
                          disabled={faqItems.length === 1}
                        >
                          Remove
                        </Button>
                      }
                    >
                      <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        size="middle"
                      >
                        {/* REMOVED Form.Item and used direct Input with proper state management */}
                        <div className="ant-form-item">
                          <label className="ant-form-item-label">
                            Question{" "}
                          </label>
                          <div className="ant-form-item-control">
                            <Input
                              required
                              placeholder="Enter question"
                              value={faq.question}
                              onChange={(e) =>
                                updateFaqItem(
                                  faq.id,
                                  "question",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="ant-form-item">
                          <label className="ant-form-item-label">Answer </label>
                          <div
                            style={{
                              border: "1px solid #d9d9d9",
                              borderRadius: "6px",
                              overflow: "hidden",
                              minHeight: "200px",
                            }}
                          >
                            <JoditEditor
                              ref={(el) => {
                                if (el) {
                                  faqEditorRefs.current[faq.id] = el;
                                }
                              }}
                              value={faq.answer}
                              config={faqEditorConfig}
                              onBlur={(newContent) =>
                                handleFaqAnswerBlur(faq.id, newContent)
                              }
                              onChange={(newContent) =>
                                handleFaqAnswerChange(faq.id, newContent)
                              }
                              tabIndex={index + 2}
                            />
                          </div>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}

                {faqItems.length === 0 && (
                  <Col xs={24}>
                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        border: "2px dashed #d9d9d9",
                        borderRadius: "6px",
                      }}
                    >
                      <p style={{ color: "#999", marginBottom: "16px" }}>
                        No FAQ items added yet
                      </p>
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={addFaqItem}
                      >
                        Add First FAQ Item
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>

          {/* SEO Settings */}
          <Col xs={24}>
            <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
          </Col>

          <Col xs={24}>
            <Form.Item name="metaTitle" label="Meta Title">
              <Input
                placeholder="Enter meta title"
                onFocus={() => setIsMetaTitleTouched(true)}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="metaDescription" label="Meta Description">
              <Input.TextArea
                rows={3}
                placeholder="Enter meta description"
                onFocus={() => setIsMetaDescriptionTouched(true)}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="metaKeywords" label="Meta Keywords">
              <Select
                mode="tags"
                placeholder="Enter meta keywords"
                tokenSeparators={[",", " "]}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="canonicalUrl" label="Canonical URL">
              <Input placeholder="Enter canonical URL" />
            </Form.Item>
          </Col>
        </Row>

        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Form>
    </div>
  );
};

export default CreateBlog;
