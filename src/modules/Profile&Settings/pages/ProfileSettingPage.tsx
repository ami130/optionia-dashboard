/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Button, Card, Col, Row } from "antd";
import { IoGridOutline } from "react-icons/io5";
import { FaGraduationCap, FaListUl, FaUser } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import { SearchComponent } from "../../../common/CommonAnt/CommonSearch/CommonSearch";
import ViewButton from "../../../common/CommonAnt/Button/ViewButton";
import DeleteButton from "../../../common/CommonAnt/Button/DeleteButton";
import Table from "../../../common/CommonAnt/Table";
import { useAppSelector } from "../../../app/store";
import { no_img } from "../../../utilities/images";

import { FilterState } from "../../../app/features/filterSlice";
import { useGetDashboardDataQuery } from "../../Dashboard/api/dashoboardEndPoints";
import { GetPermission } from "../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../utilities/permissionConstant";
import NoPermissionData from "../../../utilities/NoPermissionData";
import useProfileSettingColumns from "../utils/profileSettingColumns";
import { useGetProfileSettingQuery } from "../api/profileSettingEndPoints";

const ProfileSettingPage = () => {
  // const dispatch = useDispatch();
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const columns = useProfileSettingColumns();
  const [layout, setLayout] = useState("grid");
  const [filters, setFilters] = useState({
    search: "",
    is_active: "",
    current_grade_level: "",
    current_section: "",
    current_session: "",
    current_shift: "",
  });
  const { page_size, page } = useAppSelector(FilterState);

  // Fetch students data with pagination
  const {
    data: studentData,
    isLoading,
    refetch,
    isFetching,
  } = useGetProfileSettingQuery({
    search: filters.search,
    current_grade_level: filters.current_grade_level,
    current_section: filters.current_section,
    current_session: filters.current_session,
    current_shift: filters.current_shift,
    is_active: filters.is_active,
    page_size: page_size,
    page: Number(page) || undefined,
  });

  const handleDelete = async (id: any) => {
    console.log(id);
    try {
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const viewPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.student,
    actionNames.view
  );
  // const createPermission = GetPermission(
  //   dashboardData?.data?.permissions,
  //   moduleNames.student,
  //   actionNames.add
  // );

  return (
    <div className="space-y-5">
      <div className="my-5">
        <BreadCrumb />
      </div>
      {/* {createPermission && (
            <Col xs={24} sm={12} md={8} lg={4}>
              <Link to={"/students/create"}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Add Student
                </Button>
              </Link>
            </Col>
          )} */}
      <Card
        bodyStyle={{
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          {/* Search Section */}
          <Col xs={24} sm={24} md={8} lg={6} xl={4}>
            <SearchComponent
              onSearch={(value) =>
                setFilters((prev) => ({ ...prev, search: value }))
              }
              placeholder="Search students..."
            />
          </Col>
        </Row>
      </Card>
      {viewPermission ? (
        <Card
          title={
            <div className="flex justify-between items-center">
              <div className="space-x-5">
                <span>All ProfileSetting</span>
                <Link
                  to={`/admission/create-admission`}
                  className="w-fit underline text-blue-400 cursor-pointer text-sm font-normal"
                >
                  Add Admission{" "}
                </Link>
              </div>
              <div className="flex items-center">
                <FaListUl
                  className={`w-9 h-9 border px-2 cursor-pointer ${
                    layout === "grid"
                      ? "text-blue-500 border-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setLayout("grid")}
                />
                <IoGridOutline
                  className={`w-9 h-9 border px-2 cursor-pointer ${
                    layout === "column"
                      ? "text-blue-500 border-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setLayout("column")}
                />
              </div>
            </div>
          }
        >
          {layout !== "grid" ? (
            <Row gutter={[16, 24]} className="p-4">
              {studentData?.data?.results?.map((student: any) => (
                <Col
                  key={student.id}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={4}
                  xxl={3}
                >
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                    {/* Student Image */}
                    <div className="relative pt-[100%] bg-gray-100">
                      <img
                        src={student?.image || no_img}
                        alt={`${student?.first_name} ${student?.last_name}`}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = no_img;
                        }}
                      />
                    </div>

                    {/* Student Info */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-base font-semibold text-gray-800 truncate">
                        {student?.first_name} {student?.last_name}
                      </h3>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center">
                          <FaUser className="mr-2" />
                          <span>ID: {student?.user?.username}</span>
                        </p>
                        <p className="flex items-center">
                          <FaGraduationCap className="mr-2" />
                          <span>
                            Class: {student?.current_grade_level?.name || "-"}
                          </span>
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-center space-x-3 pt-3 border-t border-gray-100">
                        <ViewButton
                          to={`student-view/${student?.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        />

                        <Link
                          to={`/students/update/${student.id}`}
                          className="text-orange-500 hover:text-orange-700"
                        >
                          <Button
                            type="text"
                            icon={<FaEdit />}
                            className="hover:bg-orange-50"
                          />
                        </Link>

                        <DeleteButton
                          onConfirm={() => handleDelete(student?.id)}
                          onCancel={() => console.log("Cancel delete")}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Table
              rowKey={"id"}
              loading={isLoading || isFetching}
              refetch={refetch}
              total={studentData?.data?.count}
              dataSource={studentData?.data?.results}
              columns={columns}
            />
          )}
        </Card>
      ) : (
        <NoPermissionData />
      )}
    </div>
  );
};

export default ProfileSettingPage;
