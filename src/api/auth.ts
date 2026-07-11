import { authFetch } from "../lib/api";

export type User = {
  id: number;
  email: string;
  name: string;
};

export type AuthResponse = {
  message: string;
  accessToken: string;
  user: User;
};

export type RegisterResponse = {
  message: string;
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};
export function signInRequest(email: string, password: string) {
  return authFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signUpRequest(name: string, email: string, password: string) {
  return authFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export type VerifyEmailResponse = {
  message: string;
};

export function verifyEmailRequest(email: string, code: string) {
  return authFetch<VerifyEmailResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function getMeRequest() {
  return authFetch<User>("/auth/me");
}

export function forgotPasswordRequest(email: string) {
  return authFetch<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export type ResetPasswordResponse = {
  message: string;
};

export function resetPasswordRequest(token: string, newPassword: string) {
  return authFetch<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}
