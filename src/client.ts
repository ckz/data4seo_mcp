import axios, { AxiosInstance } from "axios";

export interface DataForSeoClient {
  post(endpoint: string, data: any[]): Promise<any>;
  get(endpoint: string): Promise<any>;
  postAndWait(postEndpoint: string, getEndpointPrefix: string, data: any[], maxRetries?: number): Promise<any>;
}

export function createClient(login: string, password: string): DataForSeoClient {
  const auth = Buffer.from(`${login}:${password}`).toString("base64");
  
  const instance: AxiosInstance = axios.create({
    baseURL: "https://api.dataforseo.com/v3/",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });

  const client: DataForSeoClient = {
    async post(endpoint: string, data: any[]): Promise<any> {
      try {
        const cleanEndpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;
        const response = await instance.post(cleanEndpoint, data);
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
        const cleanEndpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;
        const response = await instance.get(cleanEndpoint);
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
      console.log(`[DataForSeo] POST ${postEndpoint} with data: ${JSON.stringify(data)}`);
      const postResult = await client.post(postEndpoint, data);
      const taskId = postResult.tasks?.[0]?.id;

      if (!taskId) {
        throw new Error(`Failed to get Task ID: ${JSON.stringify(postResult)}`);
      }

      console.log(`[DataForSeo] Task created: ${taskId}. Starting polling...`);

      // Polling loop
      for (let i = 0; i < maxRetries; i++) {
        // Wait 3 seconds between polls (give it a bit more time)
        await new Promise(resolve => setTimeout(resolve, 3000));

        const cleanPrefix = getEndpointPrefix.endsWith("/") ? getEndpointPrefix : `${getEndpointPrefix}/`;
        const getUrl = `${cleanPrefix}${taskId}`;
        console.log(`[DataForSeo] Polling task ${taskId} (Attempt ${i + 1}/${maxRetries}): GET ${getUrl}`);
        
        const getResult = await client.get(getUrl);
        const task = getResult.tasks?.[0];

        if (task) {
          console.log(`[DataForSeo] Task ${taskId} status: ${task.status_code} (${task.status_message})`);
          if (task.status_code === 20000) {
            // Check if result is actually there
            if (task.result !== null) {
              console.log(`[DataForSeo] Task ${taskId} completed successfully with result.`);
              return getResult;
            }
            console.log(`[DataForSeo] Task ${taskId} status 20000 but result is still null. Retrying...`);
          }

          if (task.status_code !== 20100 && task.status_code !== 20000) {
            throw new Error(`Task failed with status ${task.status_code}: ${task.status_message}`);
          }
        } else {
          console.log(`[DataForSeo] Task ${taskId} info not found in GET response.`);
        }
        
        // Still pending (20100)
      }

      throw new Error(`Task ${taskId} timed out after ${maxRetries * 3} seconds`);
    }

  };

  return client;
}
