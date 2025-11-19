import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(response: Response) {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText}. ${body}`);
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await fetch(queryKey[0] as string);
        await throwIfResNotOk(response);
        return response.json();
      },
    },
  },
});

export async function apiRequest(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  await throwIfResNotOk(response);
  return response;
}
