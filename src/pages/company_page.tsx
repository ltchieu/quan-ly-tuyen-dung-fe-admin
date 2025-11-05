import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  IconButton,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PendingCompanyDto, CompanyDetailDto } from "../model/company_model";
import companyService from "../service/company_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";

type TabType = "pending" | "all";
type VerifyDialogState = {
  open: boolean;
  isApprove: boolean;
  companyId: string | null;
};

const CompanyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<(PendingCompanyDto | CompanyDetailDto)[]>(
    []
  );

  // State cho filter của tab "Tất cả"
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all"); // 'all', 'true', 'false'

  // State cho dialog
  const [dialog, setDialog] = useState<VerifyDialogState>({
    open: false,
    isApprove: false,
    companyId: null,
  });
  const [rejectionReason, setRejectionReason] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === "pending") {
          const response = await companyService.getPendingCompanies(
            page,
            pageSize
          );
          setData(response.items);
          setTotalPages(response.totalPages);
        } else {
          // Xử lý filter cho tab "Tất cả"
          let verified: boolean | null = null;
          if (verifiedFilter === "true") verified = true;
          if (verifiedFilter === "false") verified = false;

          const response = await companyService.getAllCompanies(
            page,
            pageSize,
            verified
          );
          setData(response.items);
          setTotalPages(response.totalPages);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, page, pageSize, verifiedFilter]);

  // --- Handlers ---
  const handleTabChange = (event: React.SyntheticEvent, newValue: TabType) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const openVerifyDialog = (companyId: string, isApprove: boolean) => {
    setDialog({ open: true, isApprove, companyId });
  };

  const closeVerifyDialog = () => {
    setDialog({ open: false, isApprove: false, companyId: null });
    setRejectionReason("");
  };

  const handleVerifySubmit = async () => {
    if (!dialog.companyId) return;

    setLoading(true);
    try {
      await companyService.verifyCompany({
        companyId: dialog.companyId,
        approve: dialog.isApprove,
        rejectionReason: dialog.isApprove ? "" : rejectionReason,
      });
      closeVerifyDialog();
      setPage(1);
      setActiveTab("pending");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn XÓA công ty này? Hành động này không thể hoàn tác."
      )
    ) {
      setLoading(true);
      try {
        await companyService.deleteCompany(id);
        setPage(1);
        setActiveTab("all");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Quản lý Công ty
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 7, overflow: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab
              label="Công ty Chờ duyệt"
              value="pending"
              sx={{ textTransform: "none" }}
            />
            <Tab
              label="Tất cả Công ty"
              value="all"
              sx={{ textTransform: "none" }}
            />
          </Tabs>
        </Box>

        {/* Filter cho tab "Tất cả" */}
        {activeTab === "all" && (
          <Box sx={{ p: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Trạng thái duyệt</InputLabel>
              <Select
                value={verifiedFilter}
                label="Trạng thái duyệt"
                onChange={(e) => {
                  setVerifiedFilter(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="true">Đã duyệt (Verified)</MenuItem>
                <MenuItem value="false">Chưa duyệt/Từ chối</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f4f6f8" }}>
              {activeTab === "pending" ? (
                <RenderPendingHeader />
              ) : (
                <RenderAllHeader />
              )}
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {activeTab === "pending" && data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Không có công ty nào đang cần duyệt
                      </TableCell>
                    </TableRow>
                  )}

                  {activeTab === "all" && data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Không tìm thấy công ty nào
                      </TableCell>
                    </TableRow>
                  )}

                  {data.map((item) =>
                    activeTab === "pending" ? (
                      <RenderPendingRow
                        key={item.id}
                        item={item as PendingCompanyDto}
                        onApprove={openVerifyDialog}
                        onReject={openVerifyDialog}
                      />
                    ) : (
                      <RenderAllRow
                        key={item.id}
                        item={item as CompanyDetailDto}
                        onEdit={(id) => navigate(`/editCompany/${id}`)}
                        onDelete={handleDelete}
                      />
                    )
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      </Paper>

      {/* --- Dialog Duyệt/Từ chối --- */}
      <Dialog open={dialog.open} onClose={closeVerifyDialog}>
        <DialogTitle>
          {dialog.isApprove ? "Duyệt Công ty" : "Từ chối Công ty"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialog.isApprove
              ? "Bạn có chắc chắn muốn duyệt công ty này?"
              : "Vui lòng cung cấp lý do từ chối (bắt buộc)."}
          </DialogContentText>
          {!dialog.isApprove && (
            <TextField
              autoFocus
              margin="dense"
              label="Lý do từ chối"
              type="text"
              fullWidth
              variant="standard"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeVerifyDialog}>Hủy</Button>
          <Button
            onClick={handleVerifySubmit}
            color={dialog.isApprove ? "success" : "error"}
            disabled={!dialog.isApprove && !rejectionReason}
          >
            {dialog.isApprove ? "Duyệt" : "Từ chối"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const RenderPendingHeader: React.FC = () => (
  <TableRow>
    <TableCell sx={{ fontWeight: "bold" }}>Tên Công ty</TableCell>
    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
    <TableCell sx={{ fontWeight: "bold" }}>Mã số thuế</TableCell>
    <TableCell sx={{ fontWeight: "bold" }}>Người đăng ký</TableCell>
    <TableCell align="right" sx={{ fontWeight: "bold" }}>
      Hành động
    </TableCell>
  </TableRow>
);

const RenderPendingRow: React.FC<{
  item: PendingCompanyDto;
  onApprove: (id: string, approve: boolean) => void;
  onReject: (id: string, approve: boolean) => void;
}> = ({ item, onApprove, onReject }) => (
  <TableRow hover key={item.id}>
    <TableCell>{item.name}</TableCell>
    <TableCell>{item.email}</TableCell>
    <TableCell>{item.taxCode}</TableCell>
    <TableCell>{item.requestedBy?.fullName || "N/A"}</TableCell>
    <TableCell align="right">
      <IconButton color="success" onClick={() => onApprove(item.id, true)}>
        <FontAwesomeIcon icon={faThumbsUp} />
      </IconButton>
      <IconButton color="error" onClick={() => onReject(item.id, false)}>
        <FontAwesomeIcon icon={faThumbsDown} />
      </IconButton>
    </TableCell>
  </TableRow>
);

const RenderAllHeader: React.FC = () => (
  <TableRow>
    <TableCell sx={{ fontWeight: "bold" }}>Tên Công ty</TableCell>
    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
    <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
    <TableCell sx={{ fontWeight: "bold" }}>Đã duyệt</TableCell>
    <TableCell align="right" sx={{ fontWeight: "bold" }}>
      Hành động
    </TableCell>
  </TableRow>
);

const RenderAllRow: React.FC<{
  item: CompanyDetailDto;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ item, onEdit, onDelete }) => (
  <TableRow hover key={item.id}>
    <TableCell>{item.name}</TableCell>
    <TableCell>{item.email}</TableCell>
    <TableCell>
      <Chip
        label={item.isActive ? "Active" : "Inactive"}
        color={item.isActive ? "success" : "error"}
        size="small"
      />
    </TableCell>
    <TableCell>
      <Chip
        label={item.verified ? "Verified" : "Not Verified"}
        color={item.verified ? "success" : "default"}
        size="small"
      />
    </TableCell>
    <TableCell align="right">
      <IconButton color="primary" onClick={() => onEdit(item.id)}>
        <FontAwesomeIcon icon={faEdit} />
      </IconButton>
      <IconButton color="error" onClick={() => onDelete(item.id)}>
        <FontAwesomeIcon icon={faTrash} />
      </IconButton>
    </TableCell>
  </TableRow>
);

export default CompanyPage;
