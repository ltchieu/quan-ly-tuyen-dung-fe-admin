import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Paper,
  Typography,
} from "@mui/material";
import { StatCardProps } from "../pages/dashboard";

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeColor,
  icon,
  iconBgColor,
}) => (
  <Card
    component={Paper}
    elevation={3}
    sx={{ borderRadius: 6 }}
  >
    <CardContent>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="stretch"
        height="100%"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between" 
          height="100%"
          minHeight={0} 
          gap="8px"
        >
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h5" component="div">
              {value}
            </Typography>
          </Box>

          <Typography sx={{ color: changeColor }} variant="body2">
            {change}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: iconBgColor, width: 46, height: 46 }}>
          <FontAwesomeIcon icon={icon} color="white" />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
