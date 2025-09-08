/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ColumnsType } from "antd/es/table";
import { Badge, Tooltip } from "antd";
import dayjs from "dayjs";

const ATTENDANCE_STATUS = {
  P: { text: "Present", color: "green", status: "success" },
  L: { text: "Late", color: "orange", status: "warning" },
  A: { text: "Absent", color: "red", status: "error" },
  H: { text: "Half-day", color: "blue", status: "processing" },
  default: { text: "-", color: "gray", status: "default" },
};

const useAttendanceReportColumns = (data: any[] = []): ColumnsType<any> => {
  const allDates = Array.from(
    new Set(
      data.flatMap((student) =>
        student.attendances ? Object.keys(student.attendances) : []
      )
    )
  ).sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1));

  const baseColumns: ColumnsType<any> = [
    {
      key: "sl",
      title: "SL",
      align: "center",
      width: 60,
      fixed: "left",
      render: (_, __, index) => index + 1,
    },
    {
      title: "UserId",
      dataIndex: "username",
      key: "username",
      align: "center",
      fixed: "left",
      width: 100,
      render: (username) => username || "-",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "left",
      fixed: "left",
      width: 150,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      align: "center",
      fixed: "left",
      width: 120,
      render: (mobile) => {
        if (!mobile || mobile === "-") return "-";
        return mobile.startsWith("880") ? mobile.substring(3) : mobile;
      },
    },
    {
      title: "Summary",
      key: "summary",
      align: "center",
      fixed: "left",
      width: 150,
      render: (_, record) => {
        if (!record.attendances) return "-";

        const counts = (
          Object.values(record.attendances) as { status: string }[]
        ).reduce((acc: Record<string, number>, curr: { status: string }) => {
          const status = curr.status;
          acc[status as keyof typeof ATTENDANCE_STATUS] =
            (acc[status as keyof typeof ATTENDANCE_STATUS] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return (
          <div className="flex gap-2 justify-center">
            {Object.entries(ATTENDANCE_STATUS).map(([key, { color, text }]) => {
              if (key === "default") return null;
              const count = counts[key] || 0;
              return count > 0 ? (
                <Tooltip
                  key={key}
                  title={`${text}: ${count}`}
                  placement="top"
                  mouseEnterDelay={0.1}
                  mouseLeaveDelay={0.1}
                >
                  <span
                    style={{
                      color,
                      cursor: "help",
                      padding: "2px 4px",
                      borderRadius: "2px",
                      backgroundColor: "rgba(0,0,0,0.05)",
                    }}
                  >
                    {count}
                    {key}
                  </span>
                </Tooltip>
              ) : null;
            })}
          </div>
        );
      },
    },
  ];

  const dateColumns: ColumnsType<any> = allDates.map((date) => ({
    title: (
      <Tooltip
        title={dayjs(date).format("dddd, MMMM D, YYYY")}
        placement="top"
        mouseEnterDelay={0.1}
        mouseLeaveDelay={0.1}
      >
        <div className="flex flex-col items-center cursor-help px-1 py-1 hover:bg-gray-50 rounded">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            {dayjs(date).format("MMM")} {dayjs(date).format("D")}
            {", "}
            {dayjs(date).format("dddd")}
          </div>
        </div>
      </Tooltip>
    ),
    key: `attendance-${date}`,
    dataIndex: ["attendances", date],
    align: "center",
    width: 100,
    render: (attendance: any) => {
      if (!attendance) {
        return (
          <Tooltip
            title={`No attendance record for ${dayjs(date).format(
              "MMMM D, YYYY"
            )}`}
            placement="top"
            mouseEnterDelay={0.1}
            mouseLeaveDelay={0.1}
          >
            <div className="text-gray-300 cursor-help h-full flex items-center justify-center">
              <span className="text-lg">-</span>
            </div>
          </Tooltip>
        );
      }

      const { status, check_in, check_out, duration } = attendance;
      const {
        text,
        color,
        status: badgeStatus,
      } = ATTENDANCE_STATUS[status as keyof typeof ATTENDANCE_STATUS] ||
      ATTENDANCE_STATUS.default;

      const tooltipContent = (
        <div className="space-y-1 p-1 text-gray-200">
          <div className="font-semibold text-gray-200">
            {dayjs(date).format("dddd, MMMM D, YYYY")}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span
              className="px-1.5 py-0.5 rounded text-xs font-medium capitalize"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {text}
            </span>
          </div>
          {check_in && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-200">Check-in:</span>
              <span className="text-blue-600 font-mono">{check_in}</span>
            </div>
          )}
          {check_out && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-200">Check-out:</span>
              <span className="text-red-600 font-mono">{check_out}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-200">Duration:</span>
              <span className="text-green-600 font-mono">{duration}</span>
            </div>
          )}
        </div>
      );

      return (
        <Tooltip
          title={tooltipContent}
          placement="top"
          mouseEnterDelay={0.1}
          mouseLeaveDelay={0.1}
          overlayStyle={{ maxWidth: "300px" }}
          overlayClassName="bg-white shadow-lg rounded-md border border-gray-200"
        >
          <div className="cursor-help h-full flex items-center justify-center px-1 py-2 hover:bg-gray-50 rounded">
            <Badge
              status={badgeStatus as any}
              text={
                <div className="flex flex-col items-center gap-1 w-full">
                  {/* Status */}
                  <span
                    className="font-medium text-xs capitalize px-1.5 py-0.5 rounded-full"
                    style={{
                      color,
                      backgroundColor: `${color}10`,
                    }}
                  >
                    {status || "-"}
                  </span>

                  {/* Time indicators */}
                  <div className="flex flex-col items-center gap-0.5 w-full">
                    {check_in && (
                      <div className="text-xs text-blue-600 font-mono leading-none">
                        In : {check_in}
                      </div>
                    )}
                    {check_out && (
                      <div className="text-xs text-red-600 font-mono leading-none">
                        Out: {check_out}
                      </div>
                    )}
                    {duration && (
                      <div className="text-xs text-green-600 font-mono leading-none">
                        Time: {duration}
                      </div>
                    )}
                  </div>
                </div>
              }
            />
          </div>
        </Tooltip>
      );
    },
  }));

  return [...baseColumns, ...dateColumns];
};

export default useAttendanceReportColumns;
