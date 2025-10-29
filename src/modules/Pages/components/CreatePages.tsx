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
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Form } from "../../../common/CommonAnt";
import { useCreatePagesMutation } from "../api/pagesEndPoints";

const CreatePages = () => {
  const [form] = AntForm.useForm();
  const [create, { isLoading, isSuccess }] = useCreatePagesMutation();

  const onFinish = async (values: any): Promise<void> => {
    const payload = {
      ...values,
      children:
        values.children?.map((child: any) => ({
          ...child,
          order: Number(child.order || 0),
        })) || [],
    };

    try {
      await create(payload).unwrap();
      message.success("Page created successfully!");
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create page");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        isSuccess={isSuccess}
        initialValues={{
          isActive: true,
          order: 0,
        }}
      >
        <Row gutter={[24, 24]}>
          {/* === PAGE INFORMATION === */}
          <Col xs={24}>
            <Card
              title={
                <h3 className="text-lg font-semibold text-gray-800">
                  Page Information
                </h3>
              }
              className="rounded-xl shadow-sm"
              headStyle={{ borderBottom: "1px solid #f3f3f3" }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="title"
                    label={
                      <span className="font-medium text-gray-700">Title</span>
                    }
                    rules={[
                      { required: true, message: "Please enter a title" },
                      {
                        max: 100,
                        message: "Title must be under 100 characters",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="e.g. Blog" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="url"
                    label={
                      <span className="font-medium text-gray-700">URL</span>
                    }
                    rules={[{ required: true, message: "Please enter a URL" }]}
                  >
                    <Input size="large" placeholder="/blog" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="type"
                    label={
                      <span className="font-medium text-gray-700">Type</span>
                    }
                    tooltip="Example: home, service, blog"
                  >
                    <Input size="large" placeholder="service" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item
                    name="order"
                    label={
                      <span className="font-medium text-gray-700">Order</span>
                    }
                  >
                    <InputNumber min={0} className="w-full" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={4}>
                  <Form.Item
                    name="isActive"
                    label={
                      <span className="font-medium text-gray-700">
                        Active Status
                      </span>
                    }
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
            <Card
              title={
                <h3 className="text-lg font-semibold text-gray-800">
                  SEO Meta Information
                </h3>
              }
              className="rounded-xl shadow-sm"
              headStyle={{ borderBottom: "1px solid #f3f3f3" }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="metaTitle"
                    label={
                      <span className="font-medium text-gray-700">
                        Meta Title
                      </span>
                    }
                  >
                    <Input size="large" placeholder="Home | Optionia" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="metaDescription"
                    label={
                      <span className="font-medium text-gray-700">
                        Meta Description
                      </span>
                    }
                  >
                    <Input
                      size="large"
                      placeholder="Check out Optionia"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* === CHILD PAGES === */}
          <Col xs={24}>
            <Card
              title={
                <h3 className="text-lg font-semibold text-gray-800">
                  Child Pages (Optional)
                </h3>
              }
              className="rounded-xl shadow-sm"
              headStyle={{ borderBottom: "1px solid #f3f3f3" }}
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
                  Add Page Child
                </Button>
              }
            >
              <AntForm.List name="children">
                {(fields, { remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }: any) => (
                      <div
                        key={key}
                        className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50 relative"
                      >
                        <Button
                          danger
                          type="text"
                          icon={<MinusCircleOutlined />}
                          className="absolute top-3 right-3"
                          onClick={() => remove(name)}
                        />

                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "title"]}
                              label="Child Title"
                              rules={[
                                { required: true, message: "Enter title" },
                              ]}
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
                              rules={[
                                { required: true, message: "Enter URL" },
                                {
                                  pattern: /^\/[a-zA-Z0-9-_/]+$/,
                                  message: "Must start with /child-url",
                                },
                              ]}
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
                              <Switch checkedChildren="Active" />
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
                    ))}

                    {fields.length === 0 && (
                      <p className="text-gray-500 text-sm italic text-center">
                        No child pages added yet.
                      </p>
                    )}
                  </>
                )}
              </AntForm.List>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreatePages;
