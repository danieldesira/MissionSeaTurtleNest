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
  contentType: string = "application/json"
) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
    method,
    headers: {
      "Content-Type": contentType,
    },
    body: processPayload(payload),
    credentials: "include",
  });
  if (res.ok) {
    return res.status === 204
      ? null
      : contentType === "application/json"
      ? ((await res.json()) as T)
      : await res.text();
  } else {
    if (res.status === 401) {
      // to-do : send logout custom event
    }
    throw new Error(
      `Request error: ${url}: ${res.status}: ${JSON.stringify(
        await res.text()
      )}`
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
  async delete<T>(url: string) {
    return await request<T>(url, "delete");
  },
  async uploadFile<T>(url: string, file: File) {
    return await request<T>(url, "put", file, file.type);
  },
};

export default FetchRequest;
