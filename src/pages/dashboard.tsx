import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  faMoneyBillWave,
  faUserPlus,
  faBuilding,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  ApplicationChartDatapoint,
  DashboardStats,
  ModerationCategory,
  TopEmployer,
} from "../model/dashboard_model";
import { dashboardService } from "../service/dashboard_service";
import CategoriesCard from "../components/categories_card";
import TopEmployersCard from "../components/top_employee_card";
import StatCard from "../components/stats_card";
import ApplicationsChartCard from "../components/application_chart_card";

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  icon: IconDefinition;
  iconBgColor: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ApplicationChartDatapoint[]>([]);
  const [topEmployers, setTopEmployers] = useState<TopEmployer[]>([]);
  const [moderationQueue, setModerationQueue] = useState<ModerationCategory[]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi tất cả API song song
        const [statsData, chartData, employersData, modQueueData] =
          await Promise.all([
            dashboardService.getDashboardStats(),
            dashboardService.getApplicationsChartData(),
            dashboardService.getTopEmployers(),
            dashboardService.getModerationQueue(),
          ]);

        // Cập nhật state với dữ liệu đã fetch
        setStats(statsData);
        setChartData(chartData);
        setTopEmployers(employersData);
        setModerationQueue(modQueueData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCardsDisplayData: StatCardProps[] = stats
    ? [
        {
          title: "DOANH THU HÔM NAY",
          value: String(stats.revenueToday.value),
          change: stats.revenueToday.change,
          changeColor: "success.main",
          icon: faMoneyBillWave,
          iconBgColor: "primary.main",
        },
        {
          title: "ỨNG VIÊN MỚI",
          value: String(stats.newCandidates.value),
          change: stats.newCandidates.change,
          changeColor: "success.main",
          icon: faUserPlus,
          iconBgColor: "error.main",
        },
        {
          title: "NHÀ TUYỂN DỤNG MỚI",
          value: String(stats.newEmployers.value),
          change: stats.newEmployers.change,
          changeColor: "success.main",
          icon: faBuilding,
          iconBgColor: "success.main",
        },
        {
          title: "VIỆC LÀM MỚI",
          value: String(stats.newJobs.value),
          change: stats.newJobs.change,
          changeColor: "success.main",
          icon: faBriefcase,
          iconBgColor: "warning.main",
        },
      ]
    : [];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="xl" sx={{textAlign: "left"}}>
        <Grid container spacing={3}>
          {/* Hàng 1: 4 Thẻ thống kê */}
          {statCardsDisplayData.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
              <StatCard {...item} />
            </Grid>
          ))}

          {/* Hàng 2: Biểu đồ và Chào mừng */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <ApplicationsChartCard data={chartData} />
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <CategoriesCard data={moderationQueue} />
          </Grid>

          {/* Hàng 3: Bảng và Danh sách */}
          <Grid size={{ xs: 12, lg: 12 }}>
            <TopEmployersCard data={topEmployers} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
