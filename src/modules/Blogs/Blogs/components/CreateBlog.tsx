import { useState, useEffect, useRef } from "react";
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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Form } from "../../../../common/CommonAnt";
import { slugify } from "../../../../common/AutoGenerateSlug/AutoGenerateSlug";
import { useCreateBlogMutation } from "../api/blogsEndPoints";
import { useGetCategoriesQuery } from "../../Categories/api/categoriesEndPoints";
import { useGetUsersQuery } from "../../../User/api/userEndPoints";
import { useGetTagsQuery } from "../../Tag/api/tagsEndPoints";
import { useGetPagesQuery } from "../../../Pages/api/pagesEndPoints";

const { Option } = Select;

const CreateBlog = () => {
  const [form] = AntForm.useForm();
  const [thumbnailFileList, setThumbnailFileList] = useState<any[]>([]);
  const [galleryFileList, setGalleryFileList] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isMetaTitleTouched, setIsMetaTitleTouched] = useState(false);
  const [isMetaDescriptionTouched, setIsMetaDescriptionTouched] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  
  const editorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

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
      setIsPublished(false);
      setIsMetaTitleTouched(false);
      setIsMetaDescriptionTouched(false);
      setEditorContent("");
    }
    if (blogPage) form.setFieldsValue({ pageId: blogPage.id });
  }, [isSuccess, form, blogPage]);

  // Initialize Jodit Editor
  useEffect(() => {
    const initEditor = async () => {
      try {
        // Dynamically import Jodit
        const JoditModule = await import('jodit');
        // Cast to any to avoid TypeScript typing issues across different package shapes
        const JoditCtor: any =
          (JoditModule as any).default || (JoditModule as any).Jodit || JoditModule;
        
        if (!JoditCtor || !editorContainerRef.current) return;

        // Create editor instance using the constructor
        const editor = new JoditCtor(editorContainerRef.current, {
          height: 400,
          placeholder: 'Write your blog content here...',
          toolbarButtonSize: 'medium',
          buttons: [
            'bold', 'italic', 'underline', 'strikethrough',
            '|', 'ul', 'ol', 'outdent', 'indent',
            '|', 'font', 'fontsize', 'brush', 'paragraph',
            '|', 'image', 'table', 'link',
            '|', 'left', 'center', 'right', 'justify',
            '|', 'undo', 'redo', '|', 'preview'
          ],
          showXPathInStatusbar: false,
          showCharsCounter: false,
          showWordsCounter: true,
          toolbarAdaptive: false
        });

        // Set initial content
        editor.value = editorContent;

        // Handle content changes
        editor.events.on('change', (newContent: string) => {
          setEditorContent(newContent);
        });

        editorRef.current = editor;

      } catch (error) {
        console.error('Failed to initialize Jodit editor:', error);
      }
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destruct();
        } catch (error) {
          console.error('Error destroying editor:', error);
        }
        editorRef.current = null;
      }
    };
  }, []);

  // Update editor content when editorContent state changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.value !== editorContent) {
      editorRef.current.value = editorContent;
    }
  }, [editorContent]);

  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();

    // Basic info
    formData.append("title", values.title);
    formData.append("slug", slugify(values.slug || values.title));
    formData.append("subtitle", values.subtitle);
    formData.append("content", editorContent || "");
    formData.append("readingTime", values.readingTime.toString());
    formData.append("wordCount", values.wordCount.toString());
    formData.append("featured", values.featured ? "true" : "false");
    formData.append("blogType", values.blogType);
    formData.append("status", isPublished ? "published" : "draft");

    // IDs
    if (values.categoryId)
      formData.append("categoryId", values.categoryId.toString());
    if (values.authorIds)
      formData.append(
        "authorIds",
        JSON.stringify(values.authorIds.map((id: string) => parseInt(id)))
      );
    if (values.tagIds)
      formData.append(
        "tagIds",
        JSON.stringify(values.tagIds.map((id: string) => parseInt(id)))
      );
    if (blogPage) formData.append("pageId", blogPage.id.toString());

    // Images
    const thumbnailFile = thumbnailFileList[0]?.originFileObj;
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    galleryFileList.forEach(
      (file) =>
        file.originFileObj &&
        formData.append(`galleryImages`, file.originFileObj)
    );

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

  const blogTypeOptions = [
    { value: "ARTICLE", label: "ARTICLE" },
    { value: "NEWS_ARTICLE", label: "News Article" },
    { value: "BLOG_POSTING", label: "BLOG POSTING" },
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

  return (
    <div className="p-6">
      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        isSuccess={isSuccess}
        initialValues={{
          featured: false,
          blogType: "ARTICLE",
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
              rules={[{ 
                required: true, 
                validator: (_, value) => {
                  const textContent = editorContent?.replace(/<[^>]*>/g, '').trim();
                  if (!textContent) {
                    return Promise.reject(new Error('Please enter blog content'));
                  }
                  return Promise.resolve();
                }
              }]}
            >
              <div 
                ref={editorContainerRef}
                style={{ 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '6px',
                  minHeight: '400px'
                }}
              />
            </Form.Item>
          </Col>

          {/* Rest of your form remains exactly the same */}
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
            <Form.Item
              name="wordCount"
              label="Word Count"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} placeholder="0" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item name="featured" label="Featured" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>

          <Col xs={24} sm={6}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Switch
                  checked={isPublished}
                  onChange={setIsPublished}
                  checkedChildren="Published"
                  unCheckedChildren="Draft"
                />
                <span
                  style={{
                    color: isPublished ? "#52c41a" : "#faad14",
                    fontWeight: 500,
                  }}
                >
                  {isPublished ? "Published" : "Draft"}
                </span>
              </div>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="blogType"
              label="Blog Type"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select blog type">
                {blogTypeOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Page Selection */}
          <Col xs={24} sm={8}>
            <Form.Item name="pageId" label="Page">
              <Select disabled value={blogPage?.id}>
                {blogPage && (
                  <Option value={blogPage.id}>
                    {blogPage.name || blogPage.title || "Blog Page"}
                  </Option>
                )}
              </Select>
            </Form.Item>
          </Col>

          {/* Category, Tags & Authors */}
          <Col xs={24}>
            <h2 className="text-lg font-semibold mb-4">
              Categories, Tags & Authors
            </h2>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select category"
                loading={!categoryData}
                showSearch
                optionFilterProp="label"
              >
                {categoryOptions?.map((category: any) => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item name="tagIds" label="Tags">
              <Select
                mode="multiple"
                placeholder="Select tags"
                loading={!tagsData}
                showSearch
                allowClear
              >
                {tagsOptions.map((tag: any) => (
                  <Option key={tag.value} value={tag.value}>
                    {tag.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="authorIds"
              label="Authors"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                placeholder="Select authors"
                loading={!userData}
                showSearch
              >
                {authorOptions.map((author: any) => (
                  <Option key={author.value} value={author.value}>
                    {author.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Images Section */}
          <Col xs={24}>
            <h2 className="text-lg font-semibold mb-4">Images</h2>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="thumbnail" label="Thumbnail Image">
              <Upload
                beforeUpload={() => false}
                listType="picture-card"
                fileList={thumbnailFileList}
                onPreview={handlePreview}
                onChange={({ fileList }) => setThumbnailFileList(fileList)}
                maxCount={1}
                accept=".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp"
              >
                {thumbnailFileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload Thumbnail</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="galleryImages" label="Gallery Images">
              <Upload
                beforeUpload={() => false}
                listType="picture-card"
                fileList={galleryFileList}
                onPreview={handlePreview}
                onChange={({ fileList }) => setGalleryFileList(fileList)}
                multiple
                accept=".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp"
              >
                {galleryFileList.length < 8 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload Gallery</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          {/* SEO Meta Information */}
          <Col xs={24}>
            <h2 className="text-lg font-semibold mb-4">SEO Information</h2>
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
                placeholder="Enter keywords (type and press enter)"
                tokenSeparators={[","]}
                style={{ width: "100%" }}
                open={false}
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