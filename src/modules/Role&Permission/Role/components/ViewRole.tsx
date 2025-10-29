import { Card, Descriptions, Table, Typography, Space, Tag } from "antd";

const { Title } = Typography;

// 🎨 Permission colors
const permissionColors: Record<string, string> = {
  create: "blue",
  view: "green",
  update: "orange",
  delete: "red",
};

export default function ViewRole({ record }: { record: any }) {
  // Format date as "23 Nov, 2025"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-2">
      <Space direction="vertical" size="large" className="w-full">
        {/* Role Info */}
        <Card bordered>
          <Title level={4}>Role Information</Title>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Name">{record.name}</Descriptions.Item>
            <Descriptions.Item label="Slug">{record.slug}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {formatDate(record.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {formatDate(record.updatedAt)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Module Permissions */}
        <Card bordered>
          <Title level={4}>Module Permissions</Title>

          <Table
            dataSource={record.permissions}
            pagination={false}
            rowKey="id"
            columns={[
              {
                title: "Module Name",
                dataIndex: "name",
                key: "name",
                render: (text) => <b>{text}</b>,
              },
              {
                title: "Slug",
                dataIndex: "slug",
                key: "slug",
                render: (text) => <Tag color="blue">{text}</Tag>,
              },
              {
                title: "Permissions",
                key: "permissions",
                render: (_, module: any) => (
                  <Space wrap>
                    {module?.permissions.map((perm: any) => (
                      <Tag
                        key={perm.id}
                        color={permissionColors[perm.name.toLowerCase()] || "default"}
                      >
                        {perm.name}
                      </Tag>
                    ))}
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      </Space>
    </div>
  );
}
