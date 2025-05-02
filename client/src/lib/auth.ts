import { User } from "@shared/schema";
import { apiRequest } from "./queryClient";
import { queryClient } from "./queryClient";

export async function login(username: string, password: string): Promise<User> {
  const response = await apiRequest("POST", "/api/login", { username, password });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to login");
  }
  
  await queryClient.invalidateQueries({ queryKey: ["/api/user/me"] });
  return response.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/logout", {});
  queryClient.invalidateQueries({ queryKey: ["/api/user/me"] });
}

export async function register(userData: {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}): Promise<User> {
  const response = await apiRequest("POST", "/api/register", userData);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to register");
  }
  return response.json();
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiRequest("GET", "/api/user/me", undefined);
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    return null;
  }
}

export async function updateUserProfile(userData: Partial<User>): Promise<User> {
  const response = await apiRequest("PATCH", "/api/user/profile", userData);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update profile");
  }
  
  await queryClient.invalidateQueries({ queryKey: ["/api/user/me"] });
  return response.json();
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const response = await apiRequest("POST", "/api/user/change-password", {
    currentPassword,
    newPassword,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to change password");
  }
}
