import { Col, Row } from "antd";
import {
  FaMoneyBillWave,
  FaRegCreditCard,
  FaTags,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";

const StudentFeeReport = ({ data }: any) => {
  const hasMultipleStudents = data?.admissions?.length > 1;

  // Define an array of gradient background colors for each card
  const bgColors = [
    "bg-gradient-to-r from-red-500 to-pink-700",
    "bg-gradient-to-r from-green-500 to-green-700",
    "bg-gradient-to-r from-orange-500 to-orange-700",
    "bg-gradient-to-r from-blue-500 to-indigo-700",
    "bg-gradient-to-r from-green-500 to-teal-700",
    "bg-gradient-to-r from-purple-500 to-violet-700",
  ];

  return (
    <div className="py-5">
      {data?.admissions?.length > 0 ? (
        <Row gutter={[16, 16]} justify="center">
          {/* {data.admissions.map((student: any, index: number) => (
            <Col key={index} xs={24} sm={hasMultipleStudents ? 12 : 24}>
              <div className="shadow-lg rounded-lg transition-all duration-300 border border-blue-300 bg-white hover:shadow-2xl">
      
                <div
                  className={`${
                    bgColors[index % bgColors.length]
                  } text-white p-5 rounded-t-lg text-center`}
                >
                  <h2 className="text-md font-semibold">Fee Report</h2>
                  <p className="text-sm opacity-80">{student.session?.name}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-500" /> One-time
                      Fee:
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      ৳{student.one_time_fee}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <FaRegCreditCard className="text-purple-500" /> Monthly
                      Fee:
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      ৳{student.monthly_fee}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <FaExclamationCircle className="text-red-500" /> Due
                      Amount:
                    </span>
                    <span className="text-lg font-bold text-red-500">
                      ৳{student.due_amount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" /> Total Paid:
                    </span>
                    <span className="text-lg font-bold text-green-500">
                      ৳{student.total_paid_amount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                      <FaTags className="text-blue-500" /> Discount Applied:
                    </span>
                    <span className="text-lg font-bold text-blue-500">
                      ৳{student.total_discounted_amount}
                    </span>
                  </div>
                </div>
              </div>
            </Col>
          ))} */}

          <Col xs={24} sm={hasMultipleStudents ? 24 : 24}>
            <div className="shadow-lg rounded-lg transition-all duration-300 border border-blue-300 bg-white hover:shadow-2xl">
              {/* Header with dynamic background */}
              <div
                className={`${
                  bgColors[1 % bgColors.length]
                } text-white p-5 rounded-t-lg text-center`}
              >
                <h2 className="text-md font-semibold">Fee Report</h2>
                <p className="text-sm opacity-80">
                  {data.admissions[0]?.session?.name}
                </p>
              </div>

              {/* Details Section */}
              <div className="p-6 space-y-4">
                {/* One-time Fee */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600 flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-500" /> One-time Fee:
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    ৳{data.admissions[0]?.one_time_fee}
                  </span>
                </div>
                {/* Monthly Fee */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600 flex items-center gap-2">
                    <FaRegCreditCard className="text-purple-500" /> Monthly Fee:
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    ৳{data.admissions[0]?.monthly_fee}
                  </span>
                </div>
                {/* Due Amount */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600 flex items-center gap-2">
                    <FaExclamationCircle className="text-red-500" /> Due Amount:
                  </span>
                  <span className="text-lg font-bold text-red-500">
                    ৳{data.admissions[0]?.due_amount}
                  </span>
                </div>
                {/* Total Paid */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" /> Total Paid:
                  </span>
                  <span className="text-lg font-bold text-green-500">
                    ৳{data.admissions[0]?.total_paid_amount}
                  </span>
                </div>
                {/* Discount Applied */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600 flex items-center gap-2">
                    <FaTags className="text-blue-500" /> Discount Applied:
                  </span>
                  <span className="text-lg font-bold text-blue-500">
                    ৳{data.admissions[0]?.total_discounted_amount}
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <p className="text-center text-lg text-gray-500">
          No fee data available.
        </p>
      )}
    </div>
  );
};

export default StudentFeeReport;
