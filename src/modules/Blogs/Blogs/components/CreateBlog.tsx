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
  Steps,
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
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    slug: "",
    subtitle: "",
  });

  const [settings, setSettings] = useState({
    readingTime: 5,
    wordCount: 0,
    blogType: "Article",
    categoryId: undefined,
    tagIds: [] as number[],
    authorIds: [] as number[],
    featured: true,
    status: true,
  });

  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [] as string[],
    canonicalUrl: "",
    promo: {
      title: "",
      url: "",
      keywords: [] as string[],
      imageFileList: [] as any[],
    },
    faq: {
      sectionTitle: "",
      items: [] as BlogFAQItem[],
    },
  });

  // Blog settings
  // const [isPublished, setIsPublished] = useState(true);
  // const [isFeatured, setIsFeatured] = useState(true);
  const [isMetaTitleTouched, setIsMetaTitleTouched] = useState(false);
  const [isMetaDescriptionTouched, setIsMetaDescriptionTouched] =
    useState(false);

  // Content states
  const [editorContent, setEditorContent] = useState("");
  const [editorError, setEditorError] = useState<string | null>(null);
  const [keyTakeaways, setKeyTakeaways] = useState("");

  // Promotional content
  // const [promoData, setPromoData] = useState({
  //   imageFileList: [] as any[],
  //   title: "",
  //   keywords: [] as string[],
  //   url: "",
  // });

  // FAQ State
  // const [faqSectionTitle, setFaqSectionTitle] = useState("");
  // const [faqItems, setFaqItems] = useState<BlogFAQItem[]>([]);

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
      // setPromoData({
      //   imageFileList: [],
      //   title: "",
      //   keywords: [],
      //   url: "",
      // });
      // setIsPublished(true);
      // setIsFeatured(true);
      setIsMetaTitleTouched(false);
      setIsMetaDescriptionTouched(false);
      setEditorContent("");
      setKeyTakeaways("");
      setEditorError(null);
      // setFaqSectionTitle("");
      // setFaqItems([]);
    }
  }, [isSuccess, form, blogPage]);

  useEffect(() => {
    if (currentStep === 4) {
      setSeoData((prev) => ({
        ...prev,
        metaTitle: prev.metaTitle || basicInfo.title,
        metaDescription: prev.metaDescription || basicInfo.subtitle,
      }));
    }
  }, [currentStep, basicInfo]);

  // // FAQ Functions
  // const addFaqItem = () => {
  //   const newFaqItem: BlogFAQItem = {
  //     id: Date.now().toString(),
  //     question: "",
  //     answer: "",
  //   };
  //   setFaqItems([...faqItems, newFaqItem]);
  // };

  // const removeFaqItem = (id: string) => {
  //   setFaqItems(faqItems.filter((item) => item.id !== id));
  //   if (faqEditorRefs.current[id]) {
  //     delete faqEditorRefs.current[id];
  //   }
  // };

  // const updateFaqItem = (
  //   id: string,
  //   field: keyof BlogFAQItem,
  //   value: string
  // ) => {
  //   setFaqItems(
  //     faqItems.map((item) =>
  //       item.id === id ? { ...item, [field]: value } : item
  //     )
  //   );
  // };

  // Editor handlers
  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    setEditorError(null);

    const textContent = newContent.replace(/<[^>]*>/g, "").trim();
    const wordCount = textContent ? textContent.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Update state
    setSettings((prev) => ({
      ...prev,
      wordCount,
      readingTime,
    }));

    // Update form fields as well
    form.setFieldsValue({
      word_count: wordCount,
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

  // Step Navigation with Validation (Option 2)
  const nextStepWithValidation = async () => {
    try {
      // Only validate fields relevant to current step
      let fieldsToValidate: string[] = [];

      switch (currentStep) {
        case 0:
          fieldsToValidate = ["title", "slug"];
          break;
        case 1:
          // fieldsToValidate = ["content"];
          break;
        case 3:
          fieldsToValidate = ["categoryId", "authorIds"];
          break;
        case 4:
          fieldsToValidate = ["metaTitle", "metaDescription"];
          break;
      }

      if (fieldsToValidate.length > 0) {
        await form.validateFields(fieldsToValidate);
      }

      // Special validation for editor content
      if (currentStep === 1) {
        const textContent = editorContent.replace(/<[^>]*>/g, "").trim();
        if (!textContent) {
          setEditorError("Please enter blog content");
          return;
        }
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Form submission
  const onFinish = async (values: any) => {
    console.log("first", values);
    const formData = new FormData();

    // Basic info
    formData.append("title", basicInfo.title);
    formData.append("slug", basicInfo.slug || slugify(basicInfo.title));
    formData.append("subtitle", basicInfo.subtitle || "");
    formData.append("content", editorContent);
    formData.append("keyTakeaways", keyTakeaways);

    // Settings
    formData.append("readingTime", settings.readingTime.toString());
    formData.append("wordCount", settings.wordCount.toString());
    formData.append("blogType", settings.blogType);
    if (settings.categoryId !== undefined && settings.categoryId !== null) {
      formData.append("categoryId", settings.categoryId);
    }
    settings.authorIds.forEach((id) =>
      formData.append("authorIds[]", id.toString())
    );
    settings.tagIds.forEach((id) => formData.append("tagIds[]", id.toString()));
    formData.append("featured", settings.featured ? "1" : "0");
    formData.append("status", settings.status ? "published" : "draft");

    // SEO
    formData.append(
      "metaData",
      JSON.stringify({
        metaTitle: seoData.metaTitle,
        metaDescription: seoData.metaDescription,
        metaKeywords: seoData.metaKeywords,
        canonicalUrl: seoData.canonicalUrl,
      })
    );

    // Promotional
    const promoImage = seoData.promo.imageFileList[0]?.originFileObj;
    if (promoImage) formData.append("promotional_image", promoImage);
    formData.append(
      "promotional_content",
      JSON.stringify({
        title: seoData.promo.title,
        keywords: seoData.promo.keywords,
        promotional_url: seoData.promo.url,
      })
    );

    // FAQ
    const validFaqItems = seoData.faq.items.filter(
      (item) => item.question.trim() && item.answer.trim()
    );
    formData.append(
      "faqData",
      JSON.stringify({
        faqTitle: seoData.faq.sectionTitle,
        items: validFaqItems,
      })
    );

    // Images
    const thumbnailFile = thumbnailFileList[0]?.originFileObj;
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    galleryFileList.forEach(
      (file) =>
        file.originFileObj &&
        formData.append("gallery_images[]", file.originFileObj)
    );

    if (blogPage) formData.append("pageId", blogPage?.id);

    await createBlog(formData);

    // // Promotional content
    // const promoImage = promoData.imageFileList[0]?.originFileObj;
    // if (promoImage) formData.append("promotional_image", promoImage);

    // const promotionalContent = {
    //   title: promoData.title || "",
    //   keywords: promoData.keywords || [],
    //   promotional_url: promoData.url || "",
    // };
    // formData.append("promotional_content", JSON.stringify(promotionalContent));

    // if (values.categoryId) formData.append("categoryId", values.categoryId);

    // if (values.authorIds && Array.isArray(values.authorIds)) {
    //   values.authorIds.forEach((id: number) =>
    //     formData.append("authorIds[]", id.toString())
    //   );
    // }

    // if (values.tagIds && Array.isArray(values.tagIds)) {
    //   values.tagIds.forEach((id: number) =>
    //     formData.append("tagIds[]", id.toString())
    //   );
    // }

    // if (blogPage) formData.append("pageId", blogPage.id.toString());

    // // Images
    // const thumbnailFile = thumbnailFileList[0]?.originFileObj;
    // if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    // galleryFileList.forEach(
    //   (file) =>
    //     file.originFileObj &&
    //     formData.append(`gallery_images[]`, file.originFileObj)
    // );

    // // FAQ
    // if (faqSectionTitle || faqItems.length > 0) {
    //   const validFaqItems = faqItems.filter(
    //     (item) => item.question.trim() && item.answer.trim()
    //   );

    //   const faqData = {
    //     faqTitle: faqSectionTitle || "",
    //     items: validFaqItems.map((item, index) => ({
    //       id: index + 1,
    //       question: item.question,
    //       answer: item.answer,
    //     })),
    //   };
    //   formData.append("faqData", JSON.stringify(faqData));
    // }

    // // Meta data
    // const metaData = {
    //   metaTitle: values.metaTitle || "",
    //   metaDescription: values.metaDescription || "",
    //   metaKeywords: values.metaKeywords || [],
    //   canonicalUrl: values.canonicalUrl || "",
    // };
    // formData.append("metaData", JSON.stringify(metaData));

    // await createBlog(formData);
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
        return (
          <BasicInfoStep
            basicInfo={basicInfo}
            setBasicInfo={setBasicInfo}
            form={form}
            isMetaTitleTouched={isMetaTitleTouched}
            isMetaDescriptionTouched={isMetaDescriptionTouched}
            setSeoData={setSeoData}
          />
        );
      case 1:
        return (
          <ContentStep
            editorContent={editorContent}
            editorError={editorError}
            editorRef={editorRef}
            editorConfig={editorConfig}
            handleEditorChange={handleEditorChange}
            keyTakeaways={keyTakeaways}
            keyTakeawaysRef={keyTakeawaysRef}
            setKeyTakeaways={setKeyTakeaways}
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
            settings={settings}
            setSettings={setSettings}
            categoryOptions={categoryOptions}
            tagsOptions={tagsOptions}
            authorOptions={authorOptions}
            blogTypeOptions={blogTypeOptions}
          />
          // <SettingsStep
          //   isFeatured={isFeatured}
          //   isPublished={isPublished}
          //   setIsFeatured={setIsFeatured}
          //   setIsPublished={setIsPublished}
          //   categoryOptions={categoryOptions}
          //   tagsOptions={tagsOptions}
          //   authorOptions={authorOptions}
          //   blogTypeOptions={blogTypeOptions}
          // />
        );
      case 4:
        return (
          <SEOStep
            seoData={seoData}
            setSeoData={setSeoData} // <-- pass this
            faqEditorRefs={faqEditorRefs}
            faqEditorConfig={faqEditorConfig}
            handlePreview={handlePreview}
            setIsMetaTitleTouched={setIsMetaTitleTouched}
            setIsMetaDescriptionTouched={setIsMetaDescriptionTouched}
          />

          // <SEOStep
          //   promoData={promoData}
          //   setPromoData={setPromoData}
          //   faqSectionTitle={faqSectionTitle}
          //   setFaqSectionTitle={setFaqSectionTitle}
          //   faqItems={faqItems}
          //   addFaqItem={addFaqItem}
          //   removeFaqItem={removeFaqItem}
          //   updateFaqItem={updateFaqItem}
          //   faqEditorRefs={faqEditorRefs}
          //   faqEditorConfig={faqEditorConfig}
          //   handlePreview={handlePreview}
          //   handleFaqAnswerChange={(id: any, content: any) =>
          //     updateFaqItem(id, "answer", content)
          //   }
          //   handleFaqAnswerBlur={(id: any, content: any) =>
          //     updateFaqItem(id, "answer", content)
          //   }
          //   setIsMetaTitleTouched={setIsMetaTitleTouched}
          //   setIsMetaDescriptionTouched={setIsMetaDescriptionTouched}
          // />
        );
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Title level={2}>Create New Blog Post</Title>
          <Text type="secondary">
            Fill in the details below to create an engaging blog post
          </Text>
        </div>

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
          initialValues={{
            featured: true,
            status: true,
            blogType: "Article",
            readingTime: 5,
            wordCount: 0,
            title: "",
            slug: "",
            subtitle: "",
            metaTitle: "",
            metaDescription: "",
            metaKeywords: [],
            canonicalUrl: "",
            categoryId: undefined, // <-- explicitly undefined
            authorIds: [], // <-- empty array for multiple select
            tagIds: [],
          }}
          onValuesChange={(changedValues) => {
            if (changedValues.title) {
              form.setFieldsValue({ slug: slugify(changedValues.title) });
              setBasicInfo((prev) => ({ ...prev, title: changedValues.title }));
            }

            if (changedValues.slug) {
              setBasicInfo((prev) => ({ ...prev, slug: changedValues.slug }));
            }

            if (changedValues.subtitle) {
              setBasicInfo((prev) => ({
                ...prev,
                subtitle: changedValues.subtitle,
              }));
            }
          }}

          // onValuesChange={(changedValues) => {
          //   console.log("first", changedValues);

          //   if (changedValues.title) {
          //     form.setFieldsValue({ slug: slugify(changedValues.title) });
          //     if (!isMetaTitleTouched) {
          //       form.setFieldsValue({ metaTitle: changedValues.title });
          //     }
          //   }
          //   if (changedValues.subtitle && !isMetaDescriptionTouched) {
          //     form.setFieldsValue({ metaDescription: changedValues.subtitle });
          //   }
          // }}
        >
          <Card className="mb-6">{renderStepContent()}</Card>

          <div className="flex justify-between">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {
              currentStep < steps.length - 1 && (
                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  onClick={nextStepWithValidation}
                >
                  Next
                </Button>
              )
              // : (
              //   <Button
              //     type="primary"
              //     htmlType="submit"
              //     loading={isLoading}
              //     size="large"
              //   >
              //     Publish Blog
              //   </Button>
              // )
            }
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

// --- Step Components (unchanged) ---
const BasicInfoStep = ({
  basicInfo,
  setBasicInfo,
  form,
  isMetaTitleTouched,
  isMetaDescriptionTouched,
  setSeoData,
}: any) => (
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
          <Input
            size="large"
            placeholder="Enter an engaging blog title"
            value={basicInfo?.title}
            onChange={(e) => {
              setBasicInfo({ ...basicInfo, title: e.target.value });
              // Auto-populate meta title if not touched
              if (!isMetaTitleTouched) {
                form.setFieldsValue({ metaTitle: e.target.value });
                setSeoData((prev: any) => ({
                  ...prev,
                  metaTitle: e.target.value,
                }));
              }
            }}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          name="slug"
          label="URL Slug"
          rules={[{ required: true, message: "Please enter a URL slug" }]}
        >
          <Input
            size="large"
            placeholder="Auto-generated from title"
            value={basicInfo.slug}
            onChange={(e) =>
              setBasicInfo({ ...basicInfo, slug: e.target.value })
            }
          />
        </Form.Item>
      </Col>

      <Col xs={24}>
        <Form.Item name="subtitle" label="Subtitle">
          <Input.TextArea
            rows={3}
            placeholder="Brief description of your blog post"
            showCount
            maxLength={200}
            value={basicInfo.subtitle}
            onChange={(e) => {
              setBasicInfo({ ...basicInfo, subtitle: e.target.value });
              // Auto-populate meta description if not touched
              if (!isMetaDescriptionTouched) {
                form.setFieldsValue({ metaDescription: e.target.value });
                setSeoData((prev: any) => ({
                  ...prev,
                  metaDescription: e.target.value,
                }));
              }
            }}
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

    {/* Remove Form.Item for JoditEditor and use regular div with validation */}
    <div className="ant-form-item">
      <label className="ant-form-item-label">
        Main Content <span className="text-red-500">*</span>
      </label>
      {editorError && (
        <Alert message={editorError} type="error" className="mb-4" />
      )}
      <div
        style={{ maxHeight: 500, overflowY: "auto" }}
        // className="border border-gray-300 rounded-lg overflow-hidden"
      >
        <JoditEditor
          ref={editorRef}
          value={editorContent}
          config={editorConfig}
          onBlur={handleEditorChange}
          onChange={handleEditorChange}
        />
      </div>
      {!editorContent && (
        <div className="ant-form-item-explain-error">
          Please enter blog content
        </div>
      )}
    </div>

    {/* Remove Form.Item for Key Takeaways as well */}
    <div className="ant-form-item">
      <label className="ant-form-item-label">Key Takeaways</label>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <JoditEditor
          ref={keyTakeawaysRef}
          value={keyTakeaways}
          config={keyTakeawaysConfig}
          onBlur={(content) => setKeyTakeaways(content)}
          onChange={(content) => setKeyTakeaways(content)}
        />
      </div>
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
  settings,
  setSettings,
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
        <Form.Item label="Reading Time (minutes)" name="readingTime">
          <InputNumber
            min={1}
            max={120}
            style={{ width: "100%" }}
            value={settings.readingTime}
            onChange={(value) =>
              setSettings({ ...settings, readingTime: value })
            }
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={8}>
        <Form.Item label="Word Count" name="word_count">
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            value={settings.wordCount}
            onChange={(value) => setSettings({ ...settings, wordCount: value })}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={8}>
        <Form.Item label="Blog Type" name="blogType">
          <Select
            value={settings.blogType}
            options={blogTypeOptions}
            onChange={(value) => setSettings({ ...settings, blogType: value })}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            value={settings.categoryId}
            options={categoryOptions}
            onChange={(value) =>
              setSettings({ ...settings, categoryId: value })
            }
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item label="Tags" name="tagIds">
          <Select
            mode="multiple"
            value={settings.tagIds}
            options={tagsOptions}
            onChange={(value) => setSettings({ ...settings, tagIds: value })}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          label="Authors"
          name="authorsId"
          rules={[{ required: true, message: "Please enter a author" }]}
        >
          <Select
            mode="multiple"
            value={settings.authorIds}
            options={authorOptions}
            onChange={(value) => setSettings({ ...settings, authorIds: value })}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Featured Post" name="featured">
          <Switch
            checked={settings.featured}
            onChange={(checked) =>
              setSettings({ ...settings, featured: checked })
            }
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={6}>
        <Form.Item label="Publication Status" name="status">
          <Switch
            checked={settings.status}
            onChange={(checked) =>
              setSettings({ ...settings, status: checked })
            }
          />
        </Form.Item>
      </Col>
    </Row>
  </div>
);

// FIXED SEOStep component - removed Form.Item to prevent auto-submission
const SEOStep = ({
  seoData,
  setSeoData,
  faqEditorRefs,
  faqEditorConfig,
  handlePreview,
  setIsMetaTitleTouched,
  setIsMetaDescriptionTouched,
}: any) => {
  const addFaqItem = () => {
    const newFaqItem = {
      id: Date.now().toString(),
      question: "",
      answer: "",
    };
    setSeoData((prev: any) => ({
      ...prev,
      faq: { ...prev.faq, items: [...prev.faq.items, newFaqItem] },
    }));
  };

  const removeFaqItem = (id: string) => {
    setSeoData((prev: any) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: prev.faq.items.filter((item: any) => item.id !== id),
      },
    }));
    if (faqEditorRefs.current[id]) delete faqEditorRefs.current[id];
  };

  const updateFaqItem = (
    id: string,
    field: "question" | "answer",
    value: string
  ) => {
    setSeoData((prev: any) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: prev.faq.items.map((item: any) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  return (
    <div>
      <Title level={4} className="mb-6">
        SEO & Additional Content
      </Title>

      {/* SEO Settings */}
      <Card title="SEO Settings" className="mb-6" size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <div className="ant-form-item">
              <label className="ant-form-item-label">Meta Title</label>
              <Input
                placeholder="Meta title for search engines"
                value={seoData.metaTitle}
                onChange={(e) =>
                  setSeoData({ ...seoData, metaTitle: e.target.value })
                }
                onFocus={() => setIsMetaTitleTouched(true)}
              />
            </div>
          </Col>

          <Col xs={24}>
            <div className="ant-form-item">
              <label className="ant-form-item-label">Meta Description</label>
              <Input.TextArea
                rows={3}
                placeholder="Meta description for search results"
                value={seoData.metaDescription}
                onChange={(e) =>
                  setSeoData({ ...seoData, metaDescription: e.target.value })
                }
                onFocus={() => setIsMetaDescriptionTouched(true)}
              />
            </div>
          </Col>

          <Col xs={24}>
            <div className="ant-form-item">
              <label className="ant-form-item-label">Meta Keywords</label>
              <Select
                mode="tags"
                className="w-full"
                placeholder="Add relevant keywords"
                value={seoData.metaKeywords}
                onChange={(value) =>
                  setSeoData({ ...seoData, metaKeywords: value })
                }
                tokenSeparators={[",", " "]}
              />
            </div>
          </Col>

          <Col xs={24}>
            <div className="ant-form-item">
              <label className="ant-form-item-label">Canonical URL</label>
              <Input
                placeholder="Original URL if this is duplicate content"
                value={seoData.canonicalUrl}
                onChange={(e) =>
                  setSeoData({ ...seoData, canonicalUrl: e.target.value })
                }
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Promotional Content */}
      <Card title="Promotional Content" className="mb-6" size="small">
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <div className="ant-form-item">
              <label className="ant-form-item-label">Promotional Title</label>
              <Input
                placeholder="Promotional title"
                value={seoData.promo.title}
                onChange={(e) =>
                  setSeoData({
                    ...seoData,
                    promo: { ...seoData.promo, title: e.target.value },
                  })
                }
              />
            </div>
          </Col>

          <Col xs={24}>
            <div className="ant-form-item">
              <label className="ant-form-item-label">Promotional URL</label>
              <Input
                placeholder="Promotional URL"
                value={seoData.promo.url}
                onChange={(e) =>
                  setSeoData({
                    ...seoData,
                    promo: { ...seoData.promo, url: e.target.value },
                  })
                }
              />
            </div>
          </Col>

          <Col xs={24}>
            <div className="ant-form-item">
              <label className="ant-form-item-label">
                Promotional Keywords
              </label>
              <Select
                className="w-full"
                mode="tags"
                placeholder="Promotional keywords"
                value={seoData.promo.keywords}
                onChange={(value) =>
                  setSeoData({
                    ...seoData,
                    promo: { ...seoData.promo, keywords: value },
                  })
                }
              />
            </div>
          </Col>

          <Col xs={24}>
            <div className="ant-form-item">
              <label className="ant-form-item-label">Promotional Image</label>
              <Upload
                listType="picture-card"
                fileList={seoData.promo.imageFileList}
                beforeUpload={() => false}
                onPreview={handlePreview}
                onChange={({ fileList }) =>
                  setSeoData({
                    ...seoData,
                    promo: { ...seoData.promo, imageFileList: fileList },
                  })
                }
                maxCount={1}
              >
                {seoData.promo.imageFileList.length >= 1 ? null : (
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
                value={seoData.faq.sectionTitle}
                onChange={(e) =>
                  setSeoData({
                    ...seoData,
                    faq: { ...seoData.faq, sectionTitle: e.target.value },
                  })
                }
              />
            </div>
          </Col>

          {seoData.faq.items.map((faq: any, index: number) => (
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
                  >
                    Remove
                  </Button>
                }
              >
                <Col xs={24}>
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
                </Col>

                <Col xs={24}>
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
                          updateFaqItem(faq.id, "answer", newContent)
                        }
                        onChange={(newContent) =>
                          updateFaqItem(faq.id, "answer", newContent)
                        }
                      />
                    </div>
                  </div>
                </Col>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

// const SEOStep = ({
//   promoData,
//   setPromoData,
//   faqSectionTitle,
//   setFaqSectionTitle,
//   faqItems,
//   addFaqItem,
//   removeFaqItem,
//   updateFaqItem,
//   faqEditorRefs,
//   faqEditorConfig,
//   handleFaqAnswerChange,
//   handleFaqAnswerBlur,
//   handlePreview,
//   setIsMetaTitleTouched,
//   setIsMetaDescriptionTouched,
// }: any) => (
//   <div>
//     <Title level={4} className="mb-6">
//       SEO & Additional Content
//     </Title>

//     {/* SEO Settings */}
//     <Card title="SEO Settings" className="mb-6" size="small">
//       <Row gutter={[16, 16]}>
//         <Col xs={24}>
//           <Form.Item name="metaTitle" label="Meta Title">
//             <Input
//               placeholder="Meta title for search engines"
//               onFocus={() => setIsMetaTitleTouched(true)}
//             />
//           </Form.Item>
//         </Col>
//         <Col xs={24}>
//           <Form.Item name="metaDescription" label="Meta Description">
//             <Input.TextArea
//               rows={3}
//               placeholder="Meta description for search results"
//               onFocus={() => setIsMetaDescriptionTouched(true)}
//             />
//           </Form.Item>
//         </Col>
//         <Col xs={24}>
//           <Form.Item name="metaKeywords" label="Meta Keywords">
//             <Select
//               mode="tags"
//               placeholder="Add relevant keywords"
//               tokenSeparators={[",", " "]}
//             />
//           </Form.Item>
//         </Col>
//         <Col xs={24}>
//           <Form.Item name="canonicalUrl" label="Canonical URL">
//             <Input placeholder="Original URL if this is duplicate content" />
//           </Form.Item>
//         </Col>
//       </Row>
//     </Card>

//     {/* Promotional Content */}
//     <Card title="Promotional Content" className="mb-6" size="small">
//       <Row gutter={[16, 16]}>
//         <Col xs={24} sm={12}>
//           <div className="ant-form-item">
//             <label className="ant-form-item-label">Promotional Title</label>
//             <Input
//               placeholder="Promotional title"
//               value={promoData.title}
//               onChange={(e) =>
//                 setPromoData((prev: any) => ({
//                   ...prev,
//                   title: e.target.value,
//                 }))
//               }
//             />
//           </div>
//         </Col>
//         <Col xs={24} sm={12}>
//           <div className="ant-form-item">
//             <label className="ant-form-item-label">Promotional URL</label>
//             <Input
//               placeholder="Promotional URL"
//               value={promoData.url}
//               onChange={(e) =>
//                 setPromoData((prev: any) => ({ ...prev, url: e.target.value }))
//               }
//             />
//           </div>
//         </Col>
//         <Col xs={24}>
//           <div className="ant-form-item">
//             <label className="ant-form-item-label">Promotional Keywords</label>
//             <Select
//               mode="tags"
//               placeholder="Promotional keywords"
//               value={promoData.keywords}
//               onChange={(value) =>
//                 setPromoData((prev: any) => ({ ...prev, keywords: value }))
//               }
//             />
//           </div>
//         </Col>
//         <Col xs={24}>
//           <div className="ant-form-item">
//             <label className="ant-form-item-label">Promotional Image</label>
//             <Upload
//               listType="picture-card"
//               fileList={promoData.imageFileList}
//               beforeUpload={() => false}
//               onPreview={handlePreview}
//               onChange={({ fileList }) =>
//                 setPromoData((prev: any) => ({
//                   ...prev,
//                   imageFileList: fileList,
//                 }))
//               }
//               maxCount={1}
//             >
//               {promoData.imageFileList.length >= 1 ? null : (
//                 <div className="text-center">
//                   <PlusOutlined />
//                   <div className="mt-2">Upload Image</div>
//                 </div>
//               )}
//             </Upload>
//           </div>
//         </Col>
//       </Row>
//     </Card>

//     {/* FAQ Section */}
//     <Card
//       title="FAQ Section"
//       size="small"
//       extra={
//         <Button type="primary" icon={<PlusOutlined />} onClick={addFaqItem}>
//           Add FAQ
//         </Button>
//       }
//     >
//       <Row gutter={[16, 16]}>
//         <Col xs={24}>
//           <div className="ant-form-item">
//             <label className="ant-form-item-label">FAQ Section Title</label>
//             <Input
//               placeholder="Frequently Asked Questions"
//               value={faqSectionTitle}
//               onChange={(e) => setFaqSectionTitle(e.target.value)}
//             />
//           </div>
//         </Col>

//         {faqItems.map((faq: any, index: number) => (
//           <Col xs={24} key={faq.id}>
//             <Card
//               size="small"
//               title={`FAQ Item ${index + 1}`}
//               extra={
//                 <Button
//                   type="text"
//                   danger
//                   icon={<DeleteOutlined />}
//                   onClick={() => removeFaqItem(faq.id)}
//                   disabled={faqItems.length === 1}
//                 >
//                   Remove
//                 </Button>
//               }
//             >
//               <Space
//                 direction="vertical"
//                 style={{ width: "100%" }}
//                 size="middle"
//               >
//                 <div className="ant-form-item">
//                   <label className="ant-form-item-label">Question</label>
//                   <Input
//                     placeholder="Enter question"
//                     value={faq.question}
//                     onChange={(e) =>
//                       updateFaqItem(faq.id, "question", e.target.value)
//                     }
//                   />
//                 </div>
//                 <div className="ant-form-item">
//                   <label className="ant-form-item-label">Answer</label>
//                   <div className="border border-gray-300 rounded-lg overflow-hidden">
//                     <JoditEditor
//                       ref={(el) => {
//                         if (el) faqEditorRefs.current[faq.id] = el;
//                       }}
//                       value={faq.answer}
//                       config={faqEditorConfig}
//                       onBlur={(newContent) =>
//                         handleFaqAnswerBlur(faq.id, newContent)
//                       }
//                       onChange={(newContent) =>
//                         handleFaqAnswerChange(faq.id, newContent)
//                       }
//                     />
//                   </div>
//                 </div>
//               </Space>
//             </Card>
//           </Col>
//         ))}

//         {faqItems.length === 0 && (
//           <Col xs={24}>
//             <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
//               <p className="text-gray-500 mb-4">No FAQ items added yet</p>
//               <Button
//                 type="dashed"
//                 icon={<PlusOutlined />}
//                 onClick={addFaqItem}
//               >
//                 Add First FAQ Item
//               </Button>
//             </div>
//           </Col>
//         )}
//       </Row>
//     </Card>
//   </div>
// );

export default CreateBlog;
