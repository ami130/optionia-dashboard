import { Col, Input, Row, Form as AntForm } from "antd";
import { useUpdateModuleMutation } from "../api/moduleEndPoints";
import { Form } from "../../../../common/CommonAnt";
import { useEffect } from "react";

const UpdateModule = ({ record }: { record: any }) => {
  const [form] = AntForm.useForm();
  const [create, { isLoading, isSuccess }] = useUpdateModuleMutation();

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        name: record.name || "",
      });
    }
  }, [record, form]);

  const onFinish = async (values: any): Promise<void> => {
    const payload = {
      ...values,
    };

    create({ id: record?.id, data: payload });
  };

  return (
    <div className="p-6">
      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        isSuccess={isSuccess}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <Form.Item name="name" label="Name">
              <Input placeholder="Enter Name" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UpdateModule;
