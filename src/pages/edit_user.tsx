import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  CircularProgress,
  Alert,
  SelectChangeEvent,
  Avatar, // <-- Import Avatar
  Divider, // <-- Import Divider
} from "@mui/material";
// Import các kiểu DTO mới
import { UpdateUserRequest, UserDto } from "../model/user_model";
// Import các hàm service
import { getUserById, updateUser } from "../service/user_service";

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- STATE ---
  // State 1: Dùng để giữ toàn bộ dữ liệu chi tiết (read-only)
  const [fullUser, setFullUser] = useState<UserDto | null>(null);

  // State 2: Dùng cho các trường có thể chỉnh sửa
  const [formData, setFormData] = useState<Partial<UpdateUserRequest>>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 1. Tải dữ liệu người dùng
  useEffect(() => {
    if (!id) {
      setError("ID người dùng không hợp lệ.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await getUserById(id);

        // Cập nhật CẢ HAI state
        setFullUser(user); // Lưu data đầy đủ (có profile, address...)

        // Điền dữ liệu vào form (dạng phẳng)
        setFormData({
          fullName: user.profile.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // 2. Handler cho TextField & Switch (Đã đúng)
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 3. Handler cho Select (Đã đúng)
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4. Handler Submit (Đã đúng)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: UpdateUserRequest = {
        fullName: formData.fullName || "",
        email: formData.email || "",
        phone: formData.phone || "",
        role: formData.role || "candidate",
        isVerified: formData.isVerified || false,
      };

      await updateUser(id, updateData);
      setSuccess("Cập nhật người dùng thành công!");
      setTimeout(() => navigate(-1), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.email) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !success) {
    return (
      <Container sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 800, margin: "auto" }}>
        <Box display="flex" alignItems="center" mb={2} gap={2}>
          <Avatar
            src={fullUser?.profile?.avatar}
            sx={{ width: 60, height: 60 }}
          />
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="h4" gutterBottom>
              Chỉnh sửa Người dùng
            </Typography>

            <Typography textAlign="left" variant="body1" color="grey">User ID: {fullUser?.id}</Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* === PHẦN CÓ THỂ CHỈNH SỬA === */}
          <Typography variant="h6" gutterBottom>
            Thông tin Cập nhật
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  name="role"
                  value={formData.role || ""}
                  label="Vai trò"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="recruiter">Recruiter</MenuItem>
                  <MenuItem value="candidate">Candidate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isVerified || false}
                    onChange={handleChange}
                    name="isVerified"
                    disabled={loading}
                  />
                }
                label="Đã xác thực (Verified)"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* === PHẦN CHỈ XEM (READ-ONLY) === */}
          <Typography variant="h6" gutterBottom>
            Thông tin chi tiết (Chỉ xem)
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Giới tính"
                value={fullUser?.profile?.gender || "N/A"}
                disabled
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Ngày sinh"
                value={fullUser?.profile?.dateOfBirth || "N/A"}
                disabled
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Thành phố"
                value={fullUser?.profile?.address?.city || "N/A"}
                disabled
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Quận/Huyện"
                value={fullUser?.profile?.address?.district || "N/A"}
                disabled
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Địa chỉ"
                value={fullUser?.profile?.address?.street || "N/A"}
                disabled
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Bio"
                value={fullUser?.profile?.bio || "N/A"}
                disabled
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Company ID"
                value={fullUser?.companyId || "N/A"}
                disabled
                fullWidth
              />
            </Grid>
          </Grid>

          {/* --- NÚT BẤM VÀ THÔNG BÁO --- */}
          {success && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Lưu thay đổi"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Hủy
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserEdit;
