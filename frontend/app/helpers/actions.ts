"use server";

import { signIn, signOut, auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  generateProductDescription as apiGenerateDescription,
  fetchProductById as apiFetchProductById,
  adminApproveUser,
  adminRevokeUser,
  adminDeleteUser,
  adminRegenerateKey,
  adminUpdateUser,
  createPurchase as apiCreatePurchase,
  createStock as apiCreateStock,
  updateStock as apiUpdateStock,
  deleteStock as apiDeleteStock,
  fetchAllStocks as apiFetchAllStocks,
  fetchProducts as apiFetchProducts,
  fetchStockByProduct as apiFetchStockByProduct,
} from "@/app/helpers/api";

// ============================================================
// Auth actions
// ============================================================

export async function authenticate() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

/** Obtiene el admin token de la session actual o lanza error */
async function requireAdminToken(): Promise<string> {
  const session = await auth();
  if (!session?.user?.isAdmin || !session.user.adminToken) {
    throw new Error("Acceso denegado: se requiere token de administrador.");
  }
  return session.user.adminToken;
}

// ============================================================
// Product actions
// ============================================================

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createProductAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const features = formData.get("features") as string;
  const priceStr = formData.get("price") as string;
  const ai_description = formData.get("ai_description") as string;

  if (!name || name.trim().length < 2) {
    return { success: false, message: "El nombre es obligatorio (mínimo 2 caracteres)." };
  }

  const price = priceStr ? parseFloat(priceStr) : undefined;
  if (price !== undefined && (isNaN(price) || price < 0)) {
    return { success: false, message: "El precio debe ser un número positivo." };
  }

  const res = await apiCreateProduct({
    name: name.trim(),
    features: features?.trim() || undefined,
    price,
    ai_description: ai_description?.trim() || undefined,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Error al crear producto.", errors: res.errors };
  }

  revalidatePath("/dashboard/products");
  return { success: true, message: res.message || "Producto creado exitosamente." };
}

export async function updateProductAction(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const features = formData.get("features") as string;
  const priceStr = formData.get("price") as string;
  const ai_description = formData.get("ai_description") as string;

  if (!name || name.trim().length < 2) {
    return { success: false, message: "El nombre es obligatorio (mínimo 2 caracteres)." };
  }

  const price = priceStr ? parseFloat(priceStr) : undefined;
  if (price !== undefined && (isNaN(price) || price < 0)) {
    return { success: false, message: "El precio debe ser un número positivo." };
  }

  const res = await apiUpdateProduct(id, {
    name: name.trim(),
    features: features?.trim() || undefined,
    price,
    ai_description: ai_description?.trim() || undefined,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Error al actualizar producto.", errors: res.errors };
  }

  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${id}/edit`);
  return { success: true, message: res.message || "Producto actualizado exitosamente." };
}

export async function deleteProductAction(id: number): Promise<ActionState> {
  const res = await apiDeleteProduct(id);

  if (!res.success) {
    return { success: false, message: res.message || "Error al eliminar producto." };
  }

  revalidatePath("/dashboard/products");
  return { success: true, message: res.message || "Producto eliminado exitosamente." };
}

export async function generateDescriptionAction(id: number): Promise<ActionState> {
  const res = await apiGenerateDescription(id);

  if (!res.success) {
    return { success: false, message: res.message || "Error al generar descripción." };
  }

  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${id}/edit`);
  return { success: true, message: res.message || "Descripción generada exitosamente." };
}

// ============================================================
// Admin User actions
// ============================================================

export async function approveUserAction(id: number): Promise<ActionState> {
  const token = await requireAdminToken();
  const res = await adminApproveUser(token, id);

  if (!res.success) {
    return { success: false, message: res.message || "Error al aprobar usuario." };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true, message: res.message || "Usuario aprobado exitosamente." };
}

export async function revokeUserAction(id: number): Promise<ActionState> {
  const token = await requireAdminToken();
  const res = await adminRevokeUser(token, id);

  if (!res.success) {
    return { success: false, message: res.message || "Error al revocar usuario." };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true, message: res.message || "Acceso revocado exitosamente." };
}

