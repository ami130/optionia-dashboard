import { Card, Col, Row } from "antd";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import StudentInformation from "./StudentInformation";
import StudentsAttendance from "./StudentsAttendance";
import { useParams } from "react-router-dom";
import StudentFeeReport from "./StudentFeeReport";
import { useGetSingleProductQuery } from "../api/productEndPoints";

const ProductView = () => {
  const { studentId } = useParams();
  const { data } = useGetSingleProductQuery(Number(studentId));

  return (
    <div>
      <div className="my-5">
        <BreadCrumb />
      </div>
      <Card>
        <Row gutter={[24, 16]}>
          {/* Left Column */}
          <Col xs={24} sm={24} md={24} lg={24} xl={16}>
            <StudentInformation data={data?.data} />
            <Row>
              <Col span={24} className="my-2">
                {/* <StudentClassTestReport /> */}
              </Col>
            </Row>
          </Col>

          {/* Right Column */}
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            <StudentsAttendance data={data?.data} />
            <StudentFeeReport data={data?.data} />
            {/* <StudentDueWithCalendar /> */}
            {/* <StudentPerformance /> */}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductView;
