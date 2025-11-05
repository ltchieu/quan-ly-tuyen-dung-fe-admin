export interface FileUploadResponse {
  fileName: string;
  filePath: string; 
  fileUrl: string;
  fileSize: number; 
  contentType: string;
  uploadedAt: string; 
}