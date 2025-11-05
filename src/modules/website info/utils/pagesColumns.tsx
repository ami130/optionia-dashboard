import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

const usePagesColumns = (): ColumnsType<any> => {
  return [
    {
      key: "0",
      title: "SL",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      key: "1",
      title: "Title",
      dataIndex: "title",
      align: "left",
    },
    {
      key: "2",
      title: "URL",
      dataIndex: "url",
      align: "center",
    },
    {
      key: "3",
      title: "Type",
      dataIndex: "type",
      align: "center",
    },
    {
      key: "4",
      title: "Order",
      dataIndex: "order",
      align: "center",
    },
    {
      key: "6",
      title: "Active",
      dataIndex: "isActive",
      align: "center",
      width: 100,
      render: (is_active) =>
        is_active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
  ];
};

export default usePagesColumns;
