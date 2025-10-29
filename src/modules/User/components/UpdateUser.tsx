import { Col, Input, Row, Form as AntForm, Select, message } from "antd";
import { useEffect } from "react";
import { Form } from "../../../common/CommonAnt";
import { useUpdateUserMutation } from "../api/userEndPoints";
import { useGetRoleQuery } from "../../Role&Permission/Role/api/roleEndPoints";

const { Option } = Select;

const UpdateUser = ({ record }: { record: any }) => {
  const [form] = AntForm.useForm();

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();
  const { data: roleData, isLoading: isRoleLoading } = useGetRoleQuery({});

  // ✅ Prefill user data
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        username: record.username || "",
        email: record.email || "",
        roleId: record.role?.id || "",
      });
    }
  }, [record, form]);

  // // ✅ Handle success / error feedback
  // useEffect(() => {
  //   if (isSuccess) {
  //     message.success("User updated successfully!");
  //   }
  //   if (isError) {
  //     const errMsg = (error as any)?.data?.message || "Failed to update user.";
  //     message.error(errMsg);
  //   }
  // }, [isSuccess, isError]);

  // ✅ Submit handler
  const onFinish = async (values: any): Promise<void> => {
    const payload = {
      username: values.username,
      email: values.email,
      roleId: values.roleId,
    };
    await updateUser({ id: record?.id, data: payload });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        isSuccess={isSuccess}
      >
        <Row gutter={[24, 24]}>
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
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>

          {/* Role Dropdown */}
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
                  roleData?.data?.map((role: any) => (
                    <Option key={role.id} value={role.id}>
                      {role.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UpdateUser;
