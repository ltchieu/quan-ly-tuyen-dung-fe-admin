import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  UpdateCompanyRequest,
  CompanyDetailDto,
  CompanyLocationDto,
} from "../model/company_model";
import companyService from "../service/company_service";

type FormDataType = Partial<UpdateCompanyRequest>;

const CompanyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataType>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID công ty không hợp lệ.");
      setLoading(false);
      return;
    }

    const fetchCompany = async () => {
      setLoading(true);
      try {
        const company: CompanyDetailDto = await companyService.getCompanyById(
          id
        );
        setFormData({
          name: company.name,
          website: company.website,
          email: company.email,
          phone: company.phone,
          employeeSize: company.employeeSize,
          businessField: company.businessField,
          taxCode: company.taxCode,
          foundedYear: company.foundedYear,
          introduction: company.introduction,
          vision: company.vision,
          mission: company.mission,
          coreValues: company.coreValues,
          logoUrl: company.logoUrl,
          coverUrl: company.coverUrl,
          images: company.images,
          benefits: company.benefits,
          location: company.location || undefined,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  // 2. Xử lý thay đổi form
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...(prev.location as CompanyLocationDto),
        [name]: value,
      },
    }));
  };

  // 3. Xử lý Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await companyService.updateCompany(id, formData);
      setSuccess("Cập nhật công ty thành công!");
      setTimeout(() => navigate(-1), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error != null) {
    return <Alert>{error}</Alert>;
  }

  return (
    <Container sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 900, margin: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Chỉnh sửa Công ty (ID: {id})
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Thêm các trường từ UpdateCompanyRequest */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Tên Công ty"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Quy mô"
                name="employeeSize"
                value={formData.employeeSize || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Mã số thuế"
                name="taxCode"
                value={formData.taxCode || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Giới thiệu"
                name="introduction"
                value={formData.introduction || ""}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.location?.address || ""}
                onChange={handleLocationChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Quận/Huyện"
                name="district"
                value={formData.location?.district || ""}
                onChange={handleLocationChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Thành phố"
                name="city"
                value={formData.location?.city || ""}
                onChange={handleLocationChange}
              />
            </Grid>

            {/* Thêm các trường khác (LogoUrl, CoverUrl, etc.) nếu cần */}
          </Grid>

          {success && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {success} {" "}
              Đang quay về trang danh sách các công ty
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

export default CompanyEdit;
