interface AuthenticatedUser extends User {
  error?: string;
  twoFactor?: boolean;
  success?: string;
}

export type Profile = {
  id?: string;
  name?: string;
  email?: string;
  image?: string | null;
  role?: Role;
};

type CreateSupplierCmd = {
  name: string;
  email: string;
  siteUrl: string | null;
};

interface JwtPayload {
  sub: string;
  name: string;
  iat: Date;
  exp: Date;
}
