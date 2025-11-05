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
  Card,
  Image,
  Tag,
  Space,
  Button,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Form } from "../../../../common/CommonAnt";
import { slugify } from "../../../../common/AutoGenerateSlug/AutoGenerateSlug";
import { useUpdateBlogMutation } from "../api/blogsEndPoints";
import { useGetCategoriesQuery } from "../../Categories/api/categoriesEndPoints";
import { useGetUsersQuery } from "../../../User/api/userEndPoints";
import { useGetTagsQuery } from "../../Tag/api/tagsEndPoints";
import { useGetPagesQuery } from "../../../Pages/api/pagesEndPoints";
import JoditEditor from "jodit-react";
import { baseUrl } from "../../../../utilities/baseQuery";

// Define comprehensive type for Jodit config
interface JoditConfig {
  // Basic settings
  height: number;
  minHeight: number;
  maxHeight: number;
  placeholder: string;
  readonly: boolean;
  toolbar: boolean;
  toolbarButtonSize: "small" | "middle" | "large";

  // Toolbar configuration
  buttons: string[];
  toolbarAdaptive: boolean;

  // Behavior settings
  enter: "div" | "br" | "p";
  allowTabNavigation: boolean;
  saveSelectionOnBlur: boolean;
  preserveSelection: boolean;

  // UI settings
  showXPathInStatusbar: boolean;
  showCharsCounter: boolean;
  showWordsCounter: boolean;
  showPlaceholder: boolean;

  // Functionality
  useSearch: boolean;
  spellcheck: boolean;
  iframe: boolean;
  autofocus: boolean;
  direction: "ltr" | "rtl";

  // Performance
  disablePlugins: string[];

  // Styling
  style?: {
    [key: string]: string | number;
  };

  // Advanced features
  uploader?: {
    insertImageAsBase64URI: boolean;
  };
  link?: {
    noFollowCheckbox?: boolean;
    openInNewTabCheckbox?: boolean;
  };
  image?: {
    editSrc?: boolean;
    useImageEditor?: boolean;
  };
}

