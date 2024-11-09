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

type addOrUpdateProductCommand = {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  supplierId: number;
  email?: string;
};

/* без сортировки */

type Supplier = {
  id: number;
  name: string;
  email: string;
  siteUrl: string | null;
  userId: string;
  supplierTariff: supplierTariff;
} | null;

type supplierTariff = {
  id: 1;
  name: string;
  maxProducts: number;
  pricePerUnit: number;
};

type CreateSupplierCmd = {
  name: string;
  email: string;
  siteUrl: string | null;
};

type ProductListElement = {
  id: string;
  sku: string;
  name: string;
  description: string;
};

type CreateProductListElementCommand = {
  sku: string;
  name: string;
  description: string;
};

type DeleteProductListElementCommand = {
  id: string;
};

type addOrUpdateProductCommand = {
  sku: string;
  name: string;
  description: string;
  quantity: number | string;
  supplierId: number;
  email?: string;
};

type Stock = {
  id: string;
  sku: string;
  name?: string;
  description: string;
  quantity: number;
  supplier: string;
  email: string;
  siteUrl: string | null;
};

type StockListElementWithRelations = {
  id: string;
  supplierId: number;
  productId: string;
  quantity: number;
  product: {
    id: string;
    sku: string;
    name: string;
    description: string;
  };
  supplier: getSupplier;
};

type DeleteStockElementCommand = {
  id: string;
};

// заготовка для склада
type CreateStockElementCommand = {
  quantity: number;
  supplierId: number; // для connect к id поставщика
  productId: string; // для coonnect к id продукта, если он уже есть в базе
};

type getSupplier = {
  id: number;
  name: string;
  email: string;
  siteUrl: string | null;
  userId: string;
};
