import axios from "axios";
import type { CreateLinkPayload, SmartLink } from "../types/link";



const api = axios.create({
  baseURL:  import.meta.env.VITE_API_URL ||"http://localhost:5000/api",
  
});

export const getLinks = async (): Promise<SmartLink[]> => {
  const response = await api.get("/links");
  return response.data.data;
};

export const createLink = async (
  payload: CreateLinkPayload
): Promise<SmartLink> => {
  const response = await api.post("/links", payload);
  return response.data.data;
};

export const updateLink = async (
  id: string,
  payload: Partial<CreateLinkPayload> & { isActive?: boolean }
): Promise<SmartLink> => {
  const response = await api.patch(`/links/${id}`, payload);
  return response.data.data;
};

export const deleteLink = async (id: string): Promise<void> => {
  await api.delete(`/links/${id}`);
};

export const checkHealth = async (id: string) => {
  const response = await api.post(`/links/${id}/health`);
  return response.data.data;
};

export const getQR = async (id: string) => {
  const response = await api.get(`/links/${id}/qr`);
  return response.data.data as {
    shortUrl: string;
    qrCode: string;
  };
};

export const getAnalytics = async (id: string) => {
  const response = await api.get(`/links/${id}/analytics`);
  return response.data.data;
};

export default api;