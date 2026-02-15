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

type RequestOptions = {
  url: string;
  method?: "get" | "post" | "put" | "delete" | "patch";
  payload?: unknown;
  contentType?: string;
  includeCredentials?: boolean;
};

const request = async <T>({
  url,
  method = "get",
  payload = null,
  contentType = "application/json",
  includeCredentials = true,
}: RequestOptions) => {
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
  async get<T>({ url, includeCredentials }: RequestOptions) {
    return await request<T>({ url, includeCredentials });
  },
  async post<T>({ url, payload, includeCredentials }: RequestOptions) {
    return await request<T>({
      url,
      method: "post",
      payload,
      includeCredentials,
    });
  },
  async put<T>({ url, payload, includeCredentials }: RequestOptions) {
    return await request<T>({
      url,
      method: "put",
      payload,
      includeCredentials,
    });
  },
  async delete<T>({ url, payload, includeCredentials }: RequestOptions) {
    return await request<T>({
      url,
      method: "delete",
      payload,
      includeCredentials,
    });
  },
  async uploadFile<T>({ url, payload, includeCredentials }: RequestOptions) {
    return await request<T>({
      url,
      method: "put",
      payload,
      contentType: (payload as File).type,
      includeCredentials,
    });
  },
  abort() {
    abortController.abort();
  },
};

export default FetchRequest;
