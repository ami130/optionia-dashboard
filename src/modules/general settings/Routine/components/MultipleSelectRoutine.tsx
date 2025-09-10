import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Row, Select } from "antd";
import { useGetTeacherQuery } from "../../../members/teachers/api/teachersEndPoints";
import { useGetSubjectsQuery } from "../../subjects/api/subjectsEndPoints";
import { useState } from "react";
import { debounce } from "lodash";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MultipleSelectRoutine = ({
  specificClass,
}: {
  specificClass: number;
}) => {
  const [search, setSearch] = useState("");

  const { data: teacherData } = useGetTeacherQuery({});
  const { data: subjectData, isFetching } = useGetSubjectsQuery({
    grade_level: specificClass,
    search: search,
  });

  return (
    <div>
      <Form.List name="slots">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={[16, 16]} align="middle">
                <Col span={4}>
                  <Form.Item
                    {...restField}
                    label="Day"
                    name={[name, "day"]}
                    rules={[
                      { required: true, message: "Please select a day!" },
                    ]}
                  >
                    <Select placeholder="Select Day" className="w-full">
                      {daysOfWeek.map((day) => (
                        <Select.Option key={day} value={day}>
                          {day}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Start Time */}
                <Col xs={24} sm={12} md={8} lg={4}>
                  <Form.Item
                    {...restField}
                    label="Start Time"
                    name={[name, "start_time"]}
                    rules={[
                      {
                        required: true,
                        message: "Please select Start time!",
                      },
                    ]}
                  >
                    <input
                      type="time"
                      className="border border-gray-300 w-full rounded-lg px-3 py-0.5"
                    ></input>
                  </Form.Item>
                </Col>

                {/* End Time */}
                <Col xs={24} sm={12} md={8} lg={4}>
                  <Form.Item
                    {...restField}
                    label="End Time"
                    name={[name, "end_time"]}
                    rules={[
                      {
                        required: true,
                        message: "Please select End time!",
                      },
                    ]}
                  >
                    <input
                      type="time"
                      className="border border-gray-300 w-full rounded-lg px-3 py-0.5"
                    ></input>
                  </Form.Item>
                </Col>

                {/* Start Time */}
                {/* <Col span={4}>
                  <Form.Item
                    {...restField}
                    label="Start Time"
                    name={[name, "start_time"]}
                    rules={[
                      { required: true, message: "Please select Start time!" },
                    ]}
                  >
                    <TimePicker format="h:mm A" use12Hours className="w-full" />
                  </Form.Item>
                </Col> */}

                {/* End Time */}
                {/* <Col span={4}>
                  <Form.Item
                    {...restField}
                    label="End Time"
                    name={[name, "end_time"]}
                    rules={[
                      { required: true, message: "Please select end time!" },
                    ]}
                  >
                    <TimePicker format="h:mm A" use12Hours className="w-full" />
                  </Form.Item>
                </Col> */}

                <Col span={4}>
                  <Form.Item
                    label="Select Subject"
                    name={[name, "subject"]}
                    {...restField}
                    rules={[
                      { required: true, message: "Please select Subject!" },
                    ]}
                  >
                    <Select
                      placeholder="Select Subject"
                      className="w-full"
                      allowClear
                      showSearch
                      filterOption={false}
                      optionFilterProp="children"
                      onSearch={debounce(setSearch, 500)}
                      loading={isFetching}
                      notFoundContent={
                        isFetching ? <LoadingOutlined /> : "No Client found"
                      }
                    >
                      {subjectData?.data?.results?.map((subject: any) => (
                        <Select.Option key={subject.id} value={subject.id}>
                          {subject?.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label="Select Teacher"
                    name={[name, "teacher"]}
                    {...restField}
                    rules={[
                      { required: true, message: "Please select Teacher!" },
                    ]}
                  >
                    <Select placeholder="Select Teacher" className="w-full">
                      {teacherData?.data?.results?.map((teacher: any) => (
                        <Select.Option key={teacher.id} value={teacher.id}>
                          {teacher?.first_name} {teacher?.last_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {/* Remove Button */}
                <Col span={2} className="flex justify-end ">
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Col>
              </Row>
            ))}

            {/* Add New Routine Button */}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Routine
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default MultipleSelectRoutine;
