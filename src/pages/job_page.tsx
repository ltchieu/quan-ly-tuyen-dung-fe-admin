import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Pagination,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { JobDto } from "../model/job_model";
import jobService from "../service/job_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEyeSlash,
  faGlobe,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

const PAGE_SIZE = 10;

const JobPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.getJobs(page, PAGE_SIZE);
      setJobs(data.items);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleEdit = (id: string) => {
    navigate(`/editJobs/${id}`);
  };

  const handleCreate = () => {
    navigate("/createJobs");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn XÓA công việc này?")) {
      try {
        await jobService.deleteJob(id);
        fetchJobs();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await jobService.publishJob(id);
      fetchJobs();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await jobService.unpublishJob(id);
      fetchJobs();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ m: 4 }}>
      <Box mb={2}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Quản lý Công việc
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f4f6f8" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Tiêu đề</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Công ty</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Lượt xem</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ứng tuyển</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không tìm thấy công việc nào.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id} hover>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {job.title}
                    </TableCell>
                    <TableCell>{job.companySnapshot.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          job.status === "published" ? "Đã đăng" : "Bản nháp"
                        }
                        color={
                          job.status === "published" ? "success" : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{job.views}</TableCell>
                    <TableCell>{job.applicationCount}</TableCell>
                    <TableCell align="right">
                      {job.status === "published" ? (
                        <Tooltip title="Gỡ đăng">
                          <IconButton
                            color="warning"
                            onClick={() => handleUnpublish(job.id)}
                          >
                            <FontAwesomeIcon
                              icon={faEyeSlash}
                              title="Unpublish job"
                            />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Đăng tuyển">
                          <IconButton
                            color="success"
                            onClick={() => handlePublish(job.id)}
                          >
                            <FontAwesomeIcon
                              icon={faGlobe}
                              title="Publish job"
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(job.id)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(job.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
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
    </Box>
  );
};

export default JobPage;
