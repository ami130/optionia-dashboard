import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Form as AntForm,
  message,
  Spin,
  Upload,
  Modal,
  ColorPicker,
  Select,
} from "antd";
import {
  PlusOutlined,
  GlobalOutlined,
  PictureOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  IdcardOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Form } from "../../../common/CommonAnt";
import {
  useGetWebsiteInfoQuery,
  useUpdateWebsiteInfoMutation,
} from "../api/websiteInfoEndPoints";
import { baseUrl } from "../../../utilities/baseQuery";
import { IoIosColorPalette } from "react-icons/io";

// Configuration objects
const FORM_CONFIG = {
  brandFields: [
    {
      name: "ownerName",
      label: "Owner Name",
      icon: UserOutlined,
      required: true,
    },
    {
      name: "brandName",
      label: "Brand Name",
      icon: ShopOutlined,
      required: true,
    },
    { name: "bin", label: "BIN Number", icon: IdcardOutlined, required: false },
  ],
  logoFields: [
    {
      name: "baseLogo",
      label: "Primary Logo",
      description: "Main website logo",
    },
    {
      name: "secondaryLogo",
      label: "Secondary Logo",
      description: "Alternative logo",
    },
    {
      name: "favicon",
      label: "Favicon",
      description: "Browser tab icon (16x16px)",
    },
  ],
  colorFields: [
    {
      name: "primaryColor",
      label: "Primary Color",
      description: "Main brand color",
    },
    {
      name: "secondaryColor",
      label: "Secondary Color",
      description: "Accent color",
    },
    {
      name: "backgroundColor",
      label: "Background Color",
      description: "Page background",
    },
    {
      name: "textColor",
      label: "Text Color",
      description: "Primary text color",
    },
  ],
  contactFields: [
    {
      name: "phone",
      label: "Phone",
      icon: PhoneOutlined,
      placeholder: "+1 234 567 8900",
    },
    {
      name: "hotline",
      label: "Hotline",
      icon: PhoneOutlined,
      placeholder: "Hotline number",
    },
    {
      name: "supportEmail",
      label: "Support Email",
      icon: MailOutlined,
      placeholder: "support@company.com",
      type: "email",
    },
    {
      name: "businessAddress",
      label: "Business Address",
      icon: EnvironmentOutlined,
      placeholder: "Enter primary business address",
      textArea: true,
    },
    {
      name: "secondaryBusinessAddress",
      label: "Secondary Address",
      icon: EnvironmentOutlined,
      placeholder: "Enter secondary business address",
      textArea: true,
    },
  ],
  socialFields: [
    {
      name: "facebook",
      label: "Facebook",
      placeholder: "https://facebook.com/yourpage",
    },
    {
      name: "instagram",
      label: "Instagram",
      placeholder: "https://instagram.com/yourpage",
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      placeholder: "https://linkedin.com/company/yourpage",
    },
    {
      name: "twitter",
      label: "Twitter",
      placeholder: "https://twitter.com/yourpage",
    },
    {
      name: "secondaryLink",
      label: "Secondary Link",
      placeholder: "https://any-other-link.com",
    },
  ],
};

const COLOR_PRESETS = [
  {
    label: "Recommended",
    colors: [
      "#635bff",
      "#a855f7",
      "#111827",
      "#000000",
      "#ffffff",
      "#3B82F6",
      "#10B981",
      "#EF4444",
    ],
  },
];

