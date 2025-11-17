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
  Steps,
  Divider,
  Typography,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
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

const { Title, Text } = Typography;
const { Step } = Steps;

const CreateBlog = () => {
  const [form] = AntForm.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  // Image states
  const [thumbnailFileList, setThumbnailFileList] = useState<any[]>([]);
  const [galleryFileList, setGalleryFileList] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Blog settings
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isMetaTitleTouched, setIsMetaTitleTouched] = useState(false);
  const [isMetaDescriptionTouched, setIsMetaDescriptionTouched] =
    useState(false);

  // Content states
  const [editorContent, setEditorContent] = useState("");
  const [editorError, setEditorError] = useState<string | null>(null);
  const [keyTakeaways, setKeyTakeaways] = useState("");

  // Promotional content
  const [promoData, setPromoData] = useState({
    imageFileList: [] as any[],
    title: "",
    keywords: [] as string[],
    url: "",
  });

  // FAQ State
  const [faqSectionTitle, setFaqSectionTitle] = useState("");
  const [faqItems, setFaqItems] = useState<BlogFAQItem[]>([]);

  // Refs
  const editorRef = useRef<any>(null);
  const keyTakeawaysRef = useRef<any>(null);
  const faqEditorRefs = useRef<{ [key: string]: any }>({});

  // API hooks
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

  // Configurations
  const editorConfig = useMemo(() => defaultJoditConfig, []);
  const faqEditorConfig = useMemo(() => faqJoditConfig, []);
  const keyTakeawaysConfig = useMemo(
    () => ({
      ...defaultJoditConfig,
      height: 300,
      minHeight: 200,
      placeholder: "Summarize the key points of your blog post...",
      toolbarButtonSize: "small",
    }),
    []
  );

  // Steps configuration
  const steps = [
    {
      title: "Basic Info",
      description: "Blog details",
    },
    {
      title: "Content",
      description: "Write your blog",
    },
    {
      title: "Media",
      description: "Add images",
    },
    {
      title: "Settings",
      description: "Configure blog",
    },
    {
      title: "SEO & More",
      description: "Additional content",
    },
  ];

  // Reset form on success
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setThumbnailFileList([]);
      setGalleryFileList([]);
      setPromoData({
        imageFileList: [],
        title: "",
        keywords: [],
        url: "",
      });
      setIsPublished(true);
      setIsFeatured(true);
      setIsMetaTitleTouched(false);
      setIsMetaDescriptionTouched(false);
      setEditorContent("");
      setKeyTakeaways("");
      setEditorError(null);
      setFaqSectionTitle("");
      setFaqItems([]);
      setCurrentStep(0);
    }
    if (blogPage) form.setFieldsValue({ pageId: blogPage.id });
  }, [isSuccess, form, blogPage]);

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

  // FAQ Editor Handlers
  const handleFaqAnswerChange = (id: string, newContent: string) => {
    updateFaqItem(id, "answer", newContent);
  };

  const handleFaqAnswerBlur = (id: string, newContent: string) => {
    updateFaqItem(id, "answer", newContent);
  };

  // Editor handlers - FIXED VERSION
  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    setEditorError(null);

    const textContent = newContent.replace(/<[^>]*>/g, "").trim();
    const wordCount = textContent ? textContent.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Force update form fields with calculated values
    form.setFieldsValue({
      wordCount: wordCount,
      readingTime: readingTime,
    });

    if (!textContent) {
      setEditorError("Please enter some content for your blog");
    } else if (textContent.length < 50) {
      setEditorError("Content seems too short. Consider adding more details.");
    } else {
      setEditorError(null);
    }
  };

  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
  };

  // Navigation
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Form submission - COMPLETELY FIXED VERSION
  const onFinish = async (values: any) => {
    console.log("Form values:", values);

    // Validate required fields
    if (!values.title?.trim()) {
      form.setFields([{ name: "title", errors: ["Blog title is required"] }]);
      setCurrentStep(0);
      return;
    }

    const formData = new FormData();

    // Content validation
    const textContent = editorContent?.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      form.setFields([
        { name: "content", errors: ["Please enter blog content"] },
      ]);
      setEditorError("Blog content is required");
      setCurrentStep(1);
      return;
    }

    // Basic info - FIXED: Ensure values are properly captured
    formData.append("title", values.title);
    formData.append("slug", values.slug || slugify(values.title));
    formData.append("subtitle", values.subtitle || "");
    formData.append("content", editorContent);

    // FIXED: Use actual values from form with proper validation
    const readingTimeValue = values.readingTime && values.readingTime > 0 ? values.readingTime : 5;
    const wordCountValue = values.wordCount && values.wordCount > 0 ? values.wordCount : 0;
    
    formData.append("reading_time", readingTimeValue.toString());
    formData.append("word_count", wordCountValue.toString());
    formData.append("key_takeaways", keyTakeaways);

    // Blog settings
    formData.append("featured", isFeatured ? "1" : "0");
    formData.append("status", isPublished ? "published" : "draft");
    formData.append("blog_type", values.blogType || "Article");

    // Promotional content - FIXED STRUCTURE
    const promoImage = promoData.imageFileList[0]?.originFileObj;
    if (promoImage) {
      formData.append("promotional_image", promoImage);
    }

    // Create promotional_content as JSON object
    const promotionalContent = {
      title: promoData.title || "",
      keywords: promoData.keywords || [],
      promotional_url: promoData.url || "",
    };
    formData.append("promotional_content", JSON.stringify(promotionalContent));

    // IDs with null checks
    if (values.categoryId) {
      formData.append("categoryId", values.categoryId.toString());
    }

    if (values.authorIds && Array.isArray(values.authorIds)) {
      values.authorIds.forEach((id: number) =>
        formData.append("authorIds[]", id.toString())
      );
    }

    if (values.tagIds && Array.isArray(values.tagIds)) {
      values.tagIds.forEach((id: number) =>
        formData.append("tagIds[]", id.toString())
      );
    }

    if (blogPage) formData.append("pageId", blogPage.id.toString());

    // Images
    const thumbnailFile = thumbnailFileList[0]?.originFileObj;
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    galleryFileList.forEach(
      (file) =>
        file.originFileObj &&
        formData.append(`gallery_images[]`, file.originFileObj)
    );

    // FAQ Data - FIXED: Create as JSON object
    if (faqSectionTitle || faqItems.length > 0) {
      const validFaqItems = faqItems.filter(
        (item) => item.question.trim() && item.answer.trim()
      );

      const faqData = {
        faqTitle: faqSectionTitle || "",
        items: validFaqItems.map((item, index) => ({
          id: index + 1,
          question: item.question,
          answer: item.answer
        }))
      };
      formData.append("faqData", JSON.stringify(faqData));
    }

    // Meta data - FIXED: Create as JSON object
    const metaData = {
      metaTitle: values.metaTitle || "",
      metaDescription: values.metaDescription || "",
      metaKeywords: values.metaKeywords || [],
      canonicalUrl: values.canonicalUrl || "",
    };
    formData.append("metaData", JSON.stringify(metaData));

    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

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

  // Step content components
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return (
          <ContentStep
            editorContent={editorContent}
            editorError={editorError}
            keyTakeaways={keyTakeaways}
            editorRef={editorRef}
            keyTakeawaysRef={keyTakeawaysRef}
            handleEditorChange={handleEditorChange}
            setKeyTakeaways={setKeyTakeaways}
            editorConfig={editorConfig}
            keyTakeawaysConfig={keyTakeawaysConfig}
          />
        );
      case 2:
        return (
          <MediaStep
            thumbnailFileList={thumbnailFileList}
            galleryFileList={galleryFileList}
            setThumbnailFileList={setThumbnailFileList}
            setGalleryFileList={setGalleryFileList}
            handlePreview={handlePreview}
          />
        );
      case 3:
        return (
          <SettingsStep
            isFeatured={isFeatured}
            isPublished={isPublished}
            setIsFeatured={setIsFeatured}
            setIsPublished={setIsPublished}
            categoryOptions={categoryOptions}
            tagsOptions={tagsOptions}
            authorOptions={authorOptions}
            blogTypeOptions={blogTypeOptions}
          />
        );
      case 4:
        return (
          <SEOStep
            promoData={promoData}
            setPromoData={setPromoData}
            faqSectionTitle={faqSectionTitle}
            setFaqSectionTitle={setFaqSectionTitle}
            faqItems={faqItems}
            addFaqItem={addFaqItem}
            removeFaqItem={removeFaqItem}
            updateFaqItem={updateFaqItem}
            faqEditorRefs={faqEditorRefs}
            faqEditorConfig={faqEditorConfig}
            handleFaqAnswerChange={handleFaqAnswerChange}
            handleFaqAnswerBlur={handleFaqAnswerBlur}
            handlePreview={handlePreview}
            isMetaTitleTouched={isMetaTitleTouched}
            isMetaDescriptionTouched={isMetaDescriptionTouched}
            setIsMetaTitleTouched={setIsMetaTitleTouched}
            setIsMetaDescriptionTouched={setIsMetaDescriptionTouched}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Title level={2}>Create New Blog Post</Title>
          <Text type="secondary">
            Fill in the details below to create an engaging blog post
          </Text>
        </div>

        {/* Progress Steps */}
        <Card className="mb-6">
          <Steps current={currentStep} className="custom-steps">
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
              />
            ))}
          </Steps>
        </Card>

        <Form
          form={form}
          onFinish={onFinish}
          isLoading={isLoading}
          isSuccess={isSuccess}
          initialValues={{
            featured: true,
            status: true,
            blogType: "Article",
            readingTime: 5,
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
          {/* Step Content */}
          <Card className="mb-6">{renderStepContent()}</Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                size="large"
              >
                Publish Blog
              </Button>
            )}
          </div>
        </Form>
      </div>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

