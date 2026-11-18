"use server";
import { httpClient } from "@/lib/axois/httpClient";

interface IDoctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
}

export const getDoctors = async () => {
  const doctors = await httpClient.get<IDoctor[]>("/doctors");
  return doctors;
};
