import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Container,
  Paper,
  Divider,
  CircularProgress, // Thêm component loading
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faUserPlus,
  faBuilding,
  faBriefcase,
  faFileLines,
  faTriangleExclamation,
  faHeadset,
  faStar,
  faChevronRight,
  faQuestionCircle, // Icon dự phòng
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  ApplicationChartDatapoint,
  DashboardStats,
  ModerationCategory,
  TopEmployer,
} from "../model/model";
import { dashboardService } from "../service/dashboard_service";

// --- Types cho Props của Component Con ---
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  icon: IconDefinition;
  iconBgColor: string;
}

interface ApplicationsChartCardProps {
  data: ApplicationChartDatapoint[];
}

interface TopEmployersCardProps {
  data: TopEmployer[];
}

interface CategoriesCardProps {
  data: ModerationCategory[];
}

// Component Thẻ Thống Kê
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeColor,
  icon,
  iconBgColor,
}) => (
  <Card component={Paper} elevation={3}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h5" component="div">
            {value}
          </Typography>
          <Typography sx={{ color: changeColor }} variant="body2">
            {change}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: iconBgColor, width: 56, height: 56 }}>
          <FontAwesomeIcon icon={icon} color="white" />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

// Component Biểu Đồ
const ApplicationsChartCard: React.FC<ApplicationsChartCardProps> = ({
  data,
}) => (
  <Card component={Paper} elevation={3}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        TỔNG QUAN LƯỢT NỘP HỒ SƠ
      </Typography>
      <Typography variant="body2" color="text.secondary">
        (+15%) nhiều hơn tháng trước
      </Typography>
      <Box
        sx={{
          height: 300,
          mt: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed grey",
          borderRadius: 1,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography color="text.secondary">
          {/* Bạn sẽ truyền 'data' vào thư viện biểu đồ của mình tại đây */}
          [Khu vực hiển thị biểu đồ - đã nhận {data.length} điểm dữ liệu]
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// Component Thẻ Chào Mừng (Không đổi)
const WelcomeCard: React.FC = () => {
  const imageUrl = "https://source.unsplash.com/random/800x600?abstract&wave";
  return (
    <Card
      component={Paper}
      elevation={3}
      sx={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        height: "100%",
        minHeight: 390,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
          pb: 4,
        }}
      >
        <Typography variant="h5" component="div" gutterBottom>
          CHÀO MỪNG, QUẢN TRỊ VIÊN!
        </Typography>
        <Typography variant="body1">
          Quản lý tin đăng, người dùng và xem các báo cáo chi tiết tại đây.
        </Typography>
      </CardContent>
    </Card>
  );
};

// Component Bảng Nhà Tuyển Dụng (Cập nhật để nhận 'data')
const TopEmployersCard: React.FC<TopEmployersCardProps> = ({ data }) => (
  <Card component={Paper} elevation={3}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        CÁC NHÀ TUYỂN DỤNG HÀNG ĐẦU
      </Typography>
    </CardContent>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>CÔNG TY</TableCell>
            <TableCell align="right">SỐ TIN ĐĂNG</TableCell>
            <TableCell align="right">TỔNG CHI TIÊU</TableCell>
            <TableCell align="right">LƯỢT XEM TIN</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.jobs}</TableCell>
              <TableCell align="right">{row.spend}</TableCell>
              <TableCell align="right">{row.views}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Card>
);

// Component Danh Sách Duyệt Nội Dung (Cập nhật để nhận 'data' và map icon)
const CategoriesCard: React.FC<CategoriesCardProps> = ({ data }) => {
  // Map 'type' từ API với icon cụ thể
  const iconMap: { [key: string]: IconDefinition } = {
    pending_jobs: faFileLines,
    reported_profiles: faTriangleExclamation,
    support_tickets: faHeadset,
    new_reviews: faStar,
    default: faQuestionCircle, // Icon dự phòng
  };

  return (
    <Card component={Paper} elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          DUYỆT NỘI DUNG
        </Typography>
      </CardContent>
      <List sx={{ p: 0 }}>
        {data.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <Divider variant="middle" component="li" />}
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="details">
                  <FontAwesomeIcon icon={faChevronRight} size="xs" />
                </IconButton>
              }
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Avatar sx={{ width: 34, height: 34 }}>
                  <FontAwesomeIcon
                    icon={iconMap[item.type] || iconMap.default}
                    size="sm"
                  />
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={item.primary} secondary={item.secondary} />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

// --- Component Dashboard Chính (Cập nhật logic fetch data) ---
const Dashboard: React.FC = () => {
  // --- State cho dữ liệu ---
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ApplicationChartDatapoint[]>([]);
  const [topEmployers, setTopEmployers] = useState<TopEmployer[]>([]);
  const [moderationQueue, setModerationQueue] = useState<ModerationCategory[]>(
    []
  );

  // --- State cho loading và error ---
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- useEffect để fetch data khi component mount ---
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
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần khi mount

  const statCardsDisplayData: StatCardProps[] = stats
    ? [
        {
          title: "DOANH THU HÔM NAY",
          value: stats.revenueToday.value,
          change: stats.revenueToday.change,
          changeColor: "success.main",
          icon: faMoneyBillWave,
          iconBgColor: "primary.main",
        },
        {
          title: "ỨNG VIÊN MỚI (HÔM NAY)",
          value: stats.newCandidates.value.toLocaleString("vi-VN"),
          change: stats.newCandidates.change,
          changeColor: "success.main",
          icon: faUserPlus,
          iconBgColor: "error.main",
        },
        {
          title: "NHÀ TUYỂN DỤNG MỚI",
          value: `+${stats.newEmployers.value.toLocaleString("vi-VN")}`,
          change: stats.newEmployers.change,
          changeColor: "success.main",
          icon: faBuilding,
          iconBgColor: "success.main",
        },
        {
          title: "VIỆC LÀM MỚI (HÔM NAY)",
          value: stats.newJobs.value.toLocaleString("vi-VN"),
          change: stats.newJobs.change,
          changeColor: "success.main",
          icon: faBriefcase,
          iconBgColor: "warning.main",
        },
      ]
    : []; // Mảng rỗng nếu 'stats' chưa có

  // --- Render Trạng thái Loading ---
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Chiều cao toàn màn hình
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

  // --- Render Trạng thái Error ---
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

  // --- Render Giao diện chính khi có dữ liệu ---
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#f0f2f5", p: 3 }}>
      <Container maxWidth="xl">
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
            <WelcomeCard />
          </Grid>

          {/* Hàng 3: Bảng và Danh sách */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <TopEmployersCard data={topEmployers} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <CategoriesCard data={moderationQueue} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
