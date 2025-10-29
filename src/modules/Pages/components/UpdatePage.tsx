import { useEffect } from "react";
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
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Form } from "../../../common/CommonAnt";
import {
  useGetSinglePagesQuery,
  useUpdatePagesMutation,
} from "../api/pagesEndPoints";

export default function UpdatePage({ id }: { id: number }) {
  const [form] = AntForm.useForm();
  const {
    data: pageData,
    isLoading,
    refetch,
  } = useGetSinglePagesQuery(Number(id));
  const [update, { isLoading: updating }] = useUpdatePagesMutation();

  // 🔹 Populate form when data loads
  useEffect(() => {
    if (pageData?.data) {
      const page = pageData.data;
      form.setFieldsValue({
        title: page.title || "",
        url: page.url || "",
        type: page.type || "",
        order: page.order ?? 0,
        isActive: page.isActive ?? true,
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        children:
          page.children?.map((child: any) => ({
            id: child.id, // ✅ important for PATCH
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

  // 🔹 Helper to remove undefined or unchanged fields
  const cleanPayload = (data: any) => {
    const payload: any = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) payload[key] = value;
    });
    return payload;
  };

  const onFinish = async (values: any) => {
    try {
      const payload: any = cleanPayload({
        title: values.title,
        url: values.url,
        type: values.type,
        order: Number(values.order || 0),
        isActive: values.isActive,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        children:
          values.children?.map((child: any) =>
            cleanPayload({
              id: child.id, // include only if exists
              title: child.title,
              url: child.url,
              content: child.content || null,
              order: Number(child.order || 0),
              isActive: child.isActive,
              metaTitle: child.metaTitle,
              metaDescription: child.metaDescription,
            })
          ) || [],
      });

      await update({ id, data: payload }).unwrap();
      message.success("Page updated successfully!");
      refetch(); // refresh data
    } catch (err: any) {
      console.error(err);
      message.error(err?.data?.message || "Failed to update page");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <Form form={form} onFinish={onFinish} isLoading={updating}>
        <Row gutter={[24, 24]}>
          {/* === PAGE INFORMATION === */}
          <Col xs={24}>
            <Card
              title="Update Page Information"
              className="rounded-xl shadow-sm"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                      { required: true, message: "Please enter a title" },
                    ]}
                  >
                    <Input size="large" placeholder="e.g. Blog" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="url"
                    label="URL"
                    rules={[{ required: true, message: "Please enter a URL" }]}
                  >
                    <Input size="large" placeholder="/blog" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="type" label="Type">
                    <Input size="large" placeholder="service" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={6}>
                  <Form.Item name="order" label="Order">
                    <InputNumber min={0} size="large" className="w-full" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={4}>
                  <Form.Item
                    name="isActive"
                    label="Active"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* === SEO INFORMATION === */}
          <Col xs={24}>
            <Card title="SEO Meta Information" className="rounded-xl shadow-sm">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item name="metaTitle" label="Meta Title">
                    <Input size="large" placeholder="Home | Optionia" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="metaDescription" label="Meta Description">
                    <Input size="large" placeholder="Check out Optionia" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* === CHILD PAGES === */}
          <Col xs={24}>
            <Card
              title="Update Child Pages"
              className="rounded-xl shadow-sm"
              extra={
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const children = form.getFieldValue("children") || [];
                    form.setFieldsValue({
                      children: [
                        ...children,
                        {
                          title: "",
                          url: "",
                          order: 0,
                          isActive: true,
                          metaTitle: "",
                          metaDescription: "",
                        },
                      ],
                    });
                  }}
                >
                  Add New Child Page
                </Button>
              }
            >
              <AntForm.List name="children">
                {(fields, { remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }: any) => {
                      return (
                        <div
                          key={key}
                          className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50 relative"
                        >
                          <Button
                            danger
                            type="text"
                            icon={<MinusCircleOutlined />}
                            className="absolute top-1 right-3"
                            onClick={() => remove(name)}
                          />

                          <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "title"]}
                                label="Child Title"
                                rules={[{ required: true }]}
                              >
                                <Input
                                  placeholder="Child Page Title"
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "url"]}
                                label="Child URL"
                                rules={[{ required: true }]}
                              >
                                <Input
                                  placeholder="/features/child"
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={6}>
                              <Form.Item
                                {...restField}
                                name={[name, "order"]}
                                label="Order"
                              >
                                <InputNumber
                                  min={0}
                                  size="large"
                                  className="w-full"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={6}>
                              <Form.Item
                                {...restField}
                                name={[name, "isActive"]}
                                label="Active"
                                valuePropName="checked"
                                initialValue={true}
                              >
                                <Switch
                                  checkedChildren="Active"
                                  unCheckedChildren="Inactive"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "metaTitle"]}
                                label="Meta Title"
                              >
                                <Input
                                  placeholder="Child Meta Title"
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "metaDescription"]}
                                label="Meta Description"
                              >
                                <Input
                                  placeholder="Child Meta Description"
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      );
                    })}
                  </>
                )}
              </AntForm.List>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
