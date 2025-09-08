import {
  Card,
  Col,
  Row,
  Select,
  Form as AntForm,
  InputNumber,
  Table,
  Typography,
  message,
  Tooltip,
} from "antd";
import { useState, useEffect } from "react";
import { useGetExamQuery } from "../../api/examEndPoints";
import { Form } from "../../../../../common/CommonAnt";
import {
  useCreateExamMarkMutation,
  useGetSingleExamMarksQuery,
} from "../api/markExamEndPoints";
import { useGetDashboardDataQuery } from "../../../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../../utilities/permissionConstant";
import NoPermissionData from "../../../../../utilities/NoPermissionData";
import { useGetClassesQuery } from "../../../classes/api/classesEndPoints";
import { useGetSectionQuery } from "../../../Section/api/sectionEndPoints";
import { useGetShiftQuery } from "../../../shift/api/shiftEndPoints";
import { skipToken } from "@reduxjs/toolkit/query";
import { IClasses } from "../../../classes/type/classesType";
import { BiLock } from "react-icons/bi";

const { Title } = Typography;

// Add this utility function at the top of your file
// Update the getSubjectColor function at the top of your file
const getSubjectColor = (subjectId: any) => {
  // Convert subjectId to string if it isn't already
  const idStr = subjectId?.toString() || "default";

  // Consistent hash function to generate the same color for each subject
  const hash = idStr.split("").reduce((acc: any, char: any) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const colors = [
    "#FF5252", // Vibrant red
    "#FF9800", // Orange
    "#4f2550", // Bright yellow
    "#4CAF50", // Green
    "#2196F3", // Blue
    "#3F51B5", // Indigo
    "#9C27B0", // Purple
    "#E91E63", // Pink
    "#00BCD4", // Cyan
    "#8BC34A", // Light green
    "#FF5722", // Deep orange
    "#673AB7", // Deep purple
  ];

  return colors[Math.abs(hash) % colors.length];
};

const MarkExamPage = () => {
  const [form] = AntForm.useForm();
  const exam = AntForm.useWatch("exam", form);
  const { data: dashboardData } = useGetDashboardDataQuery({});

  const shift = AntForm.useWatch("shift", form);
  const gradeLevel = AntForm.useWatch("grade_level", form);
  const section = AntForm.useWatch("section", form);

  const { data: classData } = useGetClassesQuery({});
  const { data: sectionData } = useGetSectionQuery(
    { grade_level: gradeLevel },
    { skip: !gradeLevel }
  );

  const { data: shiftData } = useGetShiftQuery({});

  const createPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.exammark,
    actionNames.add
  );

  const [create, { isLoading, isSuccess }] = useCreateExamMarkMutation();
  const { data: examData } = useGetExamQuery({});

  const { data: examDetails } = useGetSingleExamMarksQuery<any>(
    exam
      ? { roleId: Number(exam), shift, grade_level: gradeLevel, section }
      : skipToken
  );

  const [studentData, setStudentData] = useState<{
    [key: string]: { mcq?: number; written?: number; comment?: string };
  }>({});

  // Get all unique subjects across all students
  const getAllSubjects = () => {
    const subjects = new Map();
    examDetails?.data?.records?.forEach((student: any) => {
      student?.subjects?.forEach((subject: any) => {
        if (!subjects.has(subject.id)) {
          subjects.set(subject.id, subject);
        }
      });
    });
    return Array.from(subjects.values());
  };

  useEffect(() => {
    if (examDetails?.data?.records) {
      const initialData: { [key: string]: any } = {};

      examDetails?.data?.records?.forEach((student: any) => {
        student?.subjects?.forEach((subject: any) => {
          initialData[`${student.id}-${subject.id}`] = {
            mcq: subject.mcq_marks_obtained || 0,
            written: subject.written_marks_obtained || 0,
            comment: subject.comment || "",
          };
        });
      });

      setStudentData(initialData);
    }
  }, [examDetails]);

  const handleInputChange = (
    studentId: string,
    subjectId: string,
    field: "mcq" | "written" | "comment",
    value: any
  ) => {
    if (field === "mcq" && value !== null) {
      value = Math.round(Number(value));
    }

    setStudentData((prevData) => ({
      ...prevData,
      [`${studentId}-${subjectId}`]: {
        ...prevData[`${studentId}-${subjectId}`],
        [field]: value,
      },
    }));
  };

  const onFinish = (values: any): void => {
    const formattedResults = Object.entries(studentData).map(([key, value]) => {
      const [studentId, subjectId] = key.split("-");
      return {
        exam: values.exam,
        admission: Number(studentId),
        subject: Number(subjectId),
        mcq_marks_obtained: value.mcq !== undefined ? Number(value.mcq) : 0,
        written_marks_obtained:
          value.written !== undefined ? Number(value.written) : 0,
        comment: value.comment || "",
      };
    });

    create(formattedResults)
      .unwrap()
      .then(() => message.success("Marks submitted successfully!"))
      .catch((error) => {
        message.error(
          "Failed to submit marks: " + (error.data?.message || "Unknown error")
        );
        console.error("Submission error:", error);
      });
  };

  // Base columns
  const baseColumns = [
    {
      title: "SL",
      key: "sl",
      align: "center",
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "UserID",
      dataIndex: "user",
      key: "user",
      align: "center",
      width: 100,
      render: (title: any) => title?.username || "-",
    },
    {
      key: "first_name",
      title: "Student Name",
      dataIndex: "first_name",
      align: "center",
      width: 200,
      render: (_: any, record: any) =>
        record?.first_name && record?.last_name
          ? `${record.first_name} ${record.last_name}`
          : "-",
    },
    {
      title: "Class",
      dataIndex: "grade_level",
      key: "grade_level",
      align: "center",
      width: 150,
      render: (title: any) => title?.name || "-",
    },
  ];

  // Add this utility function at the top of your file
  const isSubjectExpired = (expDate: string) => {
    if (!expDate) return false;
    const today = new Date();
    const expirationDate = new Date(expDate);
    return today > expirationDate;
  };

  // Update your getSubjectColumns function
  const getSubjectColumns = () => {
    const allSubjects = getAllSubjects();
    if (!allSubjects.length) return [];

    return allSubjects.map((subject: any) => {
      const bgColor = getSubjectColor(subject.id);
      const isExpired = isSubjectExpired(subject.exam_mark_exp_date);

      return {
        title: (
          <Tooltip
            title={
              <div style={{ padding: "4px 8px" }}>
                <div
                  style={{
                    marginBottom: 4,
                    fontWeight: "bold",
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: 4,
                  }}
                >
                  Marks Breakdown{" "}
                  {isExpired && (
                    <span style={{ color: "#ff4d4f" }}>(Expired)</span>
                  )}
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>MCQ:</span>
                  <span>{subject.mcq_marks_possible || 0}</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Written:</span>
                  <span>{subject.written_marks_possible || 0}</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Contribution:</span>
                  <span>{subject.contribution_marks || 0}</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Expiration:</span>
                  <span>{subject.exam_mark_exp_date || "-"}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 4,
                    fontWeight: "bold",
                    borderTop: "1px solid #f0f0f0",
                    paddingTop: 4,
                  }}
                >
                  <span>Total:</span>
                  <span>{subject.total_marks || 0}</span>
                </div>
              </div>
            }
            placement="top"
            overlayStyle={{ maxWidth: 200 }}
          >
            <span
              style={{
                cursor: "pointer",
                fontWeight: 600,
                backgroundColor: isExpired ? "#fafafa" : bgColor,
                color: isExpired ? "#8c8c8c" : "#fff",
                padding: "6px 12px",
                borderRadius: "6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: isExpired ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
                border: isExpired ? "1px solid #f0f0f0" : "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                !isExpired && (e.currentTarget.style.opacity = "0.9")
              }
              onMouseLeave={(e) =>
                !isExpired && (e.currentTarget.style.opacity = "1")
              }
            >
              {isExpired && (
                <BiLock
                  style={{
                    fontSize: "14px",
                    color: "#ff4d4f",
                  }}
                />
              )}
              <span
                style={{
                  position: "relative",
                  top: isExpired ? "1px" : 0,
                  textShadow: isExpired ? "none" : "0 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                {subject.name}
              </span>
            </span>
          </Tooltip>
        ),
        key: `subject-${subject.id}`,
        align: "center",
        children: [
          {
            title: "MCQ",
            key: `mcq-${subject.id}`,
            align: "center",
            width: 150,
            render: (_: any, record: any) => {
              const subjectRecord = record.subjects?.find(
                (s: any) => s.id === subject.id
              );
              if (!subjectRecord) return null;

              const maxMcq = subject.mcq_marks_possible || 100;

              if (isExpired) {
                return (
                  <div style={{ padding: "8px" }}>
                    <Tooltip title="This subject is no longer editable">
                      <InputNumber
                        value={subjectRecord?.mcq_marks_obtained || 0}
                        style={{
                          width: "60px",
                          color: "#00000073",
                          backgroundColor: "#f5f5f5",
                          cursor: "not-allowed",
                        }}
                        disabled
                      />
                    </Tooltip>
                  </div>
                );
              }

              return (
                <div style={{ padding: "8px" }}>
                  <Tooltip title={`Maximum: ${maxMcq} marks`}>
                    <InputNumber
                      placeholder="MCQ Marks"
                      value={
                        studentData[`${record.id}-${subject.id}`]?.mcq ??
                        (subjectRecord?.mcq_marks_obtained || 0)
                      }
                      onChange={(value) => {
                        if (value > maxMcq) {
                          message.warning(`MCQ marks cannot exceed ${maxMcq}`);
                          return;
                        }
                        handleInputChange(record.id, subject.id, "mcq", value);
                      }}
                      style={{
                        width: "60px",
                        color: bgColor,
                        fontWeight: "bold",
                        border: `1px solid ${bgColor}`,
                      }}
                      min={0}
                      max={maxMcq}
                      precision={0}
                    />
                  </Tooltip>
                </div>
              );
            },
          },
          {
            title: "Written",
            key: `written-${subject.id}`,
            align: "center",
            width: 150,
            render: (_: any, record: any) => {
              const subjectRecord = record.subjects?.find(
                (s: any) => s.id === subject.id
              );
              if (!subjectRecord) return null;

              const maxWritten = subject.written_marks_possible || 100;

              if (isExpired) {
                return (
                  <div style={{ padding: "8px" }}>
                    <Tooltip title="This subject is no longer editable">
                      <InputNumber
                        value={subjectRecord?.written_marks_obtained || 0}
                        style={{
                          width: "60px",
                          color: "#00000073",
                          backgroundColor: "#f5f5f5",
                          cursor: "not-allowed",
                        }}
                        disabled
                      />
                    </Tooltip>
                  </div>
                );
              }

              return (
                <div style={{ padding: "8px" }}>
                  <Tooltip title={`Maximum: ${maxWritten} marks`}>
                    <InputNumber
                      placeholder="Written Marks"
                      value={
                        studentData[`${record.id}-${subject.id}`]?.written ??
                        (subjectRecord?.written_marks_obtained || 0)
                      }
                      onChange={(value) => {
                        if (value > maxWritten) {
                          message.warning(
                            `Written marks cannot exceed ${maxWritten}`
                          );
                          return;
                        }
                        handleInputChange(
                          record.id,
                          subject.id,
                          "written",
                          value
                        );
                      }}
                      style={{
                        width: "60px",
                        color: bgColor,
                        fontWeight: "bold",
                        border: `1px solid ${bgColor}`,
                      }}
                      min={0}
                      max={maxWritten}
                    />
                  </Tooltip>
                </div>
              );
            },
          },
        ],
      };
    });
  };
  const columns: any = [...baseColumns, ...getSubjectColumns()];

  return (
    <div className="p-6">
      <Card
        title={
          <Title level={3} className="text-center pt-6">
            Exam Marks Entry
          </Title>
        }
        className="rounded-lg shadow-xl border-0"
        headStyle={{ borderBottom: "none" }}
      >
        {createPermission ? (
          <Form
            form={form}
            onFinish={onFinish}
            isLoading={isLoading}
            isSuccess={isSuccess}
          >
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} lg={6}>
                <Form.Item
                  label="Select Exam"
                  name="exam"
                  rules={[{ required: true, message: "Exam is required!" }]}
                >
                  <Select
                    placeholder="Select Exam Name"
                    className="w-full"
                    allowClear
                    showSearch
                    dropdownStyle={{ borderRadius: "8px" }}
                  >
                    {Array.isArray(examData?.data) &&
                      examData?.data?.map((exam: any) => (
                        <Select.Option key={exam.id} value={exam.id}>
                          {exam?.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Shift" name="shift">
                  <Select
                    className="w-full"
                    placeholder="Select Shift"
                    allowClear
                  >
                    {Array.isArray(shiftData?.data) &&
                      shiftData.data.map((data: any) => (
                        <Select.Option key={data.id} value={data.id}>
                          {data.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Class" name="grade_level">
                  <Select
                    className="w-full"
                    placeholder="Select Class"
                    allowClear
                  >
                    {Array.isArray(classData?.data) &&
                      classData.data.map((data: IClasses) => (
                        <Select.Option key={data.id} value={data.id}>
                          {data.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>

              {gradeLevel && (
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="Section" name="section">
                    <Select
                      className="w-full"
                      placeholder="Select Section"
                      allowClear
                      showSearch
                    >
                      {Array.isArray(sectionData?.data) &&
                        sectionData?.data?.map((data: any) => (
                          <Select.Option key={data.id} value={data.id}>
                            {data?.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </Row>

            {exam && examDetails?.data?.records && (
              <Table
                columns={columns}
                dataSource={examDetails.data.records}
                rowKey="id"
                pagination={false}
                bordered
                className="mt-6 rounded-lg shadow-sm"
                scroll={{ x: true, y: 500 }} // ✅ Vertical scroll
                sticky // ✅ Sticky header enabled
                rowClassName={() => "hover:bg-gray-50 transition-all"}
              />
            )}
          </Form>
        ) : (
          <NoPermissionData />
        )}
      </Card>
    </div>
  );
};

export default MarkExamPage;
