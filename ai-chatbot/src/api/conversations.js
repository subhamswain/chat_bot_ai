import { apiRequest } from "./client";

export function getConversations() {
  return apiRequest("/conversations/");
}

export function getConversation(id) {
  return apiRequest(`/conversations/${id}/`);
}

export function createConversation(title = "New Chat") {
  return apiRequest("/conversations/", {
    method: "POST",
    body: JSON.stringify({
      title,
    }),
  });
}

export function updateConversation(id, data) {
  return apiRequest(`/conversations/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteConversation(id) {
  return apiRequest(`/conversations/${id}/`, {
    method: "DELETE",
  });
}

export function sendMessage(conversationId, message, options = {}) {
  return apiRequest(
    `/conversations/${conversationId}/messages/`,
    {
      method: "POST",
      body: JSON.stringify({
        message,
        model: options.model,
        web_search: options.webSearch,
        deep_think: options.deepThink,
        use_documents: options.useDocuments,
      }),
    }
  );
}