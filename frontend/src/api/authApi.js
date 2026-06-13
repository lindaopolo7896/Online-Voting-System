import apiClient from "../services/apiClient";

export const registerOrganisation = async (data) => {
  const response = await apiClient.post("/organisations/register-org/", data);

  return response.data;
};
