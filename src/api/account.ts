import { authFetch } from "../lib/api";

export type UpdateNameResponse = {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    createdAt: string;
  };
};

export type MessageResponse = {
  message: string;
};

export function updateNameRequest(name: string) {
  return authFetch<UpdateNameResponse>("/auth/me/name", {
    method: "PATCH",
    body: JSON.stringify({
      name,
    }),
  });
}

export function changePasswordRequest(
  currentPassword: string,
  newPassword: string,
) {
  return authFetch<MessageResponse>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
}

export function deleteAccountRequest() {
  return authFetch<MessageResponse>("/auth/me", {
    method: "DELETE",
  });
}
