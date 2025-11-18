/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef } from "react";
import { Col, Form as AntForm, Row, Card, Button } from "antd";
import JoditEditor from "jodit-react";
import { defaultJoditConfig } from "../../../../config/joditConfig";

import {
  useGetSinglePrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "../api/privacyPolicyEndPoints";

const EditPrivacyPolicy: React.FC<any> = ({ record }) => {
  const [form] = AntForm.useForm();
  const editorRef = useRef(null);

  const [update] = useUpdatePrivacyPolicyMutation();
  const { data: termData } = useGetSinglePrivacyPolicyQuery<any>(1);
    console.log("first",termData)


  // Load initial content into form
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        content: record.content || "",
      });
    }
  }, [record, form]);

  const onFinish = async (values: any): Promise<void> => {
    await update({ id: 1, data: values });
  };

  return (
    <AntForm
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Card>
        <Row gutter={16}>
          <Col span={24}>
            <AntForm.Item
              label="Privacy Policy Content"
              name="content"
              rules={[{ required: true, message: "Content is required" }]}
            >
              <JoditEditor
                ref={editorRef}
                config={defaultJoditConfig}
                value={form.getFieldValue("content")}
                onChange={(newValue) => {
                  form.setFieldsValue({ content: newValue });
                }}
              />
            </AntForm.Item>
          </Col>
        </Row>

        {/* ✅ Submit Button */}
        <Row justify="end">
          <Col>
            <Button type="primary" htmlType="submit">
              Update Privacy Policy
            </Button>
          </Col>
        </Row>
      </Card>
    </AntForm>
  );
};

export default EditPrivacyPolicy;