// Step Components
const BasicInfoStep = () => (
  <div>
    <Title level={4} className="mb-6">
      Basic Information
    </Title>
    <Row gutter={[24, 16]}>
      <Col xs={24} sm={12}>
        <Form.Item
          name="title"
          label="Blog Title"
          rules={[{ required: true, message: "Please enter a blog title" }]}
        >
          <Input size="large" placeholder="Enter an engaging blog title" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          name="slug"
          label="URL Slug"
          rules={[{ required: true, message: "Please enter a URL slug" }]}
        >
          <Input size="large" placeholder="Auto-generated from title" />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item name="subtitle" label="Subtitle">
          <Input.TextArea
            rows={3}
            placeholder="Brief description of your blog post"
            showCount
            maxLength={200}
          />
        </Form.Item>
      </Col>
    </Row>
  </div>
);

const ContentStep = ({
  editorContent,
  editorError,
  keyTakeaways,
  editorRef,
  keyTakeawaysRef,
  handleEditorChange,
  setKeyTakeaways,
  editorConfig,
  keyTakeawaysConfig,
}: any) => (
  <div>
    <Title level={4} className="mb-6">
      Blog Content
    </Title>

    <div className="mb-6">
      <Form.Item
        name="content"
        label="Main Content"
        rules={[{ required: true, message: "Please enter blog content" }]}
      >
        <div>
          {editorError && (
            <Alert
              message={editorError}
              type="warning"
              showIcon
              className="mb-4"
            />
          )}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <JoditEditor
              ref={editorRef}
              value={editorContent}
              config={editorConfig}
              onChange={handleEditorChange}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            💡 Write engaging content with proper formatting. Minimum 50
            characters required.
          </div>
        </div>
      </Form.Item>
    </div>

    <Divider />

    <div>
      <Form.Item
        name="keyTakeaways"
        label="Key Takeaways"
        help="Summarize the main points for readers"
      >
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <JoditEditor
            ref={keyTakeawaysRef}
            value={keyTakeaways}
            config={keyTakeawaysConfig}
            onChange={setKeyTakeaways}
          />
        </div>
      </Form.Item>
    </div>
  </div>
);