export async function deleteUserAction(id: number): Promise<ActionState> {
  const token = await requireAdminToken();
  const res = await adminDeleteUser(token, id);

  if (!res.success) {
    return { success: false, message: res.message || "Error al eliminar usuario." };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true, message: res.message || "Usuario eliminado exitosamente." };
}

export async function regenerateKeyAction(id: number): Promise<ActionState> {
  const token = await requireAdminToken();
  const res = await adminRegenerateKey(token, id);

  if (!res.success) {
    return { success: false, message: res.message || "Error al regenerar API Key." };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true, message: res.message || "API Key regenerada exitosamente." };
}

export async function updateUserAction(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || name.trim().length < 2) {
    return { success: false, message: "El nombre es obligatorio (mínimo 2 caracteres)." };
  }

  if (!email || !email.includes("@")) {
    return { success: false, message: "El email no es válido." };
  }

  const token = await requireAdminToken();
  const res = await adminUpdateUser(token, id, {
    name: name.trim(),
    email: email.trim(),
  });

  if (!res.success) {
    return { success: false, message: res.message || "Error al actualizar usuario.", errors: res.errors };
  }

  revalidatePath("/dashboard/admin/users");
  return { success: true, message: res.message || "Usuario actualizado exitosamente." };
}

// ============================================================
// Purchase actions
// ============================================================

export async function createPurchaseAction(
  items: { product_id: number; quantity: number }[]
): Promise<ActionState> {
  if (!items || items.length === 0) {
    return { success: false, message: "El carrito está vacío." };
  }

  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return { success: false, message: "Debes iniciar sesión para realizar una compra." };
    }

    const userEmail = session.user.email;
    const userName = session.user.name || userEmail.split("@")[0];
    const userId = session.user.id;

    // 1. Registrar compra en el backend de Laravel (manejo de inventario y stock)
    const res = await apiCreatePurchase(userEmail, userName, items);

    if (!res.success || !res.data) {
      return { success: false, message: res.error || res.message || "Error al realizar la compra." };
    }

    // 2. Registrar compra en la base de datos del frontend (Prisma) para historial del usuario
    const backendPurchase = res.data;
    
    // Calcular total
    const total = backendPurchase.items?.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    ) || backendPurchase.total ? Number(backendPurchase.total) : 0;

    // Guardar en Prisma (incluye nombre de producto para evitar consultas N+1)
    await prisma.purchase.create({
      data: {
        userId: userId,
        total: total,
        status: backendPurchase.status || "pending",
        items: {
          create: items.map((item) => {
            const backendItem = backendPurchase.items?.find((bi) => bi.product_id === item.product_id);
            return {
              productId: item.product_id,
              productName: backendItem?.product?.name || `Producto #${item.product_id}`,
              quantity: item.quantity,
              unitPrice: backendItem ? Number(backendItem.unit_price) : 0,
              subtotal: backendItem ? Number(backendItem.subtotal) : 0,
            };
          }),
        },
      },
    });

    revalidatePath("/dashboard/mis-compras");
    revalidatePath("/dashboard/catalogo");
    return { success: true, message: res.message || "Compra realizada exitosamente." };
  } catch (e) {
    console.error("Error en createPurchaseAction:", e);
    return { success: false, message: e instanceof Error ? e.message : "Error al realizar la compra." };
  }
}

/**
 * Convert a string ID to a unique numeric hash
 */
