import axios, { AxiosInstance } from "axios";

export interface DataForSeoClient {
  post(endpoint: string, data: any[]): Promise<any>;
  get(endpoint: string): Promise<any>;
  postAndWait(postEndpoint: string, getEndpointPrefix: string, data: any[], maxRetries?: number, delayMs?: number): Promise<any>;
}

export function createClient(login: string, password: string): DataForSeoClient {
  const auth = Buffer.from(`${login}:${password}`).toString("base64");
  
  const instance: AxiosInstance = axios.create({
    baseURL: "https://api.dataforseo.com/",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });

  const client: DataForSeoClient = {
    async post(endpoint: string, data: any[]): Promise<any> {
      try {
        const cleanEndpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;
        console.log(`[DataForSeo] POSTing to: ${instance.defaults.baseURL}${cleanEndpoint}`);
        const response = await instance.post(cleanEndpoint, data);
        return response.data;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error(`[DataForSeo] POST Error: ${error.response?.status} ${JSON.stringify(error.response?.data)}`);
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
        console.log(`[DataForSeo] GETting from: ${instance.defaults.baseURL}${cleanEndpoint}`);
        const response = await instance.get(cleanEndpoint);
        return response.data;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error(`[DataForSeo] GET Error: ${error.response?.status} ${JSON.stringify(error.response?.data)}`);
          throw new Error(
            `DataForSeo API error: ${error.response?.status} ${JSON.stringify(
              error.response?.data
            )}`
          );
        }
        throw error;
      }
    },

    async postAndWait(postEndpoint: string, getEndpointPrefix: string, data: any[], maxRetries = 30, delayMs = 5000): Promise<any> {
      const fixV3 = (e: string) => {
        let clean = e.startsWith("/") ? e.substring(1) : e;
        return clean.startsWith("v3/") ? clean : `v3/${clean}`;
      };

      const v3PostEndpoint = fixV3(postEndpoint);
      const v3GetEndpointPrefix = fixV3(getEndpointPrefix);

      console.log(`[DataForSeo] POST https://api.dataforseo.com/${v3PostEndpoint}`);
      const postResult = await client.post(v3PostEndpoint, data);
      const taskId = postResult.tasks?.[0]?.id;

      if (!taskId) {
        throw new Error(`Failed to get Task ID: ${JSON.stringify(postResult)}`);
      }

      console.log(`[DataForSeo] Task created: ${taskId}. Waiting ${delayMs}ms before first poll...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));

      // Polling loop
      for (let i = 0; i < maxRetries; i++) {
        const cleanPrefix = v3GetEndpointPrefix.endsWith("/") ? v3GetEndpointPrefix : `${v3GetEndpointPrefix}/`;
        const getUrl = `${cleanPrefix}${taskId}`;
        
        console.log(`[DataForSeo] Poll ${i + 1}/${maxRetries}: GET https://api.dataforseo.com/${getUrl}`);
        
        try {
          const getResult = await client.get(getUrl);
          const task = getResult.tasks?.[0];

          if (task) {
            console.log(`[DataForSeo] Task ${taskId} status: ${task.status_code} (${task.status_message})`);
            
            if (task.status_code == 20000) {
              if (task.result !== null) {
                console.log(`[DataForSeo] Task ${taskId} completed successfully.`);
                return getResult;
              }
              console.log(`[DataForSeo] Task ${taskId} status 20000 but result is still null. Retrying...`);
            } else if (task.status_code == 20100 || task.status_code == 40401) {
              console.log(`[DataForSeo] Task ${taskId} still pending or not indexed (${task.status_code})...`);
            } else {
              console.log(`[DataForSeo] Task ${taskId} failed with status: ${task.status_code}`);
              throw new Error(`Task failed with status ${task.status_code}: ${task.status_message}`);
            }
          }
        } catch (err: any) {
          console.error(`[DataForSeo] Poll error: ${err.message}`);
          if (!err.message.includes("40401") && !err.message.includes("404")) {
            throw err;
          }
          console.log(`[DataForSeo] Encountered 404/40401 error, retrying task ${taskId}...`);
        }
        
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      throw new Error(`Task ${taskId} timed out after polling.`);
    }

  };

  return client;
}
