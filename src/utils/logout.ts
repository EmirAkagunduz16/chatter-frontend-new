import router from "../components/Routes";
import client from "../constants/apollo-client";
import { authenticatedVar } from "../constants/authenticated";
import { clearToken } from "./token";

export const onLogout = async () => {
  authenticatedVar(false);
  clearToken();
  await router.navigate("/login", { replace: true });
  await client.clearStore();
};
