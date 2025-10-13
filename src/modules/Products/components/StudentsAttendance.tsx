import { Col, Row } from "antd";
import {
  FaUserCheck,
  FaUserTimes,
  FaUserClock,
  FaRunning,
} from "react-icons/fa";

const StudentsAttendance = ({ data }: any) => {
  const totalAdmissions = data?.admissions?.length || 0;
  const colSpan =
    totalAdmissions > 1 ? { xs: 24, sm: 24, lg: 24 } : { span: 24 };

  // Array of background gradient colors
  const bgColors = [
    "bg-gradient-to-r from-green-500 to-teal-700",
    "bg-gradient-to-r from-purple-500 to-violet-700",
    "bg-gradient-to-r from-red-500 to-pink-700",
    "bg-gradient-to-r from-orange-500 to-orange-700",
    "bg-gradient-to-r from-green-500 to-green-700",
    "bg-gradient-to-r from-blue-500 to-indigo-700",
  ];

  return (
    <div className="py-5">
      {totalAdmissions > 0 ? (
        <Row gutter={[16, 16]} justify="center">
          {/* {data.admissions.map((admission: any, index: number) => (
            <Col key={admission?.id} {...colSpan}>
              <div className="border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition duration-300">

                <div
                  className={`bg-gradient-to-r ${
                    bgColors[index % bgColors.length]
                  } text-white p-4 rounded-t-lg text-center`}
                >
                  <h2 className="text-md font-semibold">Attendance Report</h2>
                  <p className="text-sm opacity-80">
                    {admission?.session?.name}
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <FaUserCheck className="text-green-500 text-xl" />{" "}
                      Present:
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {admission?.total_present}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <FaUserTimes className="text-red-500 text-xl" /> Absent:
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {admission?.total_absent}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <FaRunning className="text-yellow-500 text-xl" /> Leave:
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {admission?.total_leave}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <FaUserClock className="text-orange-500 text-xl" /> Late:
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {admission?.total_late}
                    </span>
                  </div>
                </div>
              </div>
            </Col>
          ))} */}

          <Col {...colSpan}>
            <div className="border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              {/* Dynamic Header Background */}
              <div
                className={`bg-gradient-to-r ${
                  bgColors[1 % bgColors.length]
                } text-white p-4 rounded-t-lg text-center`}
              >
                <h2 className="text-md font-semibold">Attendance Report</h2>
                <p className="text-sm opacity-80">
                  {data.admissions[0]?.session?.name}
                </p>
              </div>

              {/* Attendance Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600 flex items-center gap-2">
                    <FaUserCheck className="text-green-500 text-xl" /> Present:
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    {data.admissions[0]?.total_present}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600 flex items-center gap-2">
                    <FaUserTimes className="text-red-500 text-xl" /> Absent:
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    {data.admissions[0]?.total_absent}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600 flex items-center gap-2">
                    <FaRunning className="text-yellow-500 text-xl" /> Leave:
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    {data.admissions[0]?.total_leave}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600 flex items-center gap-2">
                    <FaUserClock className="text-orange-500 text-xl" /> Late:
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    {data.admissions[0]?.total_late}
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <div className="text-center">
          <h3 className="text-lg text-gray-600">
            No attendance data available.
          </h3>
        </div>
      )}
    </div>
  );
};

export default StudentsAttendance;
