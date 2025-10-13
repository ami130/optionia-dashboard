import {
  Col,
  Input,
  Modal,
  Row,
  Form as AntForm,
  Upload,
  Card,
  DatePicker,
  Switch,
  Avatar,
  Typography,
  Divider,
} from "antd";
import { useState, useEffect } from "react";
import { Form } from "../../../common/CommonAnt";

import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { phoneValidator } from "../../../utilities/validator";
import GenderSelect, {
  ReligionSelect,
} from "../../../common/commonField/commonFeild";

import { UserOutlined } from "@ant-design/icons";
import { useGetSingleProductQuery, useUpdateProductMutation } from "../api/productEndPoints";

const { Title, Text } = Typography;

const UpdateProduct = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const { data: singleProduct } = useGetSingleProductQuery(Number(studentId));
  const [update, { isLoading, isSuccess }] = useUpdateProductMutation();
  const [form] = AntForm.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [imageFileList, setImageFileList] = useState<any>([]);

  const phoneFields = [
    "contact_phone_number",
    "phone_number",
    "mother_phone_number",
    "local_guardian_phone_number",
    "father_number",
  ];

  useEffect(() => {
    if (singleProduct) {
      const data = { ...singleProduct.data };

      Object.keys(data).forEach((key) => {
        if (data[key] === null) {
          data[key] = "";
        }
      });

      phoneFields.forEach((field) => {
        if (data[field]?.startsWith("880")) {
          data[field] = data[field].slice(3);
        }
      });

      const hasImage = typeof data.image === "string" && data.image !== "";

      const initialImages = hasImage
        ? [
            {
              uid: "-1",
              url: data.image,
              thumbUrl: data.image,
              name: "Profile Image",
            },
          ]
        : [];

      setImageFileList(initialImages);

      form.setFieldsValue({
        ...data,
        current_grade_level: data?.current_grade_level?.id || "",
        current_session: data?.current_session?.id || "",
        current_section: data?.current_section?.id || "",
        current_shift: data?.current_shift?.id || "",
        username: data?.user?.username || "",
        date_of_birth: data?.date_of_birth
          ? dayjs(data?.date_of_birth)
          : undefined,
        image: initialImages,
      });
    }

    if (isSuccess) {
      navigate("/students");
    }
  }, [form, isSuccess, navigate, singleProduct]);

  const handleImageChange = ({ fileList }: any) => {
    setImageFileList(fileList);
  };

  const handlePreview = async (file: any) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewVisible(false);

  const onFinish = (values: any) => {
    const formData: FormData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (key === "image") {
          value.forEach((file) => {
            if (file?.originFileObj && file.originFileObj instanceof File) {
              formData.append(key, file.originFileObj);
            }
          });
        } else {
          value.forEach((item) => {
            formData.append(key, item);
          });
        }
      } else if (key === "date_of_birth" && value) {
        const formattedDate = dayjs(value as any).format("YYYY-MM-DD");
        formData.append(key, formattedDate);
      } else if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (phoneFields.includes(key)) {
        formData.append(key, `880${value}`);
      } else {
        formData.append(key, value as string | Blob);
      }
    });
    update({ id: Number(studentId), data: formData });
  };

  return (
    <div className="update-student-form">
      <div className="form-header">
        <Title level={3} className="form-title">
          Update Product Information
        </Title>
        <Text type="secondary">Update the student details below</Text>
        <Divider />
      </div>

      <Form form={form} onFinish={onFinish} isLoading={isLoading}>
        <Row gutter={[24, 24]}>
          {/* Product Information Section */}
          <Col xs={24}>
            <Card
              title={<span className="section-title">Product Information</span>}
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
                      <Upload
                        listType="picture-card"
                        fileList={imageFileList}
                        onChange={handleImageChange}
                        onPreview={handlePreview}
                        showUploadList={{ showRemoveIcon: true }}
                        beforeUpload={() => false}
                      >
                        {imageFileList.length === 0 ? (
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
                        ) : null}
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
                          disabled
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
                    rules={[{ validator: phoneValidator }]}
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
                      <span className="form-label">Relation to Product</span>
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
                    label={<span className="form-label">Email</span>}
                    name="email"
                  >
                    <Input
                      placeholder="student@example.com"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
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
                    label={<span className="form-label">Date of Birth</span>}
                    name="date_of_birth"
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

export default UpdateProduct;
