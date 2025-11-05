import { Box, Card, CardContent, Paper, Typography } from "@mui/material";
import { ApplicationChartDatapoint } from "../model/dashboard_model";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ApplicationsChartCardProps {
  data: ApplicationChartDatapoint[];
}

const ApplicationsChartCard: React.FC<ApplicationsChartCardProps> = ({
  data,
}) => (
  <Card component={Paper} elevation={3} sx={{ height: '100%' }}>
    <CardContent >
      <Typography sx={{textAlign: "center", fontWeight: "bold"}} variant="h6" gutterBottom>
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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="applications"
              name="Lượt nộp"
              stroke="#5e72e4"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

export default ApplicationsChartCard;
