import { useEffect, useState, useCallback } from "react";

export const getAuthHeaders = (role = "client") => {
  let authToken = localStorage.getItem("bagisto_client_token");

  if (role == "admin") {
    authToken = localStorage.getItem("bagisto_admin_token");
  }

  authToken = "Bearer " + authToken;
  const headers = {
    "Content-Type": "application/json",
    Authorization: authToken,
  };
  return headers;
};

export const getAuthAdminHeader = () => {
  return getAuthHeaders("admin");
};

export const useFetch = (url, role = "client") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          signal,
          headers: getAuthHeaders(role),
        });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [url],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => controller.abort();
  }, [fetchData]);

  const refetch = () => {
    const controller = new AbortController();
    fetchData(controller.signal);
  };

  return { data, loading, error, refetch };
};

export const useClientFetch = (url) => {
  return useFetch(url, "client");
};

export const useAdminFetch = (url) => {
  return useFetch(url, "admin");
};

export const useMutation = (url, method = "POST", role = "client") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const mutate = async (body) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(role),
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const json = await res.json();
      setResponse(json);
      return json;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, response };
};

export const useClientMutation = (url, method) => {
  return useMutation(url, method, "client");
};

export const useAdminMutation = (url, method) => {
  return useMutation(url, method, "admin");
};

export const useLazyFetch = (baseUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (params = {}) => {
      const controller = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams(params).toString();
        const url = query ? `${baseUrl}?${query}` : baseUrl;

        const res = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          headers: getAuthHeaders(),
        });

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}`);
        }

        const json = await res.json();
        setData(json);
        return json;
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    [baseUrl],
  );

  return { data, loading, error, fetchData };
};
