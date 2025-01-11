export const errors = {
  user: {
    unauthorized_action: 'Action non autorisée.',
    no_access: 'Accès au compte impossible. Veuillez nous contacter.',
    password_mismatch:
      "Les champs 'mot de passe' et 'confirmer le mot de passe' ne correspondent pas. Veuillez vérifier et réessayer.",
    login_not_allowed:
      "Connexion non autorisée sur cette plateforme. Veuillez utiliser l'application mobile pour accéder à votre compte.",
    same_pwd: "Le nouveau mot de passe doit être différent de l'ancien",
  },
  auth: {
    invalid_code: "le code n'est pas valide",
    invalid_credentials: 'Email ou mot de passe invalide.',
    invalid_phone_or_password: 'Numéro de téléphone ou mot de passe invalide.',
    invalid_new_password: 'Les mots de passe saisis ne correspondent pas. Veuillez vérifier et réessayer.',
    code_used: 'Vous avez déjà utilisé ce code',
  },
  session: {
    jwt: 'Token manquant, expiré ou invalide',
  },
} as const;