export default function UpdateWebsiteInfo() {
  const [form] = AntForm.useForm();
  const {
    data: websiteInfoData,
    isLoading,
    refetch,
  } = useGetWebsiteInfoQuery<any>({});
  const [update, { isLoading: updating }] = useUpdateWebsiteInfoMutation();
  const info = websiteInfoData?.data?.[0];

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  // Initialize form data
  useEffect(() => {
    if (info) {
      setKeywords(info.metaKeywords || []);

      const formValues = { ...info };

      // Set logo file lists
      FORM_CONFIG.logoFields.forEach((field) => {
        formValues[field.name] = info[field.name]
          ? [
              {
                uid: `-${field.name}`,
                name: field.name,
                status: "done",
                url: `${baseUrl}${info[field.name]}`,
              },
            ]
          : [];
      });

      form.setFieldsValue(formValues);
    }
  }, [info, form]);

  // Handlers
  const handlePreview = (file: any) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewOpen(false);

  const getValueFromEvent = (e: any) => {
    return Array.isArray(e) ? e : e?.fileList || [];
  };

  // Fixed color handler to get hex value
  const handleColorChange = (color: any, fieldName: string) => {
    const hexColor = color.toHexString();
    form.setFieldValue(fieldName, hexColor);
  };

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData();

      // Handle image files
      FORM_CONFIG.logoFields.forEach((field) => {
        const fileList = values[field.name];
        if (fileList?.length > 0) {
          const file = fileList[0];
          if (file.originFileObj) {
            formData.append(field.name, file.originFileObj);
          } else if (file.url) {
            formData.append(field.name, file.url.replace(baseUrl, ""));
          }
        }
      });

      // Add all other fields
      const allFields = [
        ...FORM_CONFIG.brandFields,
        ...FORM_CONFIG.colorFields,
        ...FORM_CONFIG.contactFields,
        ...FORM_CONFIG.socialFields,
        { name: "metaTitle" },
        { name: "metaDescription" },
        { name: "siteName" },
      ].map((field) => field.name);

      allFields.forEach((field) => {
        if (values[field] != null) {
          // Ensure color values are properly formatted
          const value = FORM_CONFIG.colorFields.some(
            (colorField) => colorField.name === field
          )
            ? values[field]?.toHexString?.() || values[field]
            : values[field];

          formData.append(field, value);
        }
      });

      // Add metaKeywords as JSON string
      formData.append("metaKeywords", JSON.stringify(keywords));

      await update({ id: info?.id, data: formData }).unwrap();
      message.success("Website info updated successfully!");
      refetch();
    } catch (err: any) {
      console.error("Update error:", err);
      message.error(err?.data?.message || "Failed to update website info");
    }
  };

  // Reusable components
  const UploadButton = () => (
    <div className="flex flex-col items-center justify-center p-2">
      <PlusOutlined className="text-lg" />
      <div className="mt-1 text-xs">Upload</div>
    </div>
  );

  const FormSection = ({
    title,
    icon: Icon,
    children,
    gradient,
    className = "",
  }: any) => (
    <Col xs={24}>
      <Card
        title={
          <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Icon />
            {title}
          </div>
        }
        className={`rounded-2xl shadow-lg border-0 ${gradient} ${className}`}
        headStyle={{
          borderBottom: "1px solid #e2e8f0",
          padding: "20px 24px",
        }}
      >
        {children}
      </Card>
    </Col>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <GlobalOutlined className="text-blue-600" />
          Update Website Information
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your website's branding, contact details, and SEO settings
        </p>
      </div>

      <Form form={form} onFinish={onFinish} isLoading={updating}>
        <Row gutter={[24, 24]}>
          {/* Brand Information */}
          <FormSection
            title="Brand Information"
            icon={() => <ShopOutlined className="text-blue-600" />}
            gradient="bg-gradient-to-r from-blue-50 to-indigo-50"
          >
            <Row gutter={[24, 16]}>
              {FORM_CONFIG.brandFields.map(
                ({ name, label, icon: Icon, required }) => (
                  <Col xs={24} sm={12} md={8} key={name}>
                    <AntForm.Item
                      name={name}
                      label={
                        <span className="font-semibold text-gray-700 flex items-center gap-1">
                          <Icon />
                          {label}
                        </span>
                      }
                      rules={
                        required
                          ? [
                              {
                                required: true,
                                message: `Please enter ${label.toLowerCase()}`,
                              },
                            ]
                          : []
                      }
                    >
                      <Input
                        size="large"
                        placeholder={`Enter ${label.toLowerCase()}`}
                        className="rounded-lg"
                      />
                    </AntForm.Item>
                  </Col>
                )
              )}
            </Row>
          </FormSection>

          {/* Logo Uploads */}
          <FormSection
            title="Brand Assets"
            icon={() => <PictureOutlined className="text-purple-600" />}
            gradient="bg-gradient-to-r from-purple-50 to-pink-50"
          >
            <Row gutter={[24, 24]}>
              {FORM_CONFIG.logoFields.map(({ name, label, description }) => (
                <Col xs={24} sm={12} lg={8} key={name}>
                  <div className="text-center">
                    <div className="mb-3">
                      <label className="font-semibold text-gray-700 text-lg">
                        {label}
                      </label>
                      <p className="text-gray-500 text-sm">{description}</p>
                    </div>
                    <AntForm.Item
                      name={name}
                      valuePropName="fileList"
                      getValueFromEvent={getValueFromEvent}
                    >
                      <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        listType="picture-card"
                        onPreview={handlePreview}
                        showUploadList={{ showRemoveIcon: true }}
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp"
                      >
                        <UploadButton />
                      </Upload>
                    </AntForm.Item>
                  </div>
                </Col>
              ))}
            </Row>
          </FormSection>

          {/* Color Settings - FIXED */}
          <FormSection
            title="Color Settings"
            icon={() => <IoIosColorPalette className="text-pink-600" />}
            gradient="bg-gradient-to-r from-pink-50 to-rose-50"
          >
            <Row gutter={[24, 24]}>
              {FORM_CONFIG.colorFields.map(({ name, label, description }) => (
                <Col xs={24} sm={12} lg={6} key={name}>
                  <div className="text-center">
                    <label className="block font-semibold text-gray-700 mb-2">
                      {label}
                    </label>
                    <p className="text-gray-500 text-sm mb-3">{description}</p>
                    <AntForm.Item
                      name={name}
                      rules={[{ required: true, message: "Select a color" }]}
                    >
                      <ColorPicker
                        size="large"
                        showText
                        format="hex"
                        onChange={(color) => handleColorChange(color, name)}
                        className="w-full h-12 rounded-lg"
                        presets={COLOR_PRESETS}
                      />
                    </AntForm.Item>
                  </div>
                </Col>
              ))}
            </Row>
          </FormSection>

          {/* Contact Information */}
          <FormSection
            title="Contact Information"
            icon={() => <PhoneOutlined className="text-green-600" />}
            gradient="bg-gradient-to-r from-green-50 to-emerald-50"
          >
            <Row gutter={[24, 16]}>
              {FORM_CONFIG.contactFields.map(
                ({ name, label, icon: Icon, placeholder, type, textArea }) => (
                  <Col
                    xs={24}
                    sm={textArea ? 12 : 12}
                    md={textArea ? 12 : 8}
                    key={name}
                  >
                    <AntForm.Item
                      name={name}
                      label={
                        <span className="font-semibold text-gray-700 flex items-center gap-1">
                          <Icon />
                          {label}
                        </span>
                      }
                      rules={
                        type === "email"
                          ? [
                              {
                                type: "email",
                                message: "Please enter a valid email",
                              },
                            ]
                          : []
                      }
                    >
                      {textArea ? (
                        <Input.TextArea
                          rows={2}
                          placeholder={placeholder}
                          className="rounded-lg"
                        />
                      ) : (
                        <Input
                          size="large"
                          placeholder={placeholder}
                          className="rounded-lg"
                        />
                      )}
                    </AntForm.Item>
                  </Col>
                )
              )}
            </Row>
          </FormSection>

          {/* Social Media Links */}
          <FormSection
            title="Social Media Links"
            icon={() => <LinkOutlined className="text-orange-600" />}
            gradient="bg-gradient-to-r from-orange-50 to-amber-50"
          >
            <Row gutter={[24, 16]}>
              {FORM_CONFIG.socialFields.map(({ name, label, placeholder }) => (
                <Col xs={24} sm={12} key={name}>
                  <AntForm.Item
                    name={name}
                    label={
                      <span className="font-semibold text-gray-700">
                        {label}
                      </span>
                    }
                    rules={[
                      { type: "url", message: "Please enter a valid URL" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder={placeholder}
                      className="rounded-lg"
                      addonBefore={<LinkOutlined className="text-gray-400" />}
                    />
                  </AntForm.Item>
                </Col>
              ))}
            </Row>
          </FormSection>

          {/* SEO Settings - FIXED Keywords using Antd Select */}
          <FormSection
            title="SEO Meta Information"
            icon={() => <GlobalOutlined className="text-cyan-600" />}
            gradient="bg-gradient-to-r from-cyan-50 to-sky-50"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <AntForm.Item
                  name="metaTitle"
                  label={
                    <span className="font-semibold text-gray-700 text-lg">
                      Meta Title
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter meta title" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="My Website - Homepage"
                    className="rounded-lg text-lg"
                    maxLength={60}
                    showCount
                  />
                </AntForm.Item>
              </Col>

              <Col xs={24}>
                <AntForm.Item
                  name="metaDescription"
                  label={
                    <span className="font-semibold text-gray-700 text-lg">
                      Meta Description
                    </span>
                  }
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Brief description of your website for search engines..."
                    className="rounded-lg"
                    maxLength={160}
                    showCount
                  />
                </AntForm.Item>
              </Col>

              <Col xs={24}>
                <div className="mb-3">
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Meta Keywords
                  </label>

                  {/* Using Antd Select with tags mode - Much better UX */}
                  <AntForm.Item>
                    <Select
                      mode="tags"
                      size="large"
                      placeholder="Type keywords and press Enter"
                      value={keywords}
                      onChange={setKeywords}
                      className="w-full rounded-lg"
                      tokenSeparators={[",", " "]}
                      style={{ width: "100%" }}
                      options={keywords.map((keyword) => ({
                        value: keyword,
                        label: keyword,
                      }))}
                    />
                  </AntForm.Item>

                  <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-500">
                      Type keywords and press Enter. Click × to remove.
                    </p>
                    <p className="text-sm font-semibold text-blue-600">
                      {keywords.length} keywords added
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </FormSection>
        </Row>

        {/* Preview Modal */}
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
          width={600}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Form>
    </div>
  );
}
