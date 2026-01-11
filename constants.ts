
export const DEFAULT_LOGO = "https://i.postimg.cc/k47M9f28/logo-as.png";

export const getAppLogo = () => {
  return localStorage.getItem('psicolog_custom_logo') || DEFAULT_LOGO;
};

export const BRAND_COLORS = {
  primary: "#1e3a8a",   // Azul Marinho Real
  secondary: "#d4af37", // Dourado
  accent: "#b8860b",    // Dourado Escuro
  bg: "#f8fafc",        // Fundo suave
  text: "#0f172a"       // Texto principal (Azul quase preto)
};