const MediaStep = ({
  thumbnailFileList,
  galleryFileList,
  setThumbnailFileList,
  setGalleryFileList,
  handlePreview,
}: any) => (
  <div>
    <Title level={4} className="mb-6">
      Media & Images
    </Title>

    <Row gutter={[24, 24]}>
      <Col xs={24} lg={12}>
        <Card title="Featured Image" size="small">
          <Form.Item name="thumbnail" label="Thumbnail (Required)">
            <Upload
              listType="picture-card"
              fileList={thumbnailFileList}
              onPreview={handlePreview}
              onChange={({ fileList }) => setThumbnailFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {thumbnailFileList.length >= 1 ? null : (
                <div className="text-center">
                  <PlusOutlined />
                  <div className="mt-2">Upload Thumbnail</div>
                </div>
              )}
            </Upload>
            <div className="text-sm text-gray-500 mt-2">
              This image will be used as the main thumbnail for your blog
            </div>
          </Form.Item>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card title="Gallery Images" size="small">
          <Form.Item name="image" label="Additional Images (Optional)">
            <Upload
              listType="picture-card"
              fileList={galleryFileList}
              onPreview={handlePreview}
              onChange={({ fileList }) => setGalleryFileList(fileList)}
              beforeUpload={() => false}
              multiple
            >
              {galleryFileList.length >= 8 ? null : (
                <div className="text-center">
                  <PlusOutlined />
                  <div className="mt-2">Upload Images</div>
                </div>
              )}
            </Upload>
            <div className="text-sm text-gray-500 mt-2">
              Add up to 8 images to enhance your blog post
            </div>
          </Form.Item>
        </Card>
      </Col>
    </Row>
  </div>
);

const SettingsStep = ({
  isFeatured,
  isPublished,
  setIsFeatured,
  setIsPublished,
  categoryOptions,
  tagsOptions,
  authorOptions,
  blogTypeOptions,
}: any) => (
  <div>
    <Title level={4} className="mb-6">
      Blog Settings
    </Title>

    <Row gutter={[24, 16]}>
      <Col xs={24} sm={8}>
        <Form.Item
          name="readingTime"
          label="Reading Time (minutes)"
          rules={[{ required: true, message: "Please enter reading time" }]}
        >
          <InputNumber
            min={1}
            max={120}
            placeholder="5"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={8}>
        <Form.Item 
          name="wordCount" 
          label="Word Count"
          rules={[{ required: true, message: "Word count is required" }]}
        >
          <InputNumber
            min={0}
            placeholder="0"
            style={{ width: "100%" }}
            type="number"
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={8}>
        <Form.Item name="blogType" label="Blog Type">
          <Select options={blogTypeOptions} />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select category" options={categoryOptions} />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item name="tagIds" label="Tags">
          <Select
            mode="multiple"
            placeholder="Select tags"
            options={tagsOptions}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          name="authorIds"
          label="Authors"
          rules={[{ required: true, message: "Please select authors" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select authors"
            options={authorOptions}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Featured Post" name="featured">
          <div className="flex items-center gap-2">
            <Switch checked={isFeatured} onChange={setIsFeatured} />
            <span>{isFeatured ? "Featured" : "Regular"}</span>
          </div>
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Publication Status" name="status">
          <div className="flex items-center gap-2">
            <Switch checked={isPublished} onChange={setIsPublished} />
            <span>{isPublished ? "Published" : "Draft"}</span>
          </div>
        </Form.Item>
      </Col>
    </Row>
  </div>
);

const SEOStep = ({
  promoData,
  setPromoData,
  faqSectionTitle,
  setFaqSectionTitle,
  faqItems,
  addFaqItem,
  removeFaqItem,
  updateFaqItem,
  faqEditorRefs,
  faqEditorConfig,
  handleFaqAnswerChange,
  handleFaqAnswerBlur,
  handlePreview,
  isMetaTitleTouched,
  isMetaDescriptionTouched,
  setIsMetaTitleTouched,
  setIsMetaDescriptionTouched,
}: any) => (
  <div>
    <Title level={4} className="mb-6">
      SEO & Additional Content
    </Title>

    {/* SEO Settings */}
    <Card title="SEO Settings" className="mb-6" size="small">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item name="metaTitle" label="Meta Title">
            <Input
              placeholder="Meta title for search engines"
              onFocus={() => setIsMetaTitleTouched(true)}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="metaDescription" label="Meta Description">
            <Input.TextArea
              rows={3}
              placeholder="Meta description for search results"
              onFocus={() => setIsMetaDescriptionTouched(true)}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="metaKeywords" label="Meta Keywords">
            <Select
              mode="tags"
              placeholder="Add relevant keywords"
              tokenSeparators={[",", " "]}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="canonicalUrl" label="Canonical URL">
            <Input placeholder="Original URL if this is duplicate content" />
          </Form.Item>
        </Col>
      </Row>
    </Card>

    {/* Promotional Content */}
    <Card title="Promotional Content" className="mb-6" size="small">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <div className="ant-form-item">
            <label className="ant-form-item-label">Promotional Title</label>
            <Input
              placeholder="Promotional title"
              value={promoData.title}
              onChange={(e) =>
                setPromoData((prev: any) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="ant-form-item">
            <label className="ant-form-item-label">Promotional URL</label>
            <Input
              placeholder="Promotional URL"
              value={promoData.url}
              onChange={(e) =>
                setPromoData((prev: any) => ({ ...prev, url: e.target.value }))
              }
            />
          </div>
        </Col>
        <Col xs={24}>
          <div className="ant-form-item">
            <label className="ant-form-item-label">Promotional Keywords</label>
            <Select
              mode="tags"
              placeholder="Promotional keywords"
              value={promoData.keywords}
              onChange={(value) =>
                setPromoData((prev: any) => ({ ...prev, keywords: value }))
              }
            />
          </div>
        </Col>
        <Col xs={24}>
          <div className="ant-form-item">
            <label className="ant-form-item-label">Promotional Image</label>
            <Upload
              listType="picture-card"
              fileList={promoData.imageFileList}
              beforeUpload={() => false}
              onPreview={handlePreview}
              onChange={({ fileList }) =>
                setPromoData((prev: any) => ({
                  ...prev,
                  imageFileList: fileList,
                }))
              }
              maxCount={1}
            >
              {promoData.imageFileList.length >= 1 ? null : (
                <div className="text-center">
                  <PlusOutlined />
                  <div className="mt-2">Upload Image</div>
                </div>
              )}
            </Upload>
          </div>
        </Col>
      </Row>
    </Card>

    {/* FAQ Section */}
    <Card
      title="FAQ Section"
      size="small"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={addFaqItem}>
          Add FAQ
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="ant-form-item">
            <label className="ant-form-item-label">FAQ Section Title</label>
            <Input
              placeholder="Frequently Asked Questions"
              value={faqSectionTitle}
              onChange={(e) => setFaqSectionTitle(e.target.value)}
            />
          </div>
        </Col>

        {faqItems.map((faq: any, index: number) => (
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
                <div className="ant-form-item">
                  <label className="ant-form-item-label">Question</label>
                  <Input
                    placeholder="Enter question"
                    value={faq.question}
                    onChange={(e) =>
                      updateFaqItem(faq.id, "question", e.target.value)
                    }
                  />
                </div>
                <div className="ant-form-item">
                  <label className="ant-form-item-label">Answer</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <JoditEditor
                      ref={(el) => {
                        if (el) faqEditorRefs.current[faq.id] = el;
                      }}
                      value={faq.answer}
                      config={faqEditorConfig}
                      onBlur={(newContent) =>
                        handleFaqAnswerBlur(faq.id, newContent)
                      }
                      onChange={(newContent) =>
                        handleFaqAnswerChange(faq.id, newContent)
                      }
                    />
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        ))}

        {faqItems.length === 0 && (
          <Col xs={24}>
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-4">No FAQ items added yet</p>
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
  </div>
);

export default CreateBlog;