type ApiError = Error & {
  status?: number;
};

const configuredApiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

if (!configuredApiBaseUrl) {
  throw new Error("Missing EXPO_PUBLIC_API_URL in frontend .env");
}

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");
const API_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 10000);

let authToken: string | null = null;

export function setApiAuthToken(token: string | null) {
  authToken = token;
}

function parseJson(text: string) {
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const headers = new Headers(options.headers);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("API request timed out. Please check the backend URL.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const payload = parseJson(await response.text());

  if (!response.ok) {
    const error = new Error(
      payload?.message ?? `Request failed with status ${response.status}`,
    ) as ApiError;
    error.status = response.status;
    throw error;
  }

  return payload as T;
}
