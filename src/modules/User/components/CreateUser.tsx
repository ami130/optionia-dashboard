import { useEffect } from "react";
import { Col, Input, Row, Form as AntForm, Select, message } from "antd";
import { Form } from "../../../common/CommonAnt";
import { useCreateUserMutation } from "../api/userEndPoints";
import { useGetRoleQuery } from "../../Role&Permission/Role/api/roleEndPoints";

const { Option } = Select;

const CreateUser = () => {
  const [form] = AntForm.useForm();

  const [createUser, { isLoading, isSuccess, isError, error }] =
    useCreateUserMutation();
  const { data: roleData, isLoading: isRoleLoading } = useGetRoleQuery({});

  // 🎯 Handle success / error messages
  useEffect(() => {
    if (isSuccess) {
      message.success("User created successfully!");
      form.resetFields();
    }
    if (isError) {
      const errMsg =
        (error as any)?.data?.message || "Failed to create user. Try again.";
      message.error(errMsg);
    }
  }, [isSuccess, isError]);

  const onFinish = async (values: any): Promise<void> => {
    const payload: any = {
      username: values.username,
      email: values.email,
      password: values.password,
      roleId: values.roleId,
    };
    await createUser(payload);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        isSuccess={isSuccess}
        initialValues={{}}
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
                { min: 4, message: "Password must be at least 4 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
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

export default CreateUser;
