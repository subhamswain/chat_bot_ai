import { apiRequest } from "./client";

export function getFiles() {
  return apiRequest("/files/");
}

export async function uploadFile(file, conversationId) {
  const formData = new FormData();

  formData.append("file", file);

  if (conversationId) {
    formData.append(
      "conversation_id",
      conversationId
    );
  }

  const response = await fetch(
    "http://127.0.0.1:8000/api/files/",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      "File upload failed"
    );
  }

  return data;
}

export function deleteFile(id) {
  return apiRequest(`/files/${id}/`, {
    method: "DELETE",
  });
}