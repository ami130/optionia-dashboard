import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Form as AntForm,
  InputNumber,
  Switch,
  Button,
  message,
  Spin,
  Upload,
  Select,
  ColorPicker,
  Space,
  Typography,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Form } from "../../../common/CommonAnt";
import { slugify } from "../../../common/AutoGenerateSlug/AutoGenerateSlug";
import {
  useGetSinglePagesQuery,
  useUpdatePagesMutation,
} from "../api/pagesEndPoints";

const { TextArea } = Input;
const { Title } = Typography;

export default function UpdatePage({ id }: { id: number }) {
  const [form] = AntForm.useForm();
  const {
    data: pageData,
    isLoading: loadingPage,
    refetch,
  } = useGetSinglePagesQuery(Number(id));
  const [updatePage, { isLoading: updating }] = useUpdatePagesMutation();

  // File states
  const [backgroundImage, setBackgroundImage] = useState<any[]>([]);

  // Auto-fill states
  const [isMetaTitleTouched, setIsMetaTitleTouched] = useState(false);
  const [isMetaDescriptionTouched, setIsMetaDescriptionTouched] = useState(false);

  // Handle file upload changes
  const handleUploadChange = (setter: React.Dispatch<React.SetStateAction<any[]>>) => 
    ({ fileList }: any) => setter(fileList);

  // Handle file removal
  const handleFileRemove = (setter: React.Dispatch<React.SetStateAction<any[]>>) => (file: any) => {
    setter((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  // Populate form when data loads
  useEffect(() => {
    if (pageData?.data) {
      const page = pageData.data;
      
      // Convert existing background image to file list format if it exists
      if (page.backgroundImage) {
        const fileName = page.backgroundImage.split('/').pop();
        setBackgroundImage([{
          uid: '-1',
          name: fileName,
          status: 'done',
          url: page.backgroundImage,
        }]);
      }

      form.setFieldsValue({
        name: page.name || "",
        title: page.title || "",
        slug: page.slug || "",
        url: page.url || "",
        type: page.type || "page",
        subtitle: page.subtitle || "",
        description: page.description || "",
        content: page.content || "",
        order: page.order ?? 0,
        navbarShow: page.navbarShow ?? true,
        isActive: page.isActive ?? true,
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        canonicalUrl: page.canonicalUrl || "",
        metaKeywords: page.metaKeywords || [],
        backgroundColor: page.backgroundColor || "#ffffff",
        textColor: page.textColor || "#000000",
        children: page.children?.map((child: any) => ({
          id: child.id,
          title: child.title || "",
          url: child.url || "",
          content: child.content || "",
          order: child.order ?? 0,
          isActive: child.isActive ?? true,
          metaTitle: child.metaTitle || "",
          metaDescription: child.metaDescription || "",
        })) || [],
      });
    }
  }, [pageData, form]);

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData();

      // Basic info
      formData.append("name", values.name || values.title || "");
      formData.append("title", values.title || "");
      formData.append("url", values.url || "");

      // Optional fields
      if (values.slug) formData.append("slug", values.slug);
      if (values.subtitle) formData.append("subtitle", values.subtitle);
      if (values.description) formData.append("description", values.description);
      if (values.type) formData.append("type", values.type);
      if (values.content) formData.append("content", values.content);
      if (values.metaTitle) formData.append("metaTitle", values.metaTitle);
      if (values.metaDescription) formData.append("metaDescription", values.metaDescription);
      if (values.canonicalUrl) formData.append("canonicalUrl", values.canonicalUrl);
      if (values.backgroundColor) formData.append("backgroundColor", values.backgroundColor);
      if (values.textColor) formData.append("textColor", values.textColor);

      // Boolean fields
      formData.append("navbarShow", String(values.navbarShow ?? true));
      formData.append("isActive", String(values.isActive ?? true));

      // Number fields
      formData.append("order", String(values.order || 0));

      // Arrays
      formData.append("metaKeywords", JSON.stringify(values.metaKeywords || []));

      // Children array
      formData.append(
        "children",
        JSON.stringify(
          (values.children || []).map((child: any) => ({
            id: child.id, // Include ID for updates
            title: child.title || "",
            url: child.url || "",
            content: child.content || "",
            order: Number(child.order || 0),
            isActive: child.isActive ?? true,
            metaTitle: child.metaTitle || "",
            metaDescription: child.metaDescription || "",
          }))
        )
      );

      // Background image
      if (backgroundImage[0]?.originFileObj) {
        formData.append("backgroundImage", backgroundImage[0].originFileObj);
      }

      await updatePage({ id, data: formData }).unwrap();
      message.success("Page updated successfully!");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update page");
      console.error("Update page error:", err);
    }
  };

  // Handle form value changes for auto-fill
  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    // Auto-fill slug from title
    if (changedValues.title) {
      form.setFieldsValue({ slug: slugify(changedValues.title) });
    }

    // Auto-fill name from title if name is empty
    if (changedValues.title && !allValues.name) {
      form.setFieldsValue({ name: changedValues.title });
    }

    // Auto-fill metaTitle from title
    if (changedValues.title && !isMetaTitleTouched) {
      form.setFieldsValue({ metaTitle: changedValues.title });
    }

    // Auto-fill metaDescription from subtitle
    if (changedValues.subtitle && !isMetaDescriptionTouched) {
      form.setFieldsValue({ metaDescription: changedValues.subtitle });
    }

    // Auto-fill URL from slug if URL is empty
    if (changedValues.slug && !allValues.url) {
      form.setFieldsValue({ url: `/${changedValues.slug}` });
    }
  };

  // Add a new child page
  const addChildPage = () => {
    const children = form.getFieldValue("children") || [];
    form.setFieldsValue({
      children: [
        ...children,
        {
          title: "",
          url: "",
          content: "",
          order: children.length,
          isActive: true,
          metaTitle: "",
          metaDescription: "",
        },
      ],
    });
  };

  if (loadingPage) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <Title level={2} className="text-center mb-6">
        Update Page
      </Title>

      <Form
        form={form}
        onFinish={onFinish}
        isLoading={updating}
        initialValues={{
          name: "",
          title: "",
          slug: "",
          url: "",
          type: "page",
          subtitle: "",
          description: "",
          content: "",
          order: 0,
          navbarShow: true,
          isActive: true,
          metaTitle: "",
          metaDescription: "",
          canonicalUrl: "",
          metaKeywords: [],
          backgroundColor: "#ffffff",
          textColor: "#000000",
          children: [],
        }}
        onValuesChange={handleFormValuesChange}
      >
        <Row gutter={[24, 24]}>
          {/* PAGE INFORMATION */}
          <Col xs={24}>
            <Card
              title="📄 Page Information"
              className="rounded-xl shadow-sm border-0"
              headStyle={{
                background: "#fafafa",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="title"
                    label="Page Title"
                    rules={[
                      { required: true, message: "Please enter page title" },
                    ]}
                  >
                    <Input size="large" placeholder="Enter page title" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Internal Name"
                    rules={[
                      { required: true, message: "Please enter internal name" },
                    ]}
                  >
                    <Input size="large" placeholder="Internal name" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="slug"
                    label="Slug"
                    rules={[{ required: true, message: "Please enter slug" }]}
                  >
                    <Input size="large" placeholder="page-slug" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="url"
                    label="URL Path"
                    rules={[
                      { required: true, message: "Please enter URL path" },
                    ]}
                  >
                    <Input size="large" placeholder="/about-us" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="type" label="Page Type">
                    <Input size="large" placeholder="Page Type" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item name="order" label="Display Order">
                    <InputNumber
                      min={0}
                      max={100}
                      className="w-full"
                      size="large"
                      placeholder="0"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item
                    name="navbarShow"
                    label="Show in Navbar"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item
                    name="isActive"
                    label="Active Status"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item name="subtitle" label="Subtitle">
                    <Input
                      size="large"
                      placeholder="Brief subtitle for your page"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item name="description" label="Description">
                    <TextArea
                      rows={3}
                      placeholder="Short description of the page content..."
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item name="content" label="Page Content">
                    <TextArea
                      rows={6}
                      placeholder="Main content of your page..."
                      showCount
                      maxLength={5000}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* SEO INFORMATION */}
          <Col xs={24}>
            <Card
              title="🔍 SEO Meta Information"
              className="rounded-xl shadow-sm border-0"
              headStyle={{
                background: "#fafafa",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item name="metaTitle" label="Meta Title">
                    <Input
                      size="large"
                      placeholder="Title for search engines"
                      onChange={() => setIsMetaTitleTouched(true)}
                      showCount
                      maxLength={60}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item name="metaDescription" label="Meta Description">
                    <TextArea
                      rows={3}
                      placeholder="Description for search engines"
                      onChange={() => setIsMetaDescriptionTouched(true)}
                      showCount
                      maxLength={160}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="metaKeywords" label="Meta Keywords">
                    <Select
                      mode="tags"
                      size="large"
                      placeholder="Add keywords"
                      tokenSeparators={[",", " "]}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="canonicalUrl" label="Canonical URL">
                    <Input
                      size="large"
                      placeholder="https://example.com/page-url"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* DESIGN INFORMATION */}
          <Col xs={24}>
            <Card
              title="🎨 Design & Media"
              className="rounded-xl shadow-sm border-0"
              headStyle={{
                background: "#fafafa",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item name="backgroundImage" label="Background Image">
                    <Upload
                      listType="picture-card"
                      fileList={backgroundImage}
                      onChange={handleUploadChange(setBackgroundImage)}
                      onRemove={handleFileRemove(setBackgroundImage)}
                      beforeUpload={() => false}
                      accept="image/*"
                      maxCount={1}
                    >
                      {backgroundImage.length >= 1 ? null : (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="backgroundColor" label="Background Color">
                    <ColorPicker
                      showText
                      size="large"
                      format="hex"
                      presets={[
                        {
                          label: "Recommended",
                          colors: [
                            "#ffffff",
                            "#f8f9fa",
                            "#e9ecef",
                            "#dee2e6",
                            "#adb5bd",
                            "#6c757d",
                            "#495057",
                            "#343a40",
                            "#212529",
                          ],
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="textColor" label="Text Color">
                    <ColorPicker
                      showText
                      size="large"
                      format="hex"
                      presets={[
                        {
                          label: "Recommended",
                          colors: [
                            "#000000",
                            "#212529",
                            "#343a40",
                            "#495057",
                            "#6c757d",
                            "#ffffff",
                            "#f8f9fa",
                            "#e9ecef",
                          ],
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* CHILD PAGES */}
          <Col xs={24}>
            <Card
              title="📑 Child Pages (Optional)"
              className="rounded-xl shadow-sm border-0"
              headStyle={{
                background: "#fafafa",
                borderBottom: "1px solid #f0f0f0",
              }}
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addChildPage}
                  size="large"
                >
                  Add Child Page
                </Button>
              }
            >
              <AntForm.List name="children">
                {(fields, {  remove }) => (
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="large"
                  >
                    {fields.map(({ key, name, ...restField }: any) => (
                      <Card
                        key={key}
                        type="inner"
                        title={`Child Page ${name + 1}`}
                        extra={
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            size="small"
                          >
                            Remove
                          </Button>
                        }
                        className="mb-4"
                      >
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "title"]}
                              label="Child Page Title"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter child page title",
                                },
                              ]}
                            >
                              <Input
                                placeholder="Enter child page title"
                                size="large"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "url"]}
                              label="Child Page URL"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter child page URL",
                                },
                              ]}
                            >
                              <Input
                                placeholder="/child-page-url"
                                size="large"
                                addonBefore="/"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24}>
                            <Form.Item
                              {...restField}
                              name={[name, "content"]}
                              label="Child Page Content"
                            >
                              <TextArea
                                rows={3}
                                placeholder="Child page content..."
                                showCount
                                maxLength={1000}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "order"]}
                              label="Order"
                            >
                              <InputNumber
                                min={0}
                                className="w-full"
                                size="large"
                                placeholder="0"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "isActive"]}
                              label="Active"
                              valuePropName="checked"
                            >
                              <Switch
                                checkedChildren="Active"
                                unCheckedChildren="Inactive"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "metaTitle"]}
                              label="Child Meta Title"
                            >
                              <Input
                                placeholder="Child meta title"
                                size="large"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24}>
                            <Form.Item
                              {...restField}
                              name={[name, "metaDescription"]}
                              label="Child Meta Description"
                            >
                              <TextArea
                                rows={2}
                                placeholder="Child meta description..."
                                showCount
                                maxLength={160}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}

                    {fields.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <p className="text-gray-500 mb-4">
                          No child pages added yet
                        </p>
                        <Button
                          type="dashed"
                          icon={<PlusOutlined />}
                          onClick={addChildPage}
                          size="large"
                        >
                          Add First Child Page
                        </Button>
                      </div>
                    )}
                  </Space>
                )}
              </AntForm.List>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}