/* eslint-disable react-hooks/rules-of-hooks */
import {
  Card,
  Row,
  Col,
  Button,
  Descriptions,
  Tag,
  Image,
  Tooltip,
  Divider,
  Space,
  Typography,
} from "antd";
import {
  EditOutlined,
  GlobalOutlined,
  PictureOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  ShopOutlined,
  IdcardOutlined,
  LinkOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import { useAppSelector } from "../../../app/store";
import { FilterState } from "../../../app/features/filterSlice";
import { useDispatch } from "react-redux";
import { useGetWebsiteInfoQuery } from "../api/websiteInfoEndPoints";
import { baseUrl } from "../../../utilities/baseQuery";
import { showModal } from "../../../app/features/modalSlice";
import UpdateWebsiteInfo from "../components/UpdateWebsiteInfo";

const { Text, Title } = Typography;

const WebsiteInfoPage = () => {
  const dispatch = useDispatch();
  const { page_size, page } = useAppSelector(FilterState);

  const { data: websiteInfoData, isLoading } = useGetWebsiteInfoQuery<any>({
    page_size: page_size,
    page: Number(page) || undefined,
  });

  const info = websiteInfoData?.data?.[0];

  // Color display component
  const ColorDisplay = ({ color, label }: { color: string; label: string }) => (
    <Tooltip title={color}>
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100">
        <div
          className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-md flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">{label}</span>
          <span className="text-xs text-gray-500 font-mono font-medium">
            {color}
          </span>
        </div>
      </div>
    </Tooltip>
  );

  // Logo display component
  const LogoDisplay = ({
    src,
    alt,
    size,
    label,
  }: {
    src: string;
    alt: string;
    size: string;
    label: string;
  }) => (
    <div className="text-center group">
      <div
        className={`${size} bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm overflow-hidden group-hover:shadow-md transition-all duration-300`}
      >
        <Image
          src={`${baseUrl}${src}`}
          alt={alt}
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          preview={{
            mask: (
              <div className="flex items-center gap-1 text-xs text-white">
                <PictureOutlined />
                Preview
              </div>
            ),
          }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </div>
  );

  // Contact Info Item
  const ContactItem = ({ icon, label, value, copyable = false }: any) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
      <div className="text-blue-600 text-lg mt-1 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <Text className="text-sm font-semibold text-gray-600 block mb-1">
          {label}
        </Text>
        {copyable ? (
          <Text copyable className="text-gray-800 font-medium block truncate">
            {value}
          </Text>
        ) : (
          <Text className="text-gray-800 font-medium block truncate">
            {value}
          </Text>
        )}
      </div>
    </div>
  );

  // Social Media Item
  const SocialItem = ({ platform, url, icon }: any) => (
    <Tooltip title={url}>
      <Button
        type="text"
        icon={icon}
        className="flex items-center gap-2 p-3 h-auto rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        onClick={() => window.open(url, "_blank")}
      >
        <span className="text-sm font-medium text-gray-700">{platform}</span>
      </Button>
    </Tooltip>
  );

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <BreadCrumb />
          <div className="flex items-center gap-3 mt-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <GlobalOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Website Information
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage your website's branding, contact details, and SEO
                settings
              </p>
            </div>
          </div>
        </div>

        <Tooltip title="Edit website information">
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 sm:px-6 py-2 sm:py-3 h-auto rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            size="large"
            onClick={() =>
              dispatch(
                showModal({
                  title: "",
                  content: <UpdateWebsiteInfo />,
                })
              )
            }
          >
            Update Information
          </Button>
        </Tooltip>
      </div>

      {/* Main Card */}
      <Card
        loading={isLoading}
        className="shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm"
        bodyStyle={{ padding: 0 }}
      >
        {info ? (
          <div className="p-4 sm:p-6 md:p-8">
            {/* Brand Overview */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} sm={8} md={6}>
                  <div className="flex justify-between">
                    <Image
                      src={`${baseUrl}${info.baseLogo}`}
                      alt="Brand Logo"
                      className="rounded-2xl shadow-lg"
                      width={120}
                      height={120}
                      preview
                    />
                  </div>
                </Col>
                <Col xs={24} sm={16} md={18}>
                  <Space direction="vertical" size="small" className="w-full ">
                    <div className="flex flex-wrap items-center justify-end  gap-3">
                      <Title level={2} className="!mb-0 !text-gray-900">
                        {info.brandName}
                      </Title>
                      <Tag
                        color="green"
                        className="text-sm font-semibold px-3 py-1 rounded-full"
                      >
                        Live
                      </Tag>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      <Tag
                        icon={<UserOutlined />}
                        color="blue"
                        className="text-sm px-3 py-1 rounded-full"
                      >
                        Owner: {info.ownerName}
                      </Tag>
                      <Tag
                        icon={<IdcardOutlined />}
                        color="orange"
                        className="text-sm px-3 py-1 rounded-full"
                      >
                        BIN: {info.bin}
                      </Tag>
                    </div>
                  </Space>
                </Col>
              </Row>
            </div>

            <Row gutter={[24, 24]}>
              {/* Left Section - Visual Assets & Contact */}
              <Col xs={24} lg={10}>
                <Space direction="vertical" size={24} className="w-full">
                  {/* Brand Assets */}
                  <Card
                    className="shadow-lg rounded-2xl border-0 h-full"
                    title={
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <PictureOutlined className="text-purple-600" />
                        Brand Assets
                      </div>
                    }
                    bodyStyle={{ padding: "20px" }}
                  >
                    <div className="space-y-8">
                      <LogoDisplay
                        src={info.baseLogo}
                        alt="Base Logo"
                        size="w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
                        label="Primary Logo"
                      />

                      <Divider className="my-4" />

                      <LogoDisplay
                        src={info.secondaryLogo}
                        alt="Secondary Logo"
                        size="w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-40 md:h-40"
                        label="Secondary Logo"
                      />

                      <Divider className="my-4" />

                      <LogoDisplay
                        src={info.favicon}
                        alt="Favicon"
                        size="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20"
                        label="Favicon"
                      />
                    </div>
                  </Card>

                  {/* Contact Information */}
                  <Card
                    className="shadow-lg rounded-2xl border-0"
                    title={
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <PhoneOutlined className="text-green-600" />
                        Contact Information
                      </div>
                    }
                    bodyStyle={{ padding: "20px" }}
                  >
                    <Space direction="vertical" size={12} className="w-full">
                      <ContactItem
                        icon={<PhoneOutlined />}
                        label="Phone"
                        value={info.phone}
                        copyable
                      />
                      <ContactItem
                        icon={<PhoneOutlined />}
                        label="Hotline"
                        value={info.hotline}
                        copyable
                      />
                      <ContactItem
                        icon={<MailOutlined />}
                        label="Support Email"
                        value={info.supportEmail}
                        copyable
                      />
                      <ContactItem
                        icon={<EnvironmentOutlined />}
                        label="Business Address"
                        value={info.businessAddress}
                      />
                      <ContactItem
                        icon={<EnvironmentOutlined />}
                        label="Secondary Address"
                        value={info.secondaryBusinessAddress}
                      />
                    </Space>
                  </Card>
                </Space>
              </Col>

              {/* Right Section - Colors, SEO & Social */}
              <Col xs={24} lg={14}>
                <Space direction="vertical" size={24} className="w-full">
                  {/* Color Palette */}
                  <Card
                    className="shadow-lg rounded-2xl border-0"
                    title={
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <PictureOutlined className="text-pink-600" />
                        Color Palette
                      </div>
                    }
                    bodyStyle={{ padding: "20px" }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <ColorDisplay
                          color={info.primaryColor}
                          label="Primary Color"
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <ColorDisplay
                          color={info.secondaryColor}
                          label="Secondary Color"
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <ColorDisplay
                          color={info.backgroundColor}
                          label="Background Color"
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <ColorDisplay
                          color={info.textColor}
                          label="Text Color"
                        />
                      </Col>
                    </Row>
                  </Card>

                  {/* SEO Information */}
                  <Card
                    className="shadow-lg rounded-2xl border-0"
                    title={
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <GlobalOutlined className="text-blue-600" />
                        SEO Configuration
                        <Tooltip title="This information affects search engine visibility">
                          <InfoCircleOutlined className="text-gray-400 cursor-help" />
                        </Tooltip>
                      </div>
                    }
                    bodyStyle={{ padding: "20px" }}
                  >
                    <Descriptions
                      column={1}
                      bordered
                      labelStyle={{
                        fontWeight: 600,
                        backgroundColor: "#f8fafc",
                        width: "140px",
                        fontSize: "13px",
                        padding: "12px 16px",
                      }}
                      contentStyle={{
                        color: "#1f2937",
                        backgroundColor: "white",
                        fontSize: "14px",
                        padding: "12px 16px",
                      }}
                      size="middle"
                    >
                      <Descriptions.Item label="Meta Title">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Tag
                              color="blue"
                              className="text-sm py-1 px-3 rounded-full"
                            >
                              {info.metaTitle?.length || 0} chars
                            </Tag>
                          </div>
                          <Text className="text-gray-800 font-medium">
                            {info.metaTitle}
                          </Text>
                        </div>
                      </Descriptions.Item>

                      <Descriptions.Item label="Meta Description">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Tag
                              color={
                                info.metaDescription?.length <= 160
                                  ? "green"
                                  : "orange"
                              }
                              className="text-sm py-1 px-3 rounded-full"
                            >
                              {info.metaDescription?.length || 0} chars
                            </Tag>
                            {info.metaDescription?.length > 160 && (
                              <Text
                                type="warning"
                                className="text-sm font-medium"
                              >
                                Too long for SEO
                              </Text>
                            )}
                          </div>
                          <Text className="text-gray-700">
                            {info.metaDescription}
                          </Text>
                        </div>
                      </Descriptions.Item>

                      <Descriptions.Item label="Meta Keywords">
                        {info.metaKeywords?.length ? (
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                              {info.metaKeywords.map(
                                (keyword: string, index: number) => (
                                  <Tag
                                    key={index}
                                    color="purple"
                                    className="text-sm py-1 px-3 rounded-full border-0 shadow-sm"
                                  >
                                    {keyword}
                                  </Tag>
                                )
                              )}
                            </div>
                            <Text className="text-gray-500 text-sm">
                              {info.metaKeywords.length} keywords configured
                            </Text>
                          </div>
                        ) : (
                          <Tag
                            color="orange"
                            icon={<InfoCircleOutlined />}
                            className="text-sm py-1 px-3"
                          >
                            Not Configured
                          </Tag>
                        )}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  {/* Social Media Links */}
                  <Card
                    className="shadow-lg rounded-2xl border-0"
                    title={
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <LinkOutlined className="text-green-600" />
                        Social Media Links
                      </div>
                    }
                    bodyStyle={{ padding: "20px" }}
                  >
                    <Row gutter={[12, 12]}>
                      <Col xs={24} sm={12}>
                        <SocialItem
                          platform="Facebook"
                          url={info.facebook}
                          icon={<FacebookOutlined className="text-blue-600" />}
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <SocialItem
                          platform="Instagram"
                          url={info.instagram}
                          icon={<InstagramOutlined className="text-pink-600" />}
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <SocialItem
                          platform="LinkedIn"
                          url={info.linkedin}
                          icon={<LinkedinOutlined className="text-blue-700" />}
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <SocialItem
                          platform="Twitter"
                          url={info.twitter}
                          icon={<TwitterOutlined className="text-sky-500" />}
                        />
                      </Col>
                      <Col xs={24}>
                        <SocialItem
                          platform="Secondary Link"
                          url={info.secondaryLink}
                          icon={<LinkOutlined className="text-gray-600" />}
                        />
                      </Col>
                    </Row>
                  </Card>

                  {/* Timestamps */}
                  <Card
                    className="shadow-lg rounded-2xl border-0"
                    title={
                      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <InfoCircleOutlined className="text-gray-600" />
                        System Information
                      </div>
                    }
                    bodyStyle={{ padding: "20px" }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Text className="text-sm font-semibold text-gray-600 block">
                            Created
                          </Text>
                          <Text className="text-gray-800 font-medium">
                            {new Date(info.createdAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Text className="text-sm font-semibold text-gray-600 block">
                            Last Updated
                          </Text>
                          <Text className="text-gray-800 font-medium">
                            {new Date(info.updatedAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Space>
              </Col>
            </Row>
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-16 px-4">
              <div className="text-6xl mb-4">🎨</div>
              <Title level={3} className="text-gray-800 mb-3">
                No Website Information Found
              </Title>
              <Text className="text-gray-600 max-w-md mx-auto mb-6 block">
                Start by setting up your website's branding, colors, and SEO
                information.
              </Text>
              <Button
                type="primary"
                size="large"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 h-auto rounded-xl font-semibold"
                icon={<EditOutlined />}
                onClick={() =>
                  dispatch(
                    showModal({
                      title: "Update Website Information",
                      content: <UpdateWebsiteInfo />,
                    })
                  )
                }
              >
                Configure Website
              </Button>
            </div>
          )
        )}
      </Card>
    </div>
  );
};

export default WebsiteInfoPage;
