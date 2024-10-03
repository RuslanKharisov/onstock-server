interface AuthenticatedUser extends User {
  error?: string;
  twoFactor?: boolean;
  success?: string;
}

type CreateSupplierCmd = {
  name: string;
  email: string;
  siteUrl: string | null;
};

interface JwtPayload {
  userId: string;
  username: string;
}
