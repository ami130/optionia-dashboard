import {
  Card,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Switch,
  Form as AntForm,
  Typography,
  Divider,
  Avatar,
  UploadProps,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { Form } from "../../../common/CommonAnt";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { phoneValidator } from "../../../utilities/validator";
import GenderSelect, {
  ReligionSelect,
} from "../../../common/commonField/commonFeild";
import { useCreateProfileSettingMutation } from "../api/profileSettingEndPoints";

const { Title, Text } = Typography;

const CreateProfileSetting = () => {
  const [form] = AntForm.useForm();
  const navigate = useNavigate();
  const [create, { isLoading, isSuccess }] = useCreateProfileSettingMutation();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);

  const handlePreview = async (file: any) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewVisible(false);

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    fileList,
    maxCount: 1,
    listType: "picture-card",
    onPreview: handlePreview,
  };

  const onFinish = (values: any): void => {
    const formData: FormData = new FormData();

    const phoneFields = [
      "contact_phone_number",
      "phone_number",
      "mother_phone_number",
      "local_guardian_phone_number",
      "father_number",
    ];

    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (key === "image") {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((file) => {
            if (file?.originFileObj && file.originFileObj instanceof File) {
              formData.append(key, file.originFileObj);
            }
          });
        }
      } else if (key === "date_of_birth") {
        formData.append(key, dayjs(value as any).format("YYYY-MM-DD"));
      } else if (phoneFields.includes(key) && value) {
        const phoneNumber = value.toString().trim();
        if (phoneNumber) {
          formData.append(key, `880${phoneNumber}`);
        }
      } else {
        formData.append(key, value as string | Blob);
      }
    });

    const user = {
      username: values.username,
      password: values.password,
    };

    formData.append("user", JSON.stringify(user));

    create(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      message.success("ProfileSetting created successfully!");
      navigate("/students");
    }
  }, [isSuccess, navigate]);

  return (
    <div className="create-student-form">
      <div className="form-header">
        <Title level={3} className="form-title">
          Create New ProfileSetting
        </Title>
        <Text type="secondary">
          Fill in all required fields to register a new student
        </Text>
        <Divider />
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        isSuccess={isSuccess}
        initialValues={{
          is_active: true,
          can_login: false,
        }}
      >
        <Row gutter={[24, 24]}>
          {/* ProfileSetting Information Section */}
          <Col xs={24}>
            <Card
              title={
                <span className="section-title">
                  ProfileSetting Information
                </span>
              }
              className="form-section-card"
              headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={8} lg={6} xl={5}>
                  <Card className="upload-card">
                    <Form.Item
                      name="image"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e?.fileList;
                      }}
                    >
                      <Upload {...uploadProps}>
                        {fileList.length >= 1 ? null : (
                          <div className="upload-placeholder">
                            <Avatar
                              size={100}
                              icon={<UserOutlined />}
                              className="avatar-upload"
                            />
                            <Text className="upload-text">
                              Click to upload photo
                            </Text>
                            <Text type="secondary">(Max 2MB)</Text>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                    <Modal
                      open={previewVisible}
                      title={previewTitle}
                      footer={null}
                      onCancel={handleCancel}
                      width={600}
                    >
                      <img
                        alt="preview"
                        style={{
                          width: "100%",
                          maxHeight: "70vh",
                          objectFit: "contain",
                        }}
                        src={previewImage}
                      />
                    </Modal>
                  </Card>
                </Col>

                <Col xs={24} md={16} lg={18} xl={19}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item<any>
                        label={<span className="form-label">First Name</span>}
                        name="first_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input first name!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="First name"
                          size="large"
                          className="form-input"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item<any>
                        label={<span className="form-label">Last Name</span>}
                        name="last_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input last name!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Last name"
                          size="large"
                          className="form-input"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                      <Form.Item<any>
                        label={<span className="form-label">Current Roll</span>}
                        name="current_roll"
                      >
                        <Input
                          placeholder="Roll number"
                          size="large"
                          className="form-input"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label={<span className="form-label">Can Login</span>}
                        name="can_login"
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                          className="form-switch"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label={<span className="form-label">Status</span>}
                        name="is_active"
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren="Active"
                          unCheckedChildren="Inactive"
                          className="form-switch"
                          defaultChecked
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Contact Information Section */}
          <Col xs={24}>
            <Card
              title={<span className="section-title">Contact Information</span>}
              className="form-section-card"
              headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item<any>
                    label={
                      <span className="form-label">Mobile No for SMS</span>
                    }
                    name="contact_phone_number"
                    rules={[
                      {
                        required: true,
                        message: "Please input mobile number!",
                      },
                      { validator: phoneValidator },
                    ]}
                  >
                    <Input
                      addonBefore="+880"
                      size="large"
                      placeholder="1XXXXXXXXX"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item<any>
                    label={
                      <span className="form-label">
                        Relation to ProfileSetting
                      </span>
                    }
                    name="contact_phone_number_relation"
                  >
                    <Input
                      placeholder="Father/Mother/Guardian"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Personal Information Section */}
          <Col xs={24}>
            <Card
              title={
                <span className="section-title">Personal Information</span>
              }
              className="form-section-card"
              headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item<any>
                    label={<span className="form-label">Date of Birth</span>}
                    name="date_of_birth"
                    rules={[
                      {
                        required: true,
                        message: "Please select date of birth!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Select date"
                      format="YYYY-MM-DD"
                      size="large"
                      className="w-full"
                      disabledDate={(current) =>
                        current && current > dayjs().endOf("day")
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <GenderSelect />
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <ReligionSelect />
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item<any>
                    label={<span className="form-label">Phone Number</span>}
                    name="phone_number"
                    rules={[{ validator: phoneValidator }]}
                  >
                    <Input
                      addonBefore="+880"
                      placeholder="1XXXXXXXXX"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item<any>
                    label={<span className="form-label">Email</span>}
                    name="email"
                    rules={[
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                  >
                    <Input
                      placeholder="student@example.com"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item<any>
                    label={<span className="form-label">Present Address</span>}
                    name="present_address"
                  >
                    <Input
                      placeholder="Current residential address"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item<any>
                    label={
                      <span className="form-label">Permanent Address</span>
                    }
                    name="permanent_address"
                  >
                    <Input
                      placeholder="Permanent home address"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Parent Information - Split into two columns on larger screens */}
          <Col xs={24} lg={12}>
            <Card
              title={<span className="section-title">Father Information</span>}
              className="form-section-card"
              headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    label={<span className="form-label">Father's Name</span>}
                    name="father_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input father's name!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Father's full name"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span className="form-label">Phone Number</span>}
                    name="father_number"
                    rules={[{ validator: phoneValidator }]}
                  >
                    <Input
                      addonBefore="+880"
                      placeholder="1XXXXXXXXX"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span className="form-label">Profession</span>}
                    name="father_profession"
                  >
                    <Input
                      placeholder="Occupation"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={<span className="section-title">Mother Information</span>}
              className="form-section-card"
              headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    label={<span className="form-label">Mother's Name</span>}
                    name="mother_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input mother's name!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Mother's full name"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span className="form-label">Phone Number</span>}
                    name="mother_phone_number"
                    rules={[{ validator: phoneValidator }]}
                  >
                    <Input
                      addonBefore="+880"
                      placeholder="1XXXXXXXXX"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={<span className="form-label">Profession</span>}
                    name="mother_profession"
                  >
                    <Input
                      placeholder="Occupation"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Local Guardian Information */}
          <Col xs={24}>
            <Card
              title={
                <span className="section-title">
                  Local Guardian Information
                </span>
              }
              className="form-section-card"
              headStyle={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item<any>
                    label={<span className="form-label">Guardian Name</span>}
                    name="local_guardian_name"
                  >
                    <Input
                      placeholder="Full name"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item<any>
                    label={<span className="form-label">Phone Number</span>}
                    name="local_guardian_phone_number"
                    rules={[{ validator: phoneValidator }]}
                  >
                    <Input
                      addonBefore="+880"
                      placeholder="1XXXXXXXXX"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item<any>
                    label={<span className="form-label">Relation</span>}
                    name="local_guardian_relation"
                  >
                    <Input
                      placeholder="Relationship to student"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateProfileSetting;
