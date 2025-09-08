import { Card, Statistic, Row, Col, Button, DatePicker } from "antd";
import {
  ArrowDownOutlined,
  FileTextOutlined,
  CalendarOutlined,
  PieChartOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../../../../app/store";
import { FilterState } from "../../../../../app/features/filterSlice";
import { useGetDashboardDataQuery } from "../../../../Dashboard/api/dashoboardEndPoints";
import useCashColumns from "../../../Accounts/cash management/utils/cashColumns";
import { GetPermission } from "../../../../../utilities/permission";
import {
  actionNames,
  moduleNames,
} from "../../../../../utilities/permissionConstant";
import {
  useGetCashQuery,
  useLazyGetIncomeExpenseFormQuery,
} from "../../../Accounts/cash management/api/cashEndPoints";
import { IGetCash } from "../../../Accounts/cash management/types/cashTypes";
import CreateCash from "../../../Accounts/cash management/components/CreateCash";
import NoPermissionData from "../../../../../utilities/NoPermissionData";
import { Table } from "../../../../../common/CommonAnt";
import { FaFilePdf } from "react-icons/fa6";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
const { MonthPicker } = DatePicker;

export const ExpenseTracking = () => {
  // const categoryColors = {
  //   Utilities: "blue",
  //   Stationery: "green",
  //   Maintenance: "orange",
  //   Transportation: "purple",
  //   "Food & Beverage": "pink",
  //   Technology: "indigo",
  //   Sports: "yellow",
  // };

  const currentMonth = dayjs().format("YYYY-MM") + "-01";

  const [filters, setFilters] = useState({
    status: "",
    month: currentMonth,
  });

  const { page_size, page } = useAppSelector(FilterState);

  const { data: dashboardData } = useGetDashboardDataQuery({});
  const columns = useCashColumns();
  const [getIncomeExpenseForm, { data: singleFeeForm }] =
    useLazyGetIncomeExpenseFormQuery<any>();

  const viewPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.financialentry,
    actionNames.view
  );
  const createPermission = GetPermission(
    dashboardData?.data?.permissions,
    moduleNames.financialentry,
    actionNames.add
  );

  const {
    data: transactionList,
    isLoading,
    isFetching,
    refetch,
  } = useGetCashQuery<any>({
    page_size: page_size,
    page: Number(page) || undefined,
  });

  const dataLength =
    (transactionList?.data?.results as IGetCash[] | undefined)?.length ?? 0;

  const dataSource =
    (transactionList?.data?.results as IGetCash[] | undefined) ?? [];

  useEffect(() => {
    if (singleFeeForm) {
      const url = URL.createObjectURL(singleFeeForm);

      const newWindow = window.open("", "_blank");

      if (newWindow) {
        newWindow.document.write(`
              <html>
                <head>
                  <title>Financial Entries Report</title>
                </head>
                <body style="margin:0">
                  <iframe 
                    src="${url}" 
                    frameborder="0" 
                    style="width:100%;height:100vh;"
                  ></iframe>
                </body>
              </html>
            `);
        newWindow.document.close();
      }

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [singleFeeForm]);

  const handleForm = () => {
    getIncomeExpenseForm({
      month: filters.month,
      file_format: "pdf",
    });
  };

  return (
    <div className="space-y-6">
      {/* Expense Summary */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 h-full">
            <Statistic
              title={<span className="text-red-100">Total Expenses</span>}
              value={`৳${
                transactionList?.data?.reports?.overall?.expense?.toLocaleString() ||
                0
              }`}
              valueStyle={{
                color: "#fff",
                fontSize: "24px",
                fontWeight: "bold",
              }}
              prefix={<ArrowDownOutlined className="text-red-100" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 h-full">
            <Statistic
              title={<span className="text-red-100">Total Incomes</span>}
              value={`৳${
                transactionList?.data?.reports?.overall?.income?.toLocaleString() ||
                0
              }`}
              valueStyle={{
                color: "#fff",
                fontSize: "24px",
                fontWeight: "bold",
              }}
              prefix={<CalendarOutlined className="text-yellow-100" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 h-full">
            <Statistic
              title={
                <span className="text-red-100">
                  Expenses {dayjs(filters.month).format("MMMM YYYY")}
                </span>
              }
              value={`৳${
                transactionList?.data?.reports?.filtered?.expense?.toLocaleString() ||
                0
              }`}
              valueStyle={{
                color: "#fff",
                fontSize: "24px",
                fontWeight: "bold",
              }}
              prefix={<PieChartOutlined className="text-green-100" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 h-full">
            <Statistic
                 title={
                <span className="text-red-100">
                  Incomes {dayjs(filters.month).format("MMMM YYYY")}
                </span>
              }
              value={`৳${
                transactionList?.data?.reports?.filtered?.income?.toLocaleString() ||
                0
              }`}
              valueStyle={{
                color: "#fff",
                fontSize: "24px",
                fontWeight: "bold",
              }}
              prefix={<FileTextOutlined className="text-blue-100" />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {createPermission && (
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Card
              className="bg-white/60 backdrop-blur-sm border-blue-100 h-full"
              title={
                <div className="flex items-center">
                  <ArrowUpOutlined className="text-blue-600 mr-2" />
                  <span>Quick Income & Expense</span>
                </div>
              }
            >
              <CreateCash />
            </Card>
          </Col>
        )}

        {/* Expense List */}
        <Col xs={24} lg={24}>
          <Card
            title={
              <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col>
                  <h2 className="font-semibold text-lg">
                    Daily Income & Expense
                  </h2>
                </Col>

                <Col>
                  <Row gutter={[8, 8]} align="middle">
                    {/* Month Picker */}
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <MonthPicker
                        placeholder="Select month"
                        className="w-full"
                        defaultValue={dayjs(currentMonth, "YYYY-MM-DD")}
                        onChange={(date) => {
                          if (date) {
                            const formattedDate =
                              date.format("YYYY-MM") + "-01";
                            setFilters((prev) => ({
                              ...prev,
                              month: formattedDate,
                            }));
                          } else {
                            setFilters((prev) => ({
                              ...prev,
                              month: currentMonth,
                            }));
                          }
                        }}
                        format="MMMM YYYY"
                      />
                    </Col>

                    <Col>
                      <Button
                        title="Generate Pdf"
                        size="middle"
                        type="default"
                        style={{
                          color: "#c20a0a",
                          border: "1px solid gray",
                        }}
                        onClick={() => handleForm()}
                      >
                        <FaFilePdf /> Generate Pdf
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            }
            className="bg-white/60 backdrop-blur-sm border-blue-100 h-full"
          >
            {/* <div className="mb-6">
              <Space size="middle">
                <Input
                  placeholder="Search expenses..."
                  prefix={<SearchOutlined />}
                  className="w-full"
                />
                <Select placeholder="Category" style={{ width: 180 }}>
                  <Option value="all">All Categories</Option>
                  <Option value="utilities">Utilities</Option>
                  <Option value="stationery">Stationery</Option>
                  <Option value="maintenance">Maintenance</Option>
                  <Option value="transport">Transportation</Option>
                  <Option value="food">Food & Beverage</Option>
                </Select>
              </Space>
            </div> */}
            {viewPermission ? (
              <Table
                rowKey={"id"}
                loading={isLoading || isFetching}
                refetch={refetch}
                total={dataLength}
                dataSource={dataSource}
                columns={columns}
              />
            ) : (
              <NoPermissionData />
            )}
          </Card>
        </Col>

      </Row>
    </div>
  );
};
