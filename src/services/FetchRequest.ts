import { logout } from "../utils/authentication";

const abortController = new AbortController();
const { signal } = abortController;

const processPayload = (payload: unknown) => {
  if (!payload) {
    return null;
  }

  if (payload instanceof File) {
    return payload;
  }

  return JSON.stringify(payload);
};

const request = async <T>(
  url: string,
  method: string,
  payload: unknown = null,
  contentType: string = "application/json",
  includeCredentials: boolean = true,
) => {
  const res = await fetch(
    url.startsWith("https://") ? url : `${import.meta.env.VITE_API_URL}/${url}`,
    {
      method,
      headers: {
        "Content-Type": contentType,
      },
      body: processPayload(payload),
      credentials: includeCredentials ? "include" : "omit",
      signal,
    },
  );
  if (res.ok) {
    return res.status === 204 ? null : ((await res.json()) as T);
  } else {
    if (res.status === 401) {
      await logout();
    }
    throw new Error(
      `Request error: ${url}: ${res.status}: ${JSON.stringify(
        await res.text(),
      )}`,
    );
  }
};

const FetchRequest = {
  async get<T>(url: string) {
    return await request<T>(url, "get");
  },
  async post<T>(url: string, body: unknown = null) {
    return await request<T>(url, "post", body);
  },
  async put<T>(url: string, body: unknown) {
    return await request<T>(url, "put", body);
  },
  async delete<T>(
    url: string,
    body: unknown = null,
    includeCredentials: boolean = true,
  ) {
    return await request<T>(
      url,
      "delete",
      body,
      "application/json",
      includeCredentials,
    );
  },
  async uploadFile<T>(url: string, file: File) {
    return await request<T>(url, "put", file, file.type);
  },
  abort() {
    abortController.abort();
  },
};

export default FetchRequest;
