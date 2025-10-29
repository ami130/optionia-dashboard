import { Col, Input, Row, Form as AntForm } from "antd";
import { useCreateModuleMutation } from "../api/moduleEndPoints";
import { Form } from "../../../../common/CommonAnt";
import { slugify } from "../../../../common/AutoGenerateSlug/AutoGenerateSlug";

const CreateModule = () => {
  const [form] = AntForm.useForm();
  const [create, { isLoading, isSuccess }] = useCreateModuleMutation();

  const onFinish = async (values: any): Promise<void> => {
    const payload = {
      ...values,
      slug: slugify(values.slug || values.name),
    };

    create(payload);
  };

  return (
    <div className="p-6">
      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        isSuccess={isSuccess}
        initialValues={{
          isActive: true,
          order: 0,
        }}
        // ✅ Auto-generate slug in real time when name changes
        onValuesChange={(changedValues) => {
          if (changedValues.name) {
            const slug = slugify(changedValues.name);
            form.setFieldsValue({ slug });
          }
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter Name" }]}
            >
              <Input placeholder="Enter Name" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="slug"
              label="Slug"
              rules={[{ required: true, message: "Please enter Slug" }]}
            >
              <Input placeholder="Enter Slug" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateModule;
