import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
} from "@mui/material";
import { FileUploadResponse } from "../model/upload_file";
import uploadService from "../service/upload_file_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faImage,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

const FileUploadManager: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Lưu danh sách các file đã upload (để demo xóa)
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async (fileType: "cv" | "image") => {
    if (!selectedFile) {
      setError("Vui lòng chọn file trước.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await uploadService.uploadFile(selectedFile, fileType);

      setSuccess(`Upload ${fileType} thành công: ${result.fileName}`);
      setUploadedFiles((prev) => [...prev, result]);
      setSelectedFile(null);

      // Reset input
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (file: FileUploadResponse) => {
    const parts = file.filePath.split('/');
    
    if (parts.length < 3) {
      setError(`Đường dẫn file không hợp lệ: ${file.filePath}`);
      return;
    }

    const fileType = parts[1]; 
    const fileName = file.fileName;

    if (window.confirm(`Bạn có chắc muốn xóa file: ${fileName}?`)) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        await uploadService.deleteFile(fileType, fileName);
        setUploadedFiles((prev) => prev.filter(f => f.filePath !== file.filePath));
        setSuccess('Xóa file thành công.');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 800, margin: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Quản lý File Upload
        </Typography>

        {/* --- Phần Upload --- */}
        <Box component="div" sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<FontAwesomeIcon icon={faUpload} />}
          >
            Chọn File
            <input
              id="file-input"
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {selectedFile && (
            <Typography variant="body1" sx={{ display: "inline", ml: 2 }}>
              Đã chọn: {selectedFile.name} (
              {(selectedFile.size / 1024).toFixed(2)} KB)
            </Typography>
          )}

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpload("cv")}
              disabled={!selectedFile || loading}
              startIcon={<FontAwesomeIcon icon={faFile} />}
            >
              Upload CV
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleUpload("image")}
              disabled={!selectedFile || loading}
              startIcon={<FontAwesomeIcon icon={faImage} />}
            >
              Upload Ảnh
            </Button>
            {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        <Divider sx={{ my: 3 }} />

        {/* --- Phần Hiển thị/Xóa --- */}
        <Typography variant="h6" gutterBottom>
          Các file đã upload
        </Typography>
        <List>
          {uploadedFiles.length === 0 && (
            <ListItem>
              <ListItemText primary="Chưa có file nào được upload." />
            </ListItem>
          )}
          {uploadedFiles.map((file) => (
            <ListItem
              key={file.filePath}
              divider
              secondaryAction={
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => handleDelete(file)}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              }
            >
              <ListItemIcon>
                {file.contentType.startsWith("image") ? (
                  <FontAwesomeIcon icon={faImage} />
                ) : (
                  <FontAwesomeIcon icon={faFile} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={file.fileName}
                secondary={
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.filePath}
                  </a>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default FileUploadManager;
