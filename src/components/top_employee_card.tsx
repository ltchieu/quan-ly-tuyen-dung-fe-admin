import { Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { TopEmployer } from "../model/model";


interface TopEmployersCardProps {
  data: TopEmployer[];
}
const TopEmployersCard: React.FC<TopEmployersCardProps> = ({ data }) => (
  <Card component={Paper} elevation={3}>
    <CardContent sx={{textAlign: "center"}}>
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

export default TopEmployersCard