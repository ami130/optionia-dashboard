import { Link, useParams } from "react-router-dom";
import { useGetSingleAdmissionQuery } from "../api/admissionEndPoints";
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Descriptions,
  Divider,
  Spin,
  Avatar,
  Badge,
  Statistic,
  Space,
  Collapse,
  Tabs,
  Grid,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  IdcardOutlined,
  BookOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import BreadCrumb from "../../../../common/BreadCrumb/BreadCrumb";
import { capitalize } from "../../../../common/capitalize/Capitalize";
import dayjs from "dayjs";
import { FaRegEdit } from "react-icons/fa";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const AdmissionView = () => {
  const { admissionId } = useParams();
  const { data: singleAdmissionData, isLoading } =
    useGetSingleAdmissionQuery<any>(Number(admissionId));
  const screens = useBreakpoint();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  const singleAdmission = singleAdmissionData?.data;

  if (!singleAdmission || !("id" in singleAdmission)) {
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        Error: Admission data not found
      </div>
    );
  }

  const {
    student,
    subjects = [],
    admission_date,
    fee_type,
    previous_registration_number,
    roll,
    session,
    grade_level,
    shift,
    section,
    status,
    attendance_percent,
    total_present,
    optional_subject,
    total_absent,
  } = singleAdmission;

  // Get financial data from the first admission record
  const admissionData = student?.admissions?.[0] || {};
  const actualPaidAmount = admissionData.total_paid_amount || 0;
  const actualDueAmount = admissionData.due_amount || 0;
  const actualMonthlyFee = admissionData.monthly_fee || 0;
  const actualOneTimeFee = admissionData.one_time_fee || 0;

  // Then use these actual values in your components
  const subjectColumns = [
    {
      title: "Subject",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          {optional_subject?.id === record.id && (
            <Tag color="gold" icon={<StarOutlined />}>
              Optional
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Group Type",
      dataIndex: "group_type_display",
      key: "group_type_display",
      render: (text: string) => {
        let color = "";
        switch (text?.toLowerCase()) {
          case "general":
            color = "blue";
            break;
          case "commerce":
            color = "green";
            break;
          case "science":
            color = "purple";
            break;
          case "arts":
            color = "orange";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: { id: any }) => (
        <Badge
          status={optional_subject?.id === record.id ? "processing" : "success"}
          text={optional_subject?.id === record.id ? "Optional" : "Active"}
        />
      ),
    },
  ];
  const formattedFee = (amount: number | string | undefined | null) => {
    const numAmount = Number(amount) || 0;
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  const getStatusTag = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Approved
          </Tag>
        );
      case "pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            Pending
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const feeColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => formattedFee(amount),
    },
    {
      title: "One-Time",
      dataIndex: "one_time",
      key: "one_time",
      render: (oneTime: boolean) =>
        oneTime ? <Tag color="green">Yes</Tag> : <Tag color="blue">No</Tag>,
    },
    {
      title: "Effective From",
      dataIndex: "effective_from",
      key: "effective_from",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) =>
        active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
  ];

  const paymentParticularColumns = [
    {
      title: "Particular",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: formattedFee,
    },
    {
      title: "Paid",
      dataIndex: "paid_amount",
      key: "paid_amount",
      render: formattedFee,
    },
    {
      title: "Due",
      dataIndex: "due_amount",
      key: "due_amount",
      render: formattedFee,
    },
    {
      title: "Due Month",
      dataIndex: "due_month",
      key: "due_month",
      render: (date: string) => {
        return date ? dayjs(date).format("DD MMM YYYY") : "-";
      },
    },
  ];

  // Responsive layout configurations
  const summaryCardColSpan = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6,
    xxl: 6,
  };

  const mainContentColSpan = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 16,
    xl: 16,
    xxl: 16,
  };

  const profileColSpan = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 8,
    xl: 8,
    xxl: 8,
  };

  const statisticColSpan = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 12,
  };

  const attendanceColSpan = {
    xs: 24,
    sm: 8,
    md: 8,
    lg: 8,
    xl: 8,
    xxl: 8,
  };

  const descriptionColumn = {
    xs: 1,
    sm: 1,
    md: 1,
    lg: 2,
    xl: 2,
    xxl: 2,
  };

  return (
    <div
      className="admission-view-container"
      style={{ padding: screens.xs ? "8px" : "24px" }}
    >
      <div className="page-header">
        <BreadCrumb />
        <Title
          level={screens.xs ? 4 : screens.sm ? 3 : 2}
          className="page-title"
          style={{
            marginTop: screens.xs ? "8px" : "16px",
            marginBottom: screens.xs ? "16px" : "24px",
          }}
        >
          Admission Details
        </Title>
      </div>

      <div className="admission-content">
        {/* Summary Cards Row */}
        <Row gutter={[16, 16]} className="summary-cards">
          <Col {...summaryCardColSpan}>
            <Card className="summary-card" hoverable>
              <Statistic
                title="Admission Date"
                value={admission_date}
                prefix={<CalendarOutlined />}
                valueStyle={{ fontSize: screens.xs ? 14 : 16 }}
              />
            </Card>
          </Col>
          <Col {...summaryCardColSpan}>
            <Card className="summary-card" hoverable>
              <Statistic
                title="User ID"
                value={student?.user?.username}
                prefix={<IdcardOutlined />}
                valueStyle={{ fontSize: screens.xs ? 14 : 16 }}
              />
            </Card>
          </Col>
          <Col {...summaryCardColSpan}>
            <Card className="summary-card" hoverable>
              <Statistic
                title="One-Time Fee"
                value={formattedFee(actualOneTimeFee)}
                prefix={<DollarOutlined />}
                valueStyle={{
                  fontSize: screens.xs ? 14 : 16,
                  color: "#3f8600",
                }}
              />
            </Card>
          </Col>
          <Col {...summaryCardColSpan}>
            <Card className="summary-card" hoverable>
              <Statistic
                title="Monthly Fee"
                value={formattedFee(actualMonthlyFee)}
                prefix={<DollarOutlined />}
                valueStyle={{
                  fontSize: screens.xs ? 14 : 16,
                  color: "#cf1322",
                }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} className="main-content">
          {/* Left Column */}
          <Col {...mainContentColSpan}>
            <Tabs defaultActiveKey="1" className="detail-tabs">
              <TabPane tab="Admission Information" key="1">
                <Card className="detail-card">
                  <Descriptions
                    bordered
                    column={descriptionColumn}
                    size={screens.xs ? "small" : "middle"}
                    labelStyle={{ fontWeight: 600 }}
                  >
                    <Descriptions.Item label="Fee Type">
                      <Tag color={fee_type === "class" ? "geekblue" : "purple"}>
                        {capitalize(fee_type)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Previous Registration">
                      {previous_registration_number || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Session">
                      <Text strong>{session?.name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Class">
                      <Text strong>{grade_level}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Section">
                      <Text strong>{section?.name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Shift">
                      <Text strong>{shift?.name}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Roll Number">
                      <Text strong>{roll}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      {getStatusTag(status)}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card title="Financial Summary" className="detail-card">
                  <Row gutter={16}>
                    <Col {...statisticColSpan}>
                      <Statistic
                        title="Total Due"
                        value={formattedFee(actualDueAmount)}
                        valueStyle={{ color: "#cf1322" }}
                      />
                    </Col>
                    <Col {...statisticColSpan}>
                      <Statistic
                        title="Total Paid"
                        value={formattedFee(actualPaidAmount)}
                        valueStyle={{ color: "#3f8600" }}
                      />
                    </Col>
                  </Row>
                </Card>

                <Card title="Attendance Summary" className="detail-card">
                  <Row gutter={16}>
                    <Col {...attendanceColSpan}>
                      <Statistic
                        title="Attendance %"
                        value={attendance_percent}
                        suffix="%"
                      />
                    </Col>
                    <Col {...attendanceColSpan}>
                      <Statistic title="Present" value={total_present} />
                    </Col>
                    <Col {...attendanceColSpan}>
                      <Statistic title="Absent" value={total_absent} />
                    </Col>
                  </Row>
                </Card>
              </TabPane>

              <TabPane tab="Subjects" key="2">
                <Card
                  className="detail-card"
                  title={
                    <Space>
                      <BookOutlined />
                      <Text strong>Subjects</Text>
                      {optional_subject && (
                        <Text type="secondary" style={{ fontSize: 14 }}>
                          (Optional: {optional_subject.name})
                        </Text>
                      )}
                    </Space>
                  }
                >
                  <Table
                    dataSource={subjects}
                    columns={subjectColumns}
                    rowKey="id"
                    pagination={false}
                    bordered
                    size={screens.xs ? "small" : "middle"}
                    scroll={screens.xs ? { x: true } : undefined}
                    rowClassName={(record) =>
                      optional_subject?.id === record.id
                        ? "optional-subject-row"
                        : ""
                    }
                  />
                </Card>
              </TabPane>
            </Tabs>
          </Col>

          {/* Right Column - Student Profile */}
          <Col {...profileColSpan}>
            <Card className="profile-card">
              <Link to={`/students/update/${student?.id}`}>
                <FaRegEdit className="text-blue-500 cursor-pointer hover:scale-110 transition-transform duration-200" />
              </Link>
              <div className="profile-header" style={{ textAlign: "center" }}>
                <Avatar
                  size={screens.xs ? 64 : 80}
                  icon={<UserOutlined />}
                  src={student?.image}
                  className="profile-avatar"
                />
                <Title
                  level={screens.xs ? 5 : 4}
                  className="profile-name"
                  style={{ marginTop: screens.xs ? "8px" : "16px" }}
                >
                  {student?.first_name} {student?.last_name}
                </Title>
                <Text type="secondary" className="profile-role">
                  {student?.user?.role?.name}
                </Text>
              </div>

              <Divider />

              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={
                    <Space>
                      <MailOutlined /> Email
                    </Space>
                  }
                >
                  <Text>{student?.email || "-"}</Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <PhoneOutlined /> Phone
                    </Space>
                  }
                >
                  <Text>{student?.contact_phone_number || "-"}</Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <BookOutlined /> Gender
                    </Space>
                  }
                >
                  <Text>{student?.gender || "-"}</Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <CalendarOutlined /> Date of Birth
                    </Space>
                  }
                >
                  <Text>{student?.date_of_birth || "-"}</Text>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              {/* <Title
                level={screens.xs ? 5 : 5}
                className="section-title"
                style={{ marginBottom: "16px" }}
              >
                <BankOutlined /> Institution Details
              </Title>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">
                  <Text>{student?.user?.role?.institution?.name || "-"}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  <Text>{student?.user?.role?.institution?.city || "-"}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Contact Email">
                  <Text>
                    {student?.user?.role?.institution?.contact_email || "-"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {student?.user?.role?.institution?.is_active ? (
                    <Tag color="green">Active</Tag>
                  ) : (
                    <Tag color="red">Inactive</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions> */}

              <Divider />

              <Title
                level={screens.xs ? 5 : 5}
                className="section-title"
                style={{ marginBottom: "16px" }}
              >
                Parent Information
              </Title>
              <Collapse ghost>
                <Panel header="Father's Details" key="1">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">
                      <Text>{student?.father_name || "-"}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      <Text>{student?.father_number || "-"}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Profession">
                      <Text>{student?.father_profession || "-"}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Panel>
                <Panel header="Mother's Details" key="2">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">
                      <Text>{student?.mother_name || "-"}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      <Text>{student?.mother_phone_number || "-"}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Profession">
                      <Text>{student?.mother_profession || "-"}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Panel>
              </Collapse>
            </Card>
          </Col>
        </Row>

        <Divider orientation="left">Fee Details</Divider>
        <Table
          columns={feeColumns}
          dataSource={singleAdmission?.fees || []}
          rowKey="id"
          pagination={false}
          bordered
          style={{ marginBottom: 32 }}
        />

        <Divider orientation="left">Payment History</Divider>
        <Collapse accordion>
          {(singleAdmission?.payments || []).map((payment: any) => (
            <Panel
              header={
                <Space>
                  <Text strong>{dayjs(payment.month).format("MMM")}</Text>
                  <Tag color={payment.status === "pending" ? "orange" : "blue"}>
                    {capitalize(payment.status)}
                  </Tag>
                  <Text>Total: {formattedFee(payment.total_amount)}</Text>
                  <Text type="success">
                    Paid: {formattedFee(payment.total_paid)}
                  </Text>
                  <Text type="danger">
                    Due: {formattedFee(payment.total_due)}
                  </Text>
                </Space>
              }
              key={payment.id}
            >
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Payment Date">
                  {dayjs(payment.payment_date).format("DD MMM YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Net Amount">
                  {formattedFee(payment.net_amount)}
                </Descriptions.Item>
                <Descriptions.Item label="Discount">
                  {formattedFee(payment.total_discount)}
                </Descriptions.Item>
              </Descriptions>
              <Divider dashed />
              <Text strong>Particulars</Text>
              <Table
                columns={paymentParticularColumns}
                dataSource={payment.particulars || []}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default AdmissionView;
