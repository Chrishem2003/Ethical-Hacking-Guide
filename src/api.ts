const API_BASE = import.meta.env.VITE_API_URL || '';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requiresAuth = true, headers = {}, ...rest } = options;

  const token = localStorage.getItem('hackforge_access_token');
  const customHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (requiresAuth && token) {
    customHeaders['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE}${endpoint}`, {
    ...rest,
    headers: customHeaders,
  });

  // Handle 401: Auto-refresh JWT
  if (response.status === 401 && requiresAuth) {
    const refreshToken = localStorage.getItem('hackforge_refresh_token');

    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem('hackforge_access_token', data.access_token);
          customHeaders['Authorization'] = `Bearer ${data.access_token}`;

          // Retry original request
          response = await fetch(`${API_BASE}${endpoint}`, {
            ...rest,
            headers: customHeaders,
          });
        } else {
          // Token expired, clear auth
          localStorage.removeItem('hackforge_access_token');
          localStorage.removeItem('hackforge_refresh_token');
        }
      } catch (err) {
        console.error('Refresh token failed:', err);
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}
