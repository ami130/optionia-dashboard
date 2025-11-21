import { useState, useEffect } from "react";
import {
  Col,
  Input,
  Row,
  Form as AntForm,
  Select,
  Upload,
  Modal,
  Tag,
  message,
} from "antd";
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
  const [expertiseInput, setExpertiseInput] = useState("");
  const [expertiseTags, setExpertiseTags] = useState<string[]>([]);

  const [createUser, { isLoading, isSuccess }] = useCreateUserMutation();
  const { data: roleData, isLoading: isRoleLoading } = useGetRoleQuery({});

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setFileList([]);
      setExpertiseTags([]);
      setExpertiseInput("");
      message.success("User created successfully!");
    }
  }, [isSuccess, form]);

  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
  };

  const handleCancel = () => setPreviewOpen(false);
  const handleChange = ({ fileList }: any) => setFileList(fileList);

  const getFileFromList = (fileList: any[]) =>
    fileList && fileList[0]?.originFileObj ? fileList[0].originFileObj : null;

  // Handle expertise input
  const handleExpertiseInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExpertiseInput(e.target.value);
  };

  const handleExpertiseInputConfirm = () => {
    if (
      expertiseInput &&
      expertiseInput.trim() !== "" &&
      !expertiseTags.includes(expertiseInput.trim())
    ) {
      const newTags = [...expertiseTags, expertiseInput.trim()];
      setExpertiseTags(newTags);
      form.setFieldValue("expertise", newTags);
    }
    setExpertiseInput("");
  };

  const handleExpertiseRemove = (removedTag: string) => {
    const newTags = expertiseTags.filter((tag) => tag !== removedTag);
    setExpertiseTags(newTags);
    form.setFieldValue("expertise", newTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleExpertiseInputConfirm();
    }
  };

  const onFinish = async (values: any): Promise<void> => {
    try {
      const formData = new FormData();

      // Append basic fields
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("roleId", values.roleId);

      // Append optional fields if they exist
      if (values.bio) formData.append("bio", values.bio);
      if (values.linkedinProfile)
        formData.append("linkedinProfile", values.linkedinProfile);
      if (values.designation)
        formData.append("designation", values.designation);

      // Handle expertise - send as JSON string exactly like '["hello","react"]'
      if (
        values.expertise &&
        Array.isArray(values.expertise) &&
        values.expertise.length > 0
      ) {
        // Create the exact string format: '["hello","react"]'
        formData.append("expertise", JSON.stringify(values.expertise));

      } else {
        // Send empty array if no expertise
        formData.append("expertise", "[]");
      }

      // Handle profile image
      const profileImageFile = getFileFromList(fileList);
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      // Debug: Log FormData contents
      console.log("🔍 FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      await createUser(formData).unwrap();
    } catch (error: any) {
      console.error("❌ Error creating user:", error);
      if (error?.data?.message) {
        message.error(`Failed to create user: ${error.data.message}`);
      } else {
        message.error("Failed to create user. Please try again.");
      }
    }
  };

  return (
    <div className="p-4">
      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        layout="vertical"
      >
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

          {/* Designation */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="designation"
              label="Designation"
              rules={[
                { max: 50, message: "Designation cannot exceed 50 characters" },
              ]}
            >
              <Input placeholder="e.g., Software Engineer, Product Manager, UX Designer" />
            </Form.Item>
          </Col>

          {/* Expertise */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="expertise"
              label="Expertise"
              help="Type and press Enter to add expertise. Click on tags to remove them."
            >
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                  padding: "4px 11px",
                  minHeight: "32px",
                  background: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginBottom: expertiseTags.length > 0 ? "8px" : "0",
                  }}
                >
                  {expertiseTags.map((tag) => (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => handleExpertiseRemove(tag)}
                      style={{
                        background: "#f0f8ff",
                        border: "1px solid #1890ff",
                        borderRadius: "6px",
                        padding: "2px 8px",
                        fontSize: "12px",
                        color: "#1890ff",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
                <Input
                  type="text"
                  size="small"
                  value={expertiseInput}
                  onChange={handleExpertiseInputChange}
                  onBlur={handleExpertiseInputConfirm}
                  onKeyPress={handleKeyPress}
                  placeholder="Add expertise (press Enter to add)"
                  style={{
                    border: "none",
                    boxShadow: "none",
                    padding: "4px 0",
                    background: "transparent",
                  }}
                />
              </div>
            </Form.Item>
          </Col>

          {/* Bio */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="bio"
              label="Bio"
              rules={[
                { max: 120, message: "Bio cannot exceed 120 characters" },
              ]}
            >
              <Input.TextArea
                placeholder="Enter short bio"
                rows={3}
                maxLength={120}
                showCount
              />
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
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="preview"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateUser;
