import { useRef, useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import {
  useGetDashboardDataQuery,
  useGetFeeReportQuery,
  useGetOverviewAttendanceReportQuery,
} from "../api/dashoboardEndPoints";

import dayjs from "dayjs";


// const { Title } = Typography;

// const { Option } = Select;

const Dashboard = () => {
  const { data: dashboardData } = useGetDashboardDataQuery({});

  const [feeFilterParams, setFeeFilterParams] = useState({
    filter: "daily",
    year: dayjs().year(),
    month: dayjs().month() + 1,
    grade_level_id: undefined,
  });

  const [filterParams, setFilterParams] = useState({
    filter: "daily",
    year: dayjs().year(),
    month: dayjs().month() + 1,
    type: "student",
  });

  const { data: attendanceData } =
    useGetOverviewAttendanceReportQuery(filterParams);
  const { data: feeData } = useGetFeeReportQuery(feeFilterParams);

  const { chart_data: chartData } = attendanceData?.data || {};
  const { chart_data: feeChartData } = feeData?.data || {};

  const performanceChartRef = useRef<HTMLDivElement>(null);

  // Initialize Performance Chart
  useEffect(() => {
    if (!performanceChartRef.current) return;

    const options = {
      series: [
        {
          name: "Performance",
          data: [85, 72, 86, 81, 84, 86, 94, 60, 62, 76, 71, 66],
        },
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: true,
        },
        toolbar: {
          show: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#3B82F6"],
      },
      markers: {
        size: 5,
        colors: ["#3B82F6"],
        strokeWidth: 0,
        hover: {
          size: 7,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        min: 50,
        max: 100,
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
        },
        title: {
          text: "Score (%)",
          style: {
            color: "#6B7280",
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " %";
          },
        },
      },
      grid: {
        borderColor: "#F3F4F6",
        strokeDashArray: 4,
      },
    };

    const chart = new ApexCharts(performanceChartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return <div className="p-4">Hello Optionia</div>;
};

export default Dashboard;
