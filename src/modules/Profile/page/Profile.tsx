import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Image,
  Input,
  Row,
  Space,
  Tag,
  Typography,
  Upload,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import { useGetProfileQuery } from "../api/profileEndpoint";
import { avatar } from "../../../utilities/images";
import { baseUrl } from "../../../utilities/baseQuery";
import { useUpdateUserMutation } from "../../User/api/userEndPoints";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const Profile: React.FC = () => {
  const { data: profileData, isFetching, refetch } = useGetProfileQuery();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const user = profileData?.data || {};
  const { id, username, email, profileImage, role, bio, linkedinProfile } =
    user;

  useEffect(() => {
    if (user && !editMode) {
      form.setFieldsValue({
        username,
        email,
        bio,
        linkedinProfile,
      });
    }
    if (user.profileImage) {
      setFileList([
        {
          uid: "-1",
          name: "profileImage",
          status: "done",
          url: `${baseUrl}${user?.profileImage}`,
        },
      ]);
    }
  }, [user, editMode]);

  // 📷 Upload handlers
  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleCancel = () => setPreviewOpen(false);
  const handleChange = ({ fileList }: any) => setFileList(fileList);

  const getFileFromList = (fileList: any[]) =>
    fileList[0]?.originFileObj || null;

  // 🧩 Submit Update Profile
  const handleUpdateProfile = async (values: any) => {
    const formData = new FormData();

    if (values.bio) formData.append("bio", values.bio);
    if (values.linkedinProfile)
      formData.append("linkedinProfile", values.linkedinProfile);

    const profileFile = getFileFromList(fileList);
    if (profileFile) formData.append("profileImage", profileFile);

    await updateUser({ id, data: formData });
    setEditMode(false);
    refetch();
  };

  return (
    <>
      <Typography.Title level={3}>Profile</Typography.Title>
      <BreadCrumb />
      <br />

      <Row gutter={[16, 16]}>
        {/* Left Side — Profile Card */}
        <Col xs={24} md={8} lg={6}>
          <Card loading={isFetching}>
            <Space
              direction="vertical"
              style={{ width: "100%", textAlign: "center" }}
              size="middle"
            >
              <Image
                src={profileImage ? baseUrl + profileImage : avatar}
                preview={false}
                alt="Profile picture"
                width={120}
                height={120}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <Typography.Title level={4} style={{ marginBottom: 0 }}>
                {username}
              </Typography.Title>
              <Typography.Text type="secondary">{email}</Typography.Text>
              <Tag color="green">{role?.name || "User"}</Tag>

              <Space>
                <Button
                  type="primary"
                  onClick={() => setEditMode((prev) => !prev)}
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* Right Side — Details / Edit / Password */}
        <Col xs={24} md={16} lg={18}>
          <Card
            title={editMode ? "Edit Profile" : "Profile Details"}
            loading={isFetching}
          >
            {!editMode ? (
              <>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Username">
                    {username || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {email || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Role">
                    {role?.name || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bio">
                    {bio || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="LinkedIn Profile">
                    {linkedinProfile ? (
                      <a
                        href={linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {linkedinProfile}
                      </a>
                    ) : (
                      "-"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At">
                    {dayjs(user.createdAt).format("DD MMM YYYY")}
                  </Descriptions.Item>
                </Descriptions>
              </>
            ) : (
              <Form
                layout="vertical"
                form={form}
                onFinish={handleUpdateProfile}
                initialValues={{ username, email, bio, linkedinProfile }}
              >
                <Row gutter={[16, 16]}>
                  {role?.slug !== "admin" && (
                    <Col xs={12}>
                      <Form.Item label="New Password" name="password">
                        <Input.Password placeholder="********" />
                      </Form.Item>
                    </Col>
                  )}

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="LinkedIn Profile"
                      name="linkedinProfile"
                      rules={[{ type: "url", message: "Enter valid URL" }]}
                    >
                      <Input placeholder="https://linkedin.com/in/yourprofile" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item label="Bio" name="bio">
                      <Input.TextArea
                        placeholder="Write a short bio..."
                        rows={3}
                        maxLength={120}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item label="Profile Image" name="profileImage">
                      <Upload
                        beforeUpload={() => false}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        maxCount={1}
                        accept=".jpg,.jpeg,.png"
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

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={updating}
                    block
                  >
                    Save Changes
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Profile;
