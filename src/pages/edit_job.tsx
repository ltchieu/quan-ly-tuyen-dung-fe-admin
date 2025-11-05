import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
} from '@mui/material';
import { CreateJobRequest, JobDetailDto, SalaryDto, WorkplaceDto, UpdateJobRequest } from '../model/job_model';
import jobService from '../service/job_service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';

type JobFormState = CreateJobRequest;

const JobEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [fullJob, setFullJob] = useState<JobDetailDto | null>(null);
  const [formData, setFormData] = useState<Partial<JobFormState>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      const fetchJob = async () => {
        try {
          const job = await jobService.getJobById(id);
          setFullJob(job);
          
          setFormData({
            title: job.title,
            salary: job.salary,
            experience: job.experience,
            education: job.education,
            employmentType: job.employmentType,
            workMode: job.workMode,
            skills: job.skills,
            categories: job.categories,
            jobDetails: job.jobDetails,
            requirements: job.requirements,
            benefits: job.benefits,
            workplace: job.workplace,
            vacancies: job.vacancies,
            startDate: job.startDate,
            endDate: job.endDate,
          });
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditMode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      salary: {
        ...(prev.salary as SalaryDto),
        [name]: name === 'min' || name === 'max' ? Number(value) : value,
      },
    }));
  };

  const handleWorkplaceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      workplace: {
        ...(prev.workplace as WorkplaceDto),
        [name]: value,
      },
    }));
  };
  
  const handleArrayChange = (name: 'skills' | 'categories', value: string) => {
     setFormData((prev) => ({
      ...prev,
      [name]: value.split(',').map(s => s.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditMode && id) {
        await jobService.updateJob(id, formData as UpdateJobRequest);
        setSuccess('Cập nhật công việc thành công!');
      } else {
        await jobService.createJob(formData as CreateJobRequest);
        setSuccess('Tạo công việc thành công!');
      }
      setTimeout(() => navigate(-1), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !fullJob) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;
  }

  return (
    <Container sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 900, margin: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Chỉnh sửa Công việc' : 'Tạo Công việc mới'}
        </Typography>

        {isEditMode && fullJob && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>Thông tin (Chỉ xem)</Typography>
            <Grid container spacing={2}>
              <Grid size={{xs: 12, sm: 6}}>
                <TextField label="Công ty" value={fullJob.companySnapshot.name || ''} disabled fullWidth />
              </Grid>
              <Grid size={{xs: 12, sm: 3}}>
                <TextField label="Trạng thái" value={fullJob.status || ''} disabled fullWidth />
              </Grid>
               <Grid size={{xs: 12, sm: 3}}>
                <TextField label="Lượt xem" value={fullJob.views || 0} disabled fullWidth />
              </Grid>
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Typography variant="h6" gutterBottom>Thông tin (Chỉnh sửa)</Typography>
          <Grid container spacing={3}>
            <Grid size={{xs: 12}}>
              <TextField fullWidth label="Tiêu đề Công việc" name="title" value={formData.title || ''} onChange={handleChange} required />
            </Grid>
            
            <Grid size={{xs: 12, sm: 4}}>
              <TextField fullWidth label="Lương Tối thiểu" name="min" value={formData.salary?.min || 0} onChange={handleSalaryChange} type="number" required />
            </Grid>
            <Grid size={{xs: 12, sm: 4}}>
              <TextField fullWidth label="Lương Tối đa" name="max" value={formData.salary?.max || 0} onChange={handleSalaryChange} type="number" required />
            </Grid>
             <Grid size={{xs: 12, sm: 4}}>
              <TextField fullWidth label="Loại lương" name="type" value={formData.salary?.type || 'range'} onChange={handleSalaryChange} required />
            </Grid>
            
             <Grid size={{xs: 12, sm: 6}}>
              <TextField fullWidth label="Kỹ năng (ngăn cách bằng dấu phẩy)" name="skills" value={formData.skills?.join(', ') || ''} onChange={(e) => handleArrayChange('skills', e.target.value)} />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField fullWidth label="Danh mục (ngăn cách bằng dấu phẩy)" name="categories" value={formData.categories?.join(', ') || ''} onChange={(e) => handleArrayChange('categories', e.target.value)} />
            </Grid>

            <Grid size={{xs: 12, sm: 4}}>
              <TextField fullWidth label="Địa chỉ" name="address" value={formData.workplace?.address || ''} onChange={handleWorkplaceChange} />
            </Grid>
            <Grid size={{xs: 12, sm: 4}}>
              <TextField fullWidth label="Quận/Huyện" name="district" value={formData.workplace?.district || ''} onChange={handleWorkplaceChange} />
            </Grid>
            <Grid size={{xs: 12, sm: 4}}>
              <TextField fullWidth label="Thành phố" name="city" value={formData.workplace?.city || ''} onChange={handleWorkplaceChange} />
            </Grid>

             <Grid size={{xs: 12}}>
              <TextField fullWidth label="Chi tiết Công việc" name="jobDetails" value={formData.jobDetails || ''} onChange={handleChange} multiline rows={5} />
            </Grid>
            <Grid size={{xs: 12}}>
              <TextField fullWidth label="Yêu cầu" name="requirements" value={formData.requirements || ''} onChange={handleChange} multiline rows={5} />
            </Grid>
            <Grid size={{xs: 12}}>
              <TextField fullWidth label="Phúc lợi" name="benefits" value={formData.benefits || ''} onChange={handleChange} multiline rows={5} />
            </Grid>
          </Grid>

          {success && <Alert severity="success" sx={{ mt: 3 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Lưu thay đổi' : 'Tạo công việc')}
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading}>
              Hủy
            </Button>
          </Box>
        </Box>
        
        {isEditMode && fullJob && fullJob.applicants.length > 0 && (
          <Box mt={4}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Danh sách ứng viên ({fullJob.applicants.length})</Typography>
            <List>
              {fullJob.applicants.map(app => (
                <ListItem key={app.id} divider>
                  <ListItemIcon>
                    <Avatar src={app.applicantSnapshot.avatar || undefined}>
                       {!app.applicantSnapshot.avatar && <FontAwesomeIcon icon={faPerson} />}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={app.applicantSnapshot.fullName}
                    secondary={app.applicantSnapshot.email}
                  />
                  <Chip label={app.status} color={app.status === 'Interview' ? 'primary' : 'default'} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default JobEdit;