import type { ColumnsType } from "antd/es/table";
import { Tag } from "antd";

interface Subject {
  id: number;
  name: string;
  grade_level: {
    id: number;
    name: string;
    description: string;
    class_teacher: any;
  };
}

interface ClassGroup {
  key: number;
  className: string;
  subjects: string[];
}

const useTeacherSubjectsColumns = (): ColumnsType<ClassGroup> => {
  return [
    {
      key: "0",
      title: "SL",
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      key: "1",
      title: "Class",
      dataIndex: "className",
      align: "center",
      render: (className) => (
        <span style={{ fontWeight: 600 }}>{className || "-"}</span>
      ),
    },
    {
      key: "2",
      title: "Subjects",
      dataIndex: "subjects",
      align: "center",
      render: (subjects: string[]) => (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
          }}
        >
          {subjects.map((subject, idx) => (
            <Tag key={idx} color="blue" style={{ margin: 0 }}>
              {subject}
            </Tag>
          ))}
        </div>
      ),
    },
  ];
};

// Helper function to transform your data into the grouped format
export const groupSubjectsByClass = (subjects: Subject[]): ClassGroup[] => {
  const classMap = new Map<string, string[]>();

  subjects.forEach((subject) => {
    const className = subject.grade_level?.name || "Unknown Class";
    if (!classMap.has(className)) {
      classMap.set(className, []);
    }
    classMap.get(className)?.push(subject.name);
  });

  return Array.from(classMap.entries()).map(([className, subjects], index) => ({
    key: index + 1,
    className,
    subjects,
  }));
};

export default useTeacherSubjectsColumns;