const UpdateBlog = ({ record }: { record: any }) => {
  const [form] = AntForm.useForm();
  const [thumbnailFileList, setThumbnailFileList] = useState<any[]>([]);
  const [galleryFileList, setGalleryFileList] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isMetaTitleTouched, setIsMetaTitleTouched] = useState(false);
  const [isMetaDescriptionTouched, setIsMetaDescriptionTouched] =
    useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [editorError, setEditorError] = useState<string | null>(null);
  const [imageIndexMap, setImageIndexMap] = useState<Record<string, number>>(
    {}
  );

  const editorRef = useRef<any>(null);

  const [updateBlog, { isLoading, isSuccess }] = useUpdateBlogMutation();
  const { data: categoryData } = useGetCategoriesQuery<any>({});
  const { data: tagsData } = useGetTagsQuery<any>({});
  const { data: userData } = useGetUsersQuery<any>({});
  const { data: pageData } = useGetPagesQuery<any>({});

  const blogPage = pageData?.data?.find(
    (page: any) =>
      page.name?.toLowerCase().includes("blog") ||
      page.title?.toLowerCase().includes("blog")
  );

  // Most Advanced Jodit configuration with all features
  const editorConfig: JoditConfig = useMemo(
    () => ({
      // Basic editor settings
      height: 600,
      minHeight: 400,
      maxHeight: 800,
      placeholder:
        "Write your amazing blog content here... Start with a captivating introduction!",
      readonly: false,
      toolbar: true,
      toolbarButtonSize: "middle",

      // Comprehensive toolbar buttons
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "image",
        "video",
        "file",
        "|",
        "table",
        "|",
        "link",
        "|",
        "hr",
        "blockquote",
        "|",
        "source",
        "preview",
        "|",
        "cut",
        "copy",
        "paste",
        "copyformat",
        "|",
        "superscript",
        "subscript",
        "|",
        "symbols",
        "|",
        "undo",
        "redo",
        "|",
        "fullsize",
        "about",
        "find",
        "selectall",
        "print",
        "eraser",
      ],

      // Toolbar behavior
      toolbarAdaptive: false,

      // Editor behavior
      enter: "p",
      allowTabNavigation: true,
      saveSelectionOnBlur: true,
      preserveSelection: true,

      // UI elements
      showXPathInStatusbar: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showPlaceholder: true,

      // Functionality
      useSearch: true,
      spellcheck: true,
      iframe: false,
      autofocus: false,
      direction: "ltr",

      // Performance optimization
      disablePlugins: ["mobile", "speechRecognize"],

      // Styling
      style: {
        fontSize: "16px",
        lineHeight: "1.6",
        fontFamily: "Arial, sans-serif",
      },

      // Advanced features configuration
      uploader: {
        insertImageAsBase64URI: true,
      },

      link: {
        noFollowCheckbox: true,
        openInNewTabCheckbox: true,
      },

      image: {
        editSrc: true,
        useImageEditor: true,
      },
    }),
    []
  );

  useEffect(() => {
    if (record) {
      // Parse metaData if it's a string
      const metaData =
        typeof record.metaData === "string"
          ? JSON.parse(record.metaData)
          : record.metaData || {};

      // Set existing images with baseUrl
      if (record.image && Array.isArray(record.image)) {
        const imagesWithBaseUrl = record.image.map((img: string) =>
          img.startsWith("http") ? img : baseUrl + img
        );
        setExistingImages(imagesWithBaseUrl);
      }

      // Set thumbnail if exists with baseUrl
      if (record.thumbnailUrl) {
        const thumbnailUrl = record.thumbnailUrl.startsWith("http")
          ? record.thumbnailUrl
          : baseUrl + record.thumbnailUrl;

        setThumbnailFileList([
          {
            uid: "-1",
            name: "thumbnail",
            status: "done",
            url: thumbnailUrl,
          },
        ]);
      }

      // Set form values
      form.setFieldsValue({
        title: record.title || "",
        slug: record.slug || "",
        subtitle: record.subtitle || "",
        readingTime: record.readingTime || 5,
        wordCount: record.wordCount || 0,
        featured: record.featured || false,
        blogType: record.blogType || "Article",
        categoryId: record.category?.id,
        tagIds: record.tags?.map((tag: any) => tag.id) || [],
        authorIds: record.authors?.map((author: any) => author.id) || [],
        pageId: record.page?.id || blogPage?.id,
        metaTitle: metaData.metaTitle || "",
        metaDescription: metaData.metaDescription || "",
        metaKeywords: metaData.metaKeywords || [],
        canonicalUrl: metaData.canonicalUrl || "",
      });

      // Set editor content
      setEditorContent(record.content || "");

      // Set published status
      setIsPublished(record.status === "published");
    }
  }, [record, form, blogPage]);

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

  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewTitle(
      file.name || file.url?.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
  };

  // Handle existing image deletion
  const handleDeleteExistingImage = (index: number) => {
    const newExistingImages = [...existingImages];
    newExistingImages.splice(index, 1);
    setExistingImages(newExistingImages);
    message.success("Image marked for deletion");
  };

  // Handle image replacement
  const handleReplaceImage = (index: number) => {
    setImageIndexMap((prev) => ({ ...prev, image: index }));
    message.info(
      `Image at position ${
        index + 1
      } will be replaced when you upload a new image`
    );
  };

  // const onFinish = async (values: any) => {
  //   const formData = new FormData();

  //   // Enhanced content validation
  //   const textContent = editorContent?.replace(/<[^>]*>/g, "").trim();
  //   if (!textContent) {
  //     form.setFields([
  //       {
  //         name: "content",
  //         errors: ["Please enter blog content"],
  //       },
  //     ]);
  //     setEditorError("Blog content is required");
  //     return;
  //   }

  //   if (textContent.length < 50) {
  //     form.setFields([
  //       {
  //         name: "content",
  //         errors: ["Blog content should be at least 50 characters long"],
  //       },
  //     ]);
  //     setEditorError("Blog content should be at least 50 characters long");
  //     return;
  //   }

  //   // Basic info - EXACTLY like create form
  //   formData.append("title", values.title);
  //   formData.append("slug", slugify(values.slug || values.title));
  //   formData.append("subtitle", values.subtitle);
  //   formData.append("content", editorContent);
  //   formData.append("readingTime", values.readingTime.toString());
  //   formData.append("wordCount", values.wordCount.toString());
  //   formData.append("featured", values.featured ? "true" : "false");
  //   formData.append("blogType", values.blogType);
  //   formData.append("status", isPublished ? "published" : "draft");

  //   // IDs - EXACTLY like create form
  //   if (values.categoryId) formData.append("categoryId", values.categoryId.toString());
  //   if (values.pageId) formData.append("pageId", values.pageId.toString());

  //   if (values.authorIds && Array.isArray(values.authorIds)) {
  //     formData.append("authorIds", JSON.stringify(values.authorIds));
  //   }

  //   if (values.tagIds && Array.isArray(values.tagIds)) {
  //     formData.append("tagIds", JSON.stringify(values.tagIds));
  //   }

  //   // Images - handle thumbnail (fieldname: 'thumbnail')
  //   const thumbnailFile = thumbnailFileList.find(file => file.originFileObj)?.originFileObj;
  //   if (thumbnailFile) {
  //     formData.append("thumbnail", thumbnailFile); // Fieldname: 'thumbnail' like create
  //   }

  //   // Images - handle gallery images (fieldname: 'image' for multiple)
  //   const newGalleryFiles = galleryFileList
  //     .filter(file => file.originFileObj)
  //     .map(file => file.originFileObj);

  //   newGalleryFiles.forEach((file) => {
  //     formData.append("image", file); // Fieldname: 'image' like create
  //   });

  //   // Add image index map for replacements
  //   if (Object.keys(imageIndexMap).length > 0) {
  //     formData.append("imageIndexMap", JSON.stringify(imageIndexMap));
  //   }

  //   // Meta data - EXACTLY like create form
  //   const metaData = {
  //     metaTitle: values.metaTitle,
  //     metaDescription: values.metaDescription,
  //     metaKeywords: values.metaKeywords || [],
  //     canonicalUrl: values.canonicalUrl,
  //   };
  //   formData.append("metaData", JSON.stringify(metaData));

  //   try {
  //     await updateBlog({
  //       id: record?.id,
  //       data: formData
  //     }).unwrap();

  //     message.success('Blog updated successfully!');
  //   } catch (error) {
  //     message.error('Failed to update blog. Please try again.');
  //   }
  // };

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

    // Basic info - EXACTLY like create form
    formData.append("title", values.title);
    formData.append("slug", slugify(values.slug || values.title));
    formData.append("subtitle", values.subtitle);
    formData.append("content", editorContent);
    formData.append("readingTime", values.readingTime.toString());
    formData.append("wordCount", values.wordCount.toString());
    formData.append("featured", values.featured ? "true" : "false");
    formData.append("blogType", values.blogType);
    formData.append("status", isPublished ? "published" : "draft");

    // IDs - EXACTLY like create form
    if (values.categoryId)
      formData.append("categoryId", values.categoryId.toString());
    if (values.pageId) formData.append("pageId", values.pageId.toString());

    // Convert arrays to proper format
    if (values.authorIds && Array.isArray(values.authorIds)) {
      // Send as individual fields for array validation
      values.authorIds.forEach((id: number, index: number) => {
        formData.append(`authorIds[${index}]`, id.toString());
      });
    }

    if (values.tagIds && Array.isArray(values.tagIds)) {
      // Send as individual fields for array validation
      values.tagIds.forEach((id: number, index: number) => {
        formData.append(`tagIds[${index}]`, id.toString());
      });
    }

    // Images - handle thumbnail (fieldname: 'thumbnail')
    const thumbnailFile = thumbnailFileList.find(
      (file) => file.originFileObj
    )?.originFileObj;
    if (thumbnailFile) {
      formData.append("thumbnailUrl", thumbnailFile); // Fieldname: 'thumbnail' like create
    }

    // Images - handle gallery images (fieldname: 'image' for multiple)
    const newGalleryFiles = galleryFileList
      .filter((file) => file.originFileObj)
      .map((file) => file.originFileObj);

    newGalleryFiles.forEach((file) => {
      formData.append("image", file); // Fieldname: 'image' like create
    });

    // Add image index map for replacements
    if (Object.keys(imageIndexMap).length > 0) {
      formData.append("imageIndexMap", JSON.stringify(imageIndexMap));
    }

    // Add existing images that weren't deleted
    if (existingImages.length > 0) {
      // Convert back to relative URLs for backend
      const relativeImages = existingImages.map((img) =>
        img.replace(baseUrl, "")
      );
      formData.append("existingImages", JSON.stringify(relativeImages));
    }

    // Meta data - EXACTLY like create form
    const metaData = {
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      metaKeywords: values.metaKeywords || [],
      canonicalUrl: values.canonicalUrl,
    };
    formData.append("metaData", JSON.stringify(metaData));

    try {
      await updateBlog({
        id: record?.id,
        data: formData,
      }).unwrap();

      message.success("Blog updated successfully!");
    } catch (error) {
      message.error("Failed to update blog. Please try again.");
      console.error("Update error:", error);
    }
  };

  const blogTypeOptions = [
    { value: "Article", label: "ARTICLE" },
    { value: "NewsArticle", label: "NEWS ARTICLE" },
    { value: "BlogPosting", label: "BLOG POSTING" },
  ];

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
  const pageOptions =
    pageData?.data?.map((p: any) => ({
      value: p.id,
      label: p.name || p.title,
    })) || [];

  return (
    <div className="p-6">
      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        isSuccess={isSuccess}
        initialValues={{}}
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
            <Form.Item
              name="subtitle"
              label="Subtitle"
              rules={[{ required: true }]}
            >
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
            <Form.Item name="featured" label="Featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item name="status" label="Status">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Switch
                  checked={isPublished}
                  onChange={setIsPublished}
                  checkedChildren="Published"
                  unCheckedChildren="Draft"
                />
                <Tag color={isPublished ? "green" : "orange"}>
                  {isPublished ? "PUBLISHED" : "DRAFT"}
                </Tag>
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

          {/* Page Selection */}
          <Col xs={24}>
            <Form.Item name="pageId" label="Page">
              <Select
                placeholder="Select page"
                options={pageOptions}
                allowClear
              />
            </Form.Item>
          </Col>

          {/* Images */}
          <Col xs={24}>
            <h2 className="text-lg font-semibold mb-4">Images</h2>
          </Col>

          {/* Thumbnail */}
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
          Update User
            </Form.Item>
          </Col>

          {/* Gallery Images */}
          <Col xs={24} sm={12}>
            <Form.Item name="image" label="Gallery Images (Max 5)">
              <Upload
                listType="picture-card"
                fileList={galleryFileList}
                onPreview={handlePreview}
                onChange={({ fileList }) => setGalleryFileList(fileList)}
                beforeUpload={() => false}
                multiple
                maxCount={5}
              >
                {galleryFileList.length >= 5 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                You can upload up to 5 gallery images
              </div>
            </Form.Item>
          </Col>

          {/* Existing Images Management */}
          {existingImages.length > 0 && (
            <Col xs={24}>
              <Card title="Existing Gallery Images" size="small">
                <div style={{ marginBottom: 16 }}>
                  <Tag color="orange">Manage existing images</Tag>
                  <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>
                    Delete images or mark them for replacement
                  </span>
                </div>
                <Row gutter={[16, 16]}>
                  {existingImages.map((image, index) => (
                    <Col key={index} xs={12} sm={8} md={6}>
                      <Card
                        size="small"
                        cover={
                          <Image
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            style={{ height: 120, objectFit: "cover" }}
                            preview={{
                              mask: <EyeOutlined />,
                            }}
                          />
                        }
                        actions={[
                          <EyeOutlined
                            key="view"
                            onClick={() => {
                              setPreviewImage(image);
                              setPreviewTitle(`Image ${index + 1}`);
                              setPreviewOpen(true);
                            }}
                          />,
                          <DeleteOutlined
                            key="delete"
                            onClick={() => handleDeleteExistingImage(index)}
                            style={{ color: "#ff4d4f" }}
                          />,
                        ]}
                      >
                        <div style={{ textAlign: "center" }}>
                          <Tag color="blue">Image {index + 1}</Tag>
                          <div style={{ marginTop: 8 }}>
                            <Button
                              size="small"
                              type="dashed"
                              onClick={() => handleReplaceImage(index)}
                            >
                              Replace
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          )}

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

          {/* Current Blog Info */}
          <Col xs={24}>
            <Card title="Current Blog Information" size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <strong>ID:</strong> {record?.id}
                </div>
                <div>
                  <strong>Slug:</strong> {record?.slug}
                </div>
                <div>
                  <strong>Created:</strong>{" "}
                  {record?.createdAt
                    ? new Date(record.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
                <div>
                  <strong>Last Updated:</strong>{" "}
                  {record?.updatedAt
                    ? new Date(record.updatedAt).toLocaleDateString()
                    : "N/A"}
                </div>
                <div>
                  <strong>Current Status:</strong>
                  <Tag
                    color={record?.status === "published" ? "green" : "orange"}
                    style={{ marginLeft: 8 }}
                  >
                    {record?.status?.toUpperCase() || "DRAFT"}
                  </Tag>
                </div>
                <div>
                  <strong>Images:</strong>
                  <Tag style={{ marginLeft: 8 }}>
                    {existingImages.length} gallery images
                  </Tag>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
          width="80%"
          style={{ top: 20 }}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Form>
    </div>
  );
};

export default UpdateBlog;