function stringToNumericId(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Fetch user's purchases from Prisma database
 * Product names are stored in PurchaseItem — no extra API calls needed
 */
export async function fetchMyPurchasesAction(
  userId: string,
  options: { page?: number; per_page?: number } = {}
) {
  try {
    const page = options.page || 1;
    const perPage = options.per_page || 10;
    const skip = (page - 1) * perPage;

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where: { userId },
        include: {
          items: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
      }),
      prisma.purchase.count({ where: { userId } })
    ]);

    const lastPage = Math.ceil(total / perPage);

    // Map Prisma data to frontend Purchase interface format
    // Product names are stored directly in PurchaseItem — zero API calls
    const mappedPurchases = purchases.map(p => ({
      id: stringToNumericId(p.id),
      user_id: 0,
      total: p.total.toString(),
      status: p.status as "pending" | "completed" | "cancelled",
      created_at: p.createdAt.toISOString(),
      updated_at: p.updatedAt.toISOString(),
      items: p.items.map(item => ({
        id: stringToNumericId(item.id),
        purchase_id: stringToNumericId(p.id),
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice.toString(),
        subtotal: item.subtotal.toString(),
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
        product: { id: item.productId, name: item.productName } as { id: number; name: string },
      })),
      user: p.user ? {
        id: 0,
        name: p.user.name || '',
        email: p.user.email || '',
      } : undefined,
    }));

    return {
      data: mappedPurchases,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
      }
    };
  } catch (error) {
    console.error('Error fetching purchases from Prisma:', error);
    return {
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: options.per_page || 10,
        total: 0,
      }
    };
  }
}

// ============================================================
// Stock actions
// ============================================================

export async function createStockAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const product_id = Number(formData.get("product_id"));
    const stock = Number(formData.get("stock"));
    const unit_value = Number(formData.get("unit_value"));
    const sale_value = Number(formData.get("sale_value"));

    if (!product_id || isNaN(stock) || isNaN(unit_value) || isNaN(sale_value)) {
      return { success: false, message: "Datos inválidos." };
    }

    const res = await apiCreateStock({ product_id, stock, unit_value, sale_value });

    if (!res.success) {
      return {
        success: false,
        message: res.error || res.message || "Error al crear stock.",
        errors: res.errors,
      };
    }

    revalidatePath("/dashboard/admin/stock");
    return { success: true, message: res.message || "Stock creado exitosamente." };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Error al crear stock." };
  }
}

export async function updateStockAction(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data: { stock?: number; unit_value?: number; sale_value?: number } = {};

    const stock = formData.get("stock");
    const unit_value = formData.get("unit_value");
    const sale_value = formData.get("sale_value");

    if (stock) data.stock = Number(stock);
    if (unit_value) data.unit_value = Number(unit_value);
    if (sale_value) data.sale_value = Number(sale_value);

    if (Object.keys(data).length === 0) {
      return { success: false, message: "No hay datos para actualizar." };
    }

    const res = await apiUpdateStock(id, data);

    if (!res.success) {
      return {
        success: false,
        message: res.error || res.message || "Error al actualizar stock.",
        errors: res.errors,
      };
    }

    revalidatePath("/dashboard/admin/stock");
    return { success: true, message: res.message || "Stock actualizado exitosamente." };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Error al actualizar stock." };
  }
}

export async function deleteStockAction(id: number): Promise<ActionState> {
  try {
    const res = await apiDeleteStock(id);
    if (!res.success) {
      return { success: false, message: res.error || res.message || "Error al eliminar stock." };
    }
    revalidatePath("/dashboard/admin/stock");
    return { success: true, message: res.message || "Stock eliminado exitosamente." };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Error al eliminar stock." };
  }
}

// ============================================================
// Stock fetch actions (server-side data loading)
// ============================================================

export async function fetchStocksAction(params?: {
  search?: string;
  page?: number;
  per_page?: number;
}) {
  try {
    const res = await apiFetchAllStocks(params);
    return res;
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Error al cargar stocks.",
      data: [],
    };
  }
}

export async function fetchProductsAction(params?: {
  search?: string;
  page?: number;
  per_page?: number;
}) {
  try {
    const res = await apiFetchProducts(params);
    return res;
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Error al cargar productos.",
      data: [],
    };
  }
}

export async function fetchStockByProductAction(productId: number) {
  try {
    const res = await apiFetchStockByProduct(productId);
    return res;
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Error al verificar stock.",
      data: null,
    };
  }
}
