// Messages d'erreur Better Auth traduits pour l'interface.
const messages: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou mot de passe incorrect.",
  EMAIL_NOT_VERIFIED:
    "Ton adresse e-mail n'est pas encore confirmée. Un nouveau lien vient de t'être envoyé.",
  USER_ALREADY_EXISTS: "Un compte existe déjà avec cette adresse e-mail.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Un compte existe déjà avec cette adresse e-mail.",
  PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 10 caractères.",
  PASSWORD_TOO_LONG: "Le mot de passe est trop long.",
  INVALID_TOKEN: "Ce lien n'est plus valable. Fais une nouvelle demande.",
  BANNED_USER: "Ce compte a été suspendu. Contacte le bureau du club.",
};

export function authErrorMessage(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return null;
  if (error.code && messages[error.code]) return messages[error.code];
  if (error.message?.toLowerCase().includes("unique")) return "Ce pseudo est déjà pris.";
  return "Une erreur est survenue. Réessaie dans un instant.";
}
