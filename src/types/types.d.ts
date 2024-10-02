interface AuthenticatedUser extends User {
  error?: string;
  twoFactor?: boolean;
  success?: string;
}
