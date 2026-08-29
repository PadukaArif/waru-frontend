import { apiRequest } from "./api";

export interface BusinessInsight {
  category: string;
  summary: string;
  recommendations: string[];
}

export interface AIServiceResponse {
  message: string;
  insights?: BusinessInsight[];
}

export interface CreateSessionResponse {
  sessionId: string;
  title: string;
  response: AIServiceResponse;
}

export interface CreateSessionRequest {
  title?: string;
  message: string;
}

export interface SendMessageRequest {
  message: string;
}

export async function createAssistantSession(
  data: CreateSessionRequest
): Promise<CreateSessionResponse> {
  return apiRequest<CreateSessionResponse>("/assistant", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function sendAssistantMessage(
  sessionId: string,
  data: SendMessageRequest
): Promise<AIServiceResponse> {
  return apiRequest<AIServiceResponse>(`/assistant/${sessionId}/message`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
