import { useState, useEffect } from "react";
import { Col, Input, Row, Form as AntForm, Select, Upload, Modal, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Form } from "../../../common/CommonAnt";
import { useCreateUserMutation } from "../api/userEndPoints";
import { useGetRoleQuery } from "../../Role&Permission/Role/api/roleEndPoints";

const { Option } = Select;

const CreateUser = () => {
  const [form] = AntForm.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [createUser, { isLoading, isSuccess }] = useCreateUserMutation();
  const { data: roleData, isLoading: isRoleLoading } = useGetRoleQuery({});

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setFileList([]);
    }
  }, [isSuccess]);

  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
    setPreviewOpen(true);
  };
  const handleCancel = () => setPreviewOpen(false);
  const handleChange = ({ fileList }: any) => setFileList(fileList);
  const getFileFromList = (fileList: any[]) =>
    fileList && fileList[0]?.originFileObj ? fileList[0].originFileObj : null;

  const onFinish = async (values: any): Promise<void> => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("roleId", values.roleId);

    if (values.bio) formData.append("bio", values.bio);
    if (values.linkedinProfile) formData.append("linkedinProfile", values.linkedinProfile);

    const profileImageFile = getFileFromList(fileList);
    if (profileImageFile) formData.append("profileImage", profileImageFile);

    await createUser(formData);
  };

  return (
    <div className="p-4 ">
    
      <Form form={form} onFinish={onFinish} isLoading={isLoading} layout="vertical">
        <Row gutter={[24, 16]}>
          {/* Username */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input placeholder="Enter username" />
            </Form.Item>
          </Col>

          {/* Email */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>

          {/* Password */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          </Col>

          {/* Role */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="roleId"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select
                placeholder={isRoleLoading ? "Loading roles..." : "Select role"}
                loading={isRoleLoading}
                allowClear
              >
                {Array.isArray(roleData?.data) &&
                  roleData.data.map((role: any) => (
                    <Option key={role.id} value={role.id}>
                      {role.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Bio */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="bio"
              label="Bio"
              rules={[{ max: 120, message: "Bio cannot exceed 120 characters" }]}
            >
              <Input.TextArea placeholder="Enter short bio" rows={3} maxLength={120} />
            </Form.Item>
          </Col>

          {/* LinkedIn Profile */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="linkedinProfile"
              label="LinkedIn Profile"
              rules={[{ type: "url", message: "Enter a valid URL" }]}
            >
              <Input placeholder="https://www.linkedin.com/in/yourprofile" />
            </Form.Item>
          </Col>

          {/* Profile Image */}
          <Col xs={24} sm={12}>
            <Form.Item name="profileImage" label="Profile Image">
              <Upload
                beforeUpload={() => false}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                maxCount={1}
                accept=".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp"
              >
                {fileList.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="preview" style={{ width: "100%" }} src={previewImage} />
              </Modal>
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </div>
  );
};

export default CreateUser;
