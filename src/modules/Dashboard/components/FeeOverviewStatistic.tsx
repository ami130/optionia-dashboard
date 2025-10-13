import { Card, DatePicker, Select } from "antd";
import { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import dayjs from "dayjs";

const { Option } = Select;

const FeeOverviewStatistic = ({
  feeChartData,
  filterParams,
  setFeeFilterParams,
}: any) => {
  const feeCollectionChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!feeCollectionChartRef.current || !feeChartData) return;

    const formattedLabels = feeChartData.labels.map((label: string) => {
      switch (filterParams.filter) {
        case "yearly":
          return label;
        case "monthly":
          // Expecting month names or "Jul 2025" formats already
          return label;
        case "weekly":
        case "daily":
        default:
          return `Day ${label}`;
      }
    });

    const options = {
      series: [
        {
          name: "Collected",
          data: feeChartData.datasets.collected || [],
        },
        {
          name: "Due",
          data: feeChartData.datasets.due || [],
        },
        {
          name: "Discount",
          data: feeChartData.datasets.discount || [],
        },
      ],
      chart: {
        type: "area",
        height: 350,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      colors: ["#10B981", "#F59E0B", "#6366F1"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      xaxis: {
        categories: formattedLabels,
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => `৳${(val / 1000).toFixed(1)}K`,
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
        },
        title: {
          text: "Amount (BDT)",
          style: {
            color: "#6B7280",
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `৳${val.toLocaleString()}`,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "14px",
      },
      grid: {
        borderColor: "#F3F4F6",
        strokeDashArray: 4,
      },
    };

    const chart = new ApexCharts(feeCollectionChartRef.current, options);
    chart.render();

    return () => chart.destroy();
  }, [feeChartData, filterParams]);
  return (
    <div>
      <Card
        title={
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
            <p className="text-base font-semibold">Fee Collection Trend</p>
            <div className="flex flex-wrap gap-2">
              {/* Filter Type */}
              <Select
                size="small"
                value={filterParams.filter}
                onChange={(val) =>
                  setFeeFilterParams((prev: any) => ({
                    ...prev,
                    filter: val,
                    // Optional: reset unrelated values
                    date: undefined,
                    year: dayjs().year(),
                    month: dayjs().month() + 1,
                  }))
                }
              >
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>

              {/* Year Picker */}
              {(filterParams.filter === "monthly" ||
                filterParams.filter === "yearly") && (
                <DatePicker
                  size="small"
                  picker="year"
                  value={dayjs(`${filterParams.year}`, "YYYY")}
                  onChange={(date) =>
                    setFeeFilterParams((prev: any) => ({
                      ...prev,
                      year: date?.year(),
                    }))
                  }
                />
              )}

              {/* Month Picker */}
              {filterParams.filter === "monthly" && (
                <DatePicker
                  size="small"
                  picker="month"
                  value={dayjs(`${filterParams.month}`, "M")}
                  onChange={(date) =>
                    setFeeFilterParams((prev: any) => ({
                      ...prev,
                      month: date?.month() + 1,
                    }))
                  }
                />
              )}

              {/* Daily / Weekly Date Picker */}
              {(filterParams.filter === "daily" ||
                filterParams.filter === "weekly") && (
                <DatePicker
                  size="small"
                  value={
                    filterParams.date
                      ? dayjs(filterParams.date, "YYYY-MM-DD")
                      : undefined
                  }
                  onChange={(date) =>
                    setFeeFilterParams((prev: any) => ({
                      ...prev,
                      date: date?.format("YYYY-MM-DD"),
                    }))
                  }
                />
              )}

            </div>
          </div>
        }
        bordered={false}
        className="h-full"
        headStyle={{ borderBottom: "1px solid #f0f0f0", padding: "0 16px" }}
        bodyStyle={{ padding: "16px" }}
      >
        <div ref={feeCollectionChartRef} style={{ minHeight: "300px" }} />
      </Card>
    </div>
  );
};

export default FeeOverviewStatistic;
