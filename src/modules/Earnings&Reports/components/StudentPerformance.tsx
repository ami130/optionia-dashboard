import { Card, Typography, Tag, Progress } from "antd";
import { TrophyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ExcellentPerformance = () => {
  return (
    <Card
      bordered={false}
      className="text-center p-4 shadow-lg rounded-lg bg-gradient-to-r from-teal-500 to-teal-700"
      style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <TrophyOutlined style={{ fontSize: "48px", color: "#fff" }} />
      <Title level={3} style={{ color: "#fff", marginTop: "10px" }}>
        Excellent Performance
      </Title>
      <Text style={{ color: "#fff", fontSize: "14px" }}>
        Congratulations on your outstanding performance! Keep up the great work!
      </Text>
      <div style={{ marginTop: "15px" }}>
        <Tag color="green" style={{ fontSize: "12px", fontWeight: "bold" }}>
          Outstanding
        </Tag>
      </div>

      {/* Improvement Section */}
      <div style={{ marginTop: "10px" }}>
        <Title level={5} style={{ color: "#fff" }}>
          Improvement: 15%
        </Title>
        <Progress
          percent={15}
          status="active"
          strokeColor="#ABE5A1"
          showInfo={false}
          style={{ marginBottom: "10px" }}
        />
        <Text style={{ color: "#fff", fontSize: "12px" }}>
          You have shown significant improvement compared to the previous
          evaluation.
        </Text>
      </div>
    </Card>
  );
};

export default ExcellentPerformance;
