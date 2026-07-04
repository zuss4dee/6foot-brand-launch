/** Toggle pre-launch Time Vault across the storefront. */
export const IS_PRE_LAUNCH_MODE = true;

const VIP_ACCESS_KEY = "6foot_vip_access";

/** True when the Time Vault splash should be showing (client-only). */
export function isVaultExperience(pathname: string) {
  if (pathname === "/vault") return true;
  if (pathname === "/" && IS_PRE_LAUNCH_MODE) {
    return localStorage.getItem(VIP_ACCESS_KEY) !== "true";
  }
  return false;
}
