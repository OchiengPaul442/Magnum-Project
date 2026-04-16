"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isAxiosError } from "axios";

import { authApi } from "@/lib/api/auth";
import { captureError } from "@/lib/logging";
import {
  extractProfile,
  extractRefreshToken,
  extractToken,
} from "@/lib/auth/session";
import {
  clearAuthSession,
  getAuthToken,
  getRefreshToken,
  setAuthSession,
} from "@/lib/auth/storage";

interface AuthContextValue {
  token: string | null;
  refreshToken: string | null;
  profile: Record<string, unknown> | null;
  isLoading: boolean;
  login: (payload: { username: string; password: string }) => Promise<unknown>;
  verifyOtp: (payload: { username: string; otp: string }) => Promise<unknown>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  setProfile: React.Dispatch<
    React.SetStateAction<Record<string, unknown> | null>
  >;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getAuthToken();
    const storedRefresh = getRefreshToken();
    let isActive = true;

    const restoreSession = async () => {
      if (storedToken) {
        if (!isActive) return;
        setToken(storedToken);
        setRefreshToken(storedRefresh);
        setIsLoading(false);
        return;
      }

      if (storedRefresh) {
        try {
          const response = await authApi.refreshToken(storedRefresh);
          const nextToken = extractToken(response);
          const nextRefresh = extractRefreshToken(response) ?? storedRefresh;

          if (nextToken && isActive) {
            setAuthSession(nextToken, nextRefresh);
            setToken(nextToken);
            setRefreshToken(nextRefresh);
          }
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 401) {
            clearAuthSession();
            if (isActive) {
              setToken(null);
              setRefreshToken(null);
              setIsLoading(false);
            }
            return;
          }

          captureError(error, { source: "auth-bootstrap-refresh" });
          clearAuthSession();
          if (isActive) {
            setToken(null);
            setRefreshToken(null);
          }
        }
      }

      if (isActive) {
        setIsLoading(false);
      }
    };

    void restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await authApi.getProfile();
      setProfile(extractProfile(response));
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        return;
      }

      captureError(error, { source: "auth-profile" });
    }
  }, []);

  const login = useCallback(
    async (payload: { username: string; password: string }) => {
      const response = await authApi.login(payload);
      const extractedToken = extractToken(response);
      const extractedRefresh = extractRefreshToken(response);

      if (extractedToken) {
        setAuthSession(extractedToken, extractedRefresh);
        setToken(extractedToken);
        setRefreshToken(extractedRefresh ?? null);
        await fetchProfile();
      }

      return response;
    },
    [fetchProfile],
  );

  const verifyOtp = useCallback(
    async (payload: { username: string; otp: string }) => {
      const response = await authApi.verifyOtp(payload);
      const extractedToken = extractToken(response);
      const extractedRefresh = extractRefreshToken(response);
      if (extractedToken) {
        setAuthSession(extractedToken, extractedRefresh);
        setToken(extractedToken);
        setRefreshToken(extractedRefresh ?? null);
        await fetchProfile();
      }
      return response;
    },
    [fetchProfile],
  );

  const refreshSession = useCallback(async () => {
    if (!refreshToken) return;
    try {
      const response = await authApi.refreshToken(refreshToken);
      const nextToken = extractToken(response);
      const nextRefresh = extractRefreshToken(response) ?? refreshToken;
      if (nextToken) {
        setAuthSession(nextToken, nextRefresh);
        setToken(nextToken);
        setRefreshToken(nextRefresh);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearAuthSession();
        setToken(null);
        setRefreshToken(null);
        setProfile(null);
        return;
      }

      captureError(error, { source: "auth-refresh" });
      clearAuthSession();
      setToken(null);
      setRefreshToken(null);
    }
  }, [refreshToken]);

  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      captureError(error, { source: "auth-logout" });
    } finally {
      clearAuthSession();
      setToken(null);
      setRefreshToken(null);
      setProfile(null);
    }
  }, [refreshToken]);

  const logoutAll = useCallback(async () => {
    try {
      await authApi.logoutAll();
    } catch (error) {
      captureError(error, { source: "auth-logout-all" });
    } finally {
      clearAuthSession();
      setToken(null);
      setRefreshToken(null);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (token && !profile) {
      void fetchProfile();
    }
  }, [token, profile, fetchProfile]);

  const value = useMemo(
    () => ({
      token,
      refreshToken,
      profile,
      isLoading,
      login,
      verifyOtp,
      refreshSession,
      logout,
      logoutAll,
      setProfile,
    }),
    [
      token,
      refreshToken,
      profile,
      isLoading,
      login,
      verifyOtp,
      refreshSession,
      logout,
      logoutAll,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
