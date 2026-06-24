import apiClient from "../services/apiClient";

export const registerOrganisation = async (data) => {
  const response = await apiClient.post("/organisations/register-org/", data);
  return response.data;
};

export const requestOtp = async (email) => {
  const response = await apiClient.post("/auth/request-otp/", { email });
  return response.data;
};

export const verifyOtp = async ({ email, otp }) => {
  const response = await apiClient.post("/auth/verify-otp/", { email, code: otp });
  return response.data;
};

export const changePassword = async ({ old_password, new_password }) => {
  const response = await apiClient.post("/auth/change-password/", {
    old_password,
    new_password,
  });
  return response.data;
};
