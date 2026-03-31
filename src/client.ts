import axios, { AxiosInstance } from "axios";

export interface DataForSeoClient {
  post(endpoint: string, data: any[]): Promise<any>;
}

export function createClient(login: string, password: string): DataForSeoClient {
  const auth = Buffer.from(`${login}:${password}`).toString("base64");
  
  const instance: AxiosInstance = axios.create({
    baseURL: "https://api.dataforseo.com/v3",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });

  return {
    async post(endpoint: string, data: any[]): Promise<any> {
      try {
        const response = await instance.post(endpoint, data);
        return response.data;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            `DataForSeo API error: ${error.response?.status} ${JSON.stringify(
              error.response?.data
            )}`
          );
        }
        throw error;
      }
    },
  };
}
