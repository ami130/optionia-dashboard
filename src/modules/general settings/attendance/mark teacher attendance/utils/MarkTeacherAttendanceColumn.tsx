import { Button, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const useMarkTeacherAttendanceColumns = ({
  attendanceData,
  formData,
  setResult,
}: {
  attendanceData: any[];
  formData: any;
  setResult: any;
}) => {
  const [admission, setAdmission] = useState<any[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [previousAttendanceData, setPreviousAttendanceData] = useState<any[]>(
    []
  );
  const [checkInOutMap, setCheckInOutMap] = useState<
    Record<string, { [key: string]: string | undefined }>
  >({});

  useEffect(() => {
    if (
      JSON.stringify(attendanceData) !== JSON.stringify(previousAttendanceData)
    ) {
      const initialStatusMap: Record<string, string> = {};
      const initialCheckInOut: Record<
        string,
        { check_in?: string; check_out?: string }
      > = {};

      const initialAdmission = attendanceData
        ?.map((data) => {
          const status =
            data?.status === "not marked" ? undefined : data?.status;

          if (data?.teacher) {
            const key = `teacher-${data.teacher.id}`;
            initialStatusMap[key] = status;
            initialCheckInOut[key] = {
              check_in: data.check_in,
              check_out: data.check_out,
            };
            return {
              teacher: data.teacher.id,
              status,
              check_in: data.check_in,
              check_out: data.check_out,
            };
          } else if (data?.employee) {
            const key = `employee-${data.employee.id}`;
            initialStatusMap[key] = status;
            initialCheckInOut[key] = {
              check_in: data.check_in,
              check_out: data.check_out,
            };
            return {
              employee: data.employee.id,
              status,
              check_in: data.check_in,
              check_out: data.check_out,
            };
          }

          return null;
        })
        .filter(Boolean);

      setStatusMap(initialStatusMap);
      setCheckInOutMap(initialCheckInOut);
      setAdmission(initialAdmission);
      setPreviousAttendanceData(attendanceData);
    }
  }, [attendanceData, previousAttendanceData]);

  useEffect(() => {
    if (formData && admission.length > 0) {
      const result = {
        date: formData.date,
        records: admission,
      };
      setResult(result);
    }
  }, [formData, admission, setResult]);

  const handleStatusChange = (
    e: any,
    recordId: number,
    type: "teacher" | "employee"
  ) => {
    const value = e.target.value;
    const statusKey = `${type}-${recordId}`;

    setStatusMap((prev) => ({ ...prev, [statusKey]: value }));

    setAdmission((prev) => {
      const filtered = prev.filter(
        (item) => !(item.teacher === recordId || item.employee === recordId)
      );

      const { check_in, check_out } = checkInOutMap[statusKey] || {};

      return [
        ...filtered,
        type === "teacher"
          ? { teacher: recordId, status: value, check_in, check_out }
          : { employee: recordId, status: value, check_in, check_out },
      ];
    });
  };

  const handleTimeChange = (
    time: any,
    type: "check_in" | "check_out",
    recordId: number,
    recordType: "teacher" | "employee"
  ) => {
    const key = `${recordType}-${recordId}`;
    const formattedTime = time ? time.format("HH:mm:ss") : undefined;

    setCheckInOutMap((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: formattedTime,
      },
    }));

    setAdmission((prev) => {
      const filtered = prev.filter(
        (item) => !(item.teacher === recordId || item.employee === recordId)
      );

      const { check_in, check_out } = {
        ...checkInOutMap[key],
        [type]: formattedTime,
      } as { check_in?: string; check_out?: string };

      return [
        ...filtered,
        recordType === "teacher"
          ? {
              teacher: recordId,
              status: statusMap[key] || "present",
              check_in,
              check_out,
            }
          : {
              employee: recordId,
              status: statusMap[key] || "present",
              check_in,
              check_out,
            },
      ];
    });
  };

  const handleSetAllStatus = (status: string) => {
    const updatedStatusMap: Record<string, string> = {};
    const updatedAdmission = attendanceData
      ?.map((data) => {
        if (data?.teacher) {
          const key = `teacher-${data.teacher.id}`;
          updatedStatusMap[key] = status;
          return {
            teacher: data.teacher.id,
            status,
            check_in: checkInOutMap[key]?.check_in,
            check_out: checkInOutMap[key]?.check_out,
          };
        } else if (data?.employee) {
          const key = `employee-${data.employee.id}`;
          updatedStatusMap[key] = status;
          return {
            employee: data.employee.id,
            status,
            check_in: checkInOutMap[key]?.check_in,
            check_out: checkInOutMap[key]?.check_out,
          };
        }
        return null;
      })
      .filter(Boolean);

    setStatusMap(updatedStatusMap);
    setAdmission(updatedAdmission);
    setResult({ date: formData.date, records: updatedAdmission });
  };

  return [
    {
      key: "0",
      title: "Full Name",
      align: "center" as const,
      render: (_: any, record: any) => {
        if (record?.teacher) {
          return (
            <Link
              to={`/teacher/teacher-view/${record?.teacher.id}`}
              className="text-green-500"
            >
              {record?.teacher?.first_name} {record?.teacher?.last_name}
            </Link>
          );
        } else if (record?.employee) {
          return (
            <Link
              to={`/employees/employee-view/${record?.employee.id}`}
              className="text-blue-500"
            >
              {record?.employee?.first_name} {record?.employee?.last_name}
            </Link>
          );
        } else {
          return "-";
        }
      },
    },
    {
      key: "1",
      title: "User ID",
      align: "center" as const,
      render: (_: any, record: any) =>
        record?.teacher
          ? `${record?.teacher?.user?.username}`
          : `${record?.employee?.user?.username}`,
    },
    {
      key: "2",
      title: "Role Type",
      align: "center" as const,
      render: (_: any, record: any) =>
        record?.teacher
          ? `${record?.teacher?.user?.role?.name}`
          : `${record?.employee?.user?.role?.name}`,
    },
    {
      key: "3",
      title: "Phone Number",
      align: "center" as const,
      render: (_: any, record: any) =>
        record?.teacher
          ? `${record?.teacher?.phone_number}`
          : `${record?.employee?.phone_number}`,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      align: "center" as const,
      render: (duration: any) => <span>{duration}</span>,
    },
    {
      key: "5",
      title: "Check-in",
      align: "center" as const,
      render: (record: any) => {
        const key = record.teacher
          ? `teacher-${record.teacher.id}`
          : `employee-${record.employee.id}`;
        const value = checkInOutMap[key]?.check_in || record?.check_in;

        // 🟢 Fix: Slice to HH:mm for input
        const timeValue = value ? value.slice(0, 5) : "";

        return (
          <input
            type="time"
            value={timeValue}
            className="border border-gray-300 w-full rounded-lg px-3 py-0.5"
            onChange={(e) => {
              const newTime = e.target.value
                ? `${e.target.value}:00` // add seconds back
                : undefined;

              handleTimeChange(
                newTime ? dayjs(newTime, "HH:mm:ss") : undefined,
                "check_in",
                record.teacher?.id || record.employee?.id,
                record.teacher ? "teacher" : "employee"
              );
            }}
          />
        );
      },
    },

    {
      title: "Check-out",
      align: "center" as const,
      render: (record: any) => {
        const key = record.teacher
          ? `teacher-${record.teacher.id}`
          : `employee-${record.employee.id}`;
        const value = checkInOutMap[key]?.check_out || record?.check_out;

        const timeValue = value ? value.slice(0, 5) : "";

        return (
          <input
            type="time"
            value={timeValue}
            className="border border-gray-300 w-full rounded-lg px-3 py-0.5"
            onChange={(e) => {
              const newTime = e.target.value
                ? `${e.target.value}:00`
                : undefined;

              handleTimeChange(
                newTime ? dayjs(newTime, "HH:mm:ss") : undefined,
                "check_out",
                record.teacher?.id || record.employee?.id,
                record.teacher ? "teacher" : "employee"
              );
            }}
          />
        );
      },
    },
    {
      title: (
        <div className="flex items-center justify-center gap-5">
          <Button onClick={() => handleSetAllStatus("present")}>
            All Present
          </Button>
          <Button onClick={() => handleSetAllStatus("late")}>All Late</Button>
          <Button onClick={() => handleSetAllStatus("absent")}>
            All Absent
          </Button>
          <Button onClick={() => handleSetAllStatus("half")}>All Half</Button>
        </div>
      ),
      align: "center",
      render: (record: any) => {
        const recordId = record.teacher?.id || record.employee?.id;
        const type = record.teacher ? "teacher" : "employee";
        const statusKey = `${type}-${recordId}`;

        return (
          <Space size="middle">
            <Radio.Group
              value={statusMap[statusKey] || "not marked"}
              onChange={(e) => handleStatusChange(e, recordId, type)}
            >
              <Radio value="present">Present</Radio>
              <Radio value="late">Delay</Radio>
              <Radio value="absent">Absent</Radio>
              <Radio value="half">Half</Radio>
            </Radio.Group>
          </Space>
        );
      },
    },
  ];
};

export default useMarkTeacherAttendanceColumns;
