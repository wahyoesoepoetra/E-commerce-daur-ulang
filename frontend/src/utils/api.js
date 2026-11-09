export const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function apiRequest(path, options) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...options?.headers,
      },
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Tidak dapat terhubung ke API Laravel. Pastikan server berjalan dan CORS mengizinkan aplikasi React.",
        { cause: error },
      );
    }

    throw error;
  }

  const result = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const validationMessages = Object.values(result?.errors ?? {}).flat();
    const message = validationMessages.length
      ? validationMessages.join(" ")
      : result?.message || `Permintaan API gagal (${response.status}).`;

    throw new Error(message);
  }

  return result;
}
