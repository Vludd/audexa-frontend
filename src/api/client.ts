const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5081"

export { API_BASE_URL }

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const headers = new Headers(options?.headers)

  if (!(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = `HTTP ${response.status}`

    try {
      const body = await response.json()

      if (typeof body?.message === "string") {
        message = body.message
      } else if (typeof body?.title === "string") {
        message = body.title
      }
    } catch {
      // Response does not contain JSON.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}