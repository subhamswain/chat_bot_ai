const API_BASE_URL = "http://127.0.0.1:8000/api";


export async function uploadDocument(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/documents/upload/`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  console.log("UPLOAD RESPONSE:", data);

  if (!response.ok) {
    throw new Error(
      data.error || "Document upload failed"
    );
  }

  return data;
}


export async function sendChatMessage(
  message,
  documentId = null
) {
  const response = await fetch(
    `${API_BASE_URL}/chat/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: message,
        document_id: documentId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Chat request failed"
    );
  }

  return data;
}