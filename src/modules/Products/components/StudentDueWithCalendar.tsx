import { Badge, Card, Col, Row } from "antd";
import Calendar from "react-calendar"; // Import react-calendar
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { ThemesTypes } from "../../../app/features/themeSlice";
import { useState } from "react";

const StudentDueWithCalendar = () => {
  const { themes } = useSelector<RootState, ThemesTypes>(
    (state) => state.themes
  );

  const [value, setValue] = useState<Date>(new Date());

  const handleDateChange = (value: Date) => {
    setValue(value);
  };

  return (
    <div>
      <Row gutter={[10, 16]} className="my-2">
        <Col span={24} lg={24}>
          <Badge.Ribbon text="Fee Report" placement="start">
            <Card
              className={`custom-calendar ${
                themes === "light" ? "light" : "dark"
              }`}
            >
              <Calendar
                onChange={(value) => handleDateChange(value as Date)}
                value={value}
                view="year"
                selectRange={false}
                tileContent={({ view }) =>
                  view === "year" ? (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ margin: 0 }}>1000 BDT</p>
                    </div>
                  ) : null
                }
                className={`custom-calendar ${
                  themes === "light" ? "light" : "dark"
                }`}
              />
            </Card>
          </Badge.Ribbon>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDueWithCalendar;
