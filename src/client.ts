import axios, { AxiosInstance } from "axios";

export interface DataForSeoClient {
  post(endpoint: string, data: any[]): Promise<any>;
  get(endpoint: string): Promise<any>;
  postAndWait(postEndpoint: string, getEndpointPrefix: string, data: any[], maxRetries?: number): Promise<any>;
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

  const client: DataForSeoClient = {
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

    async get(endpoint: string): Promise<any> {
      try {
        const response = await instance.get(endpoint);
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

    async postAndWait(postEndpoint: string, getEndpointPrefix: string, data: any[], maxRetries = 30): Promise<any> {
      const postResult = await client.post(postEndpoint, data);
      const taskId = postResult.tasks?.[0]?.id;

      if (!taskId) {
        throw new Error(`Failed to get Task ID: ${JSON.stringify(postResult)}`);
      }

      // Polling loop
      for (let i = 0; i < maxRetries; i++) {
        // Wait 2 seconds between polls
        await new Promise(resolve => setTimeout(resolve, 2000));

        const getResult = await client.get(`${getEndpointPrefix}/${taskId}`);
        const task = getResult.tasks?.[0];

        if (task && task.status_code === 20000) {
          return getResult;
        }

        if (task && task.status_code !== 20100) {
          throw new Error(`Task failed with status ${task.status_code}: ${task.status_message}`);
        }
        
        // Still pending (20100)
      }

      throw new Error(`Task ${taskId} timed out after ${maxRetries * 2} seconds`);
    }
  };

  return client;
}
