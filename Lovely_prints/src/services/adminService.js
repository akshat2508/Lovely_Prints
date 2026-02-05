import api from "./api";

export const getOrganisations = async () => {
  const res = await api.get("/auth/organisations");
  return res.data.data;
};

export const getShopsByOrganisation = async (orgId) => {
  const res = await api.get(`/admin/organisations/${orgId}/shops`);
  return res.data.data;
};

export const updateShopStatus = async (shopId, is_active) => {
  const res = await api.patch(
    `/admin/shops/${shopId}/status`,
    { is_active }
  );
  return res.data.data;
};

export const getOrganisationAnalytics = async (organisationId) => {
  const res = await api.get(
    `/admin/analytics/${organisationId}`
  );
  return res.data;
};

export const getShopAnalytics = async (shopId) => {
  const res = await api.get(
    `/admin/shops/${shopId}/analytics`
  );
  return res.data;
};
export const getShopOrders = async (shopId) => {
  const res = await api.get(`/admin/shops/${shopId}/orders`);
  return res.data.data;
};
