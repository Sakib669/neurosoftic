// lib/services/customerService.ts
import prisma from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

// Get current user profile
export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  // Ensure email is string (it's always set in our app, but TypeScript sees nullable)
  return {
    ...user,
    email: user.email || "",
  };
}

// Update user profile (name, phone, email)
export async function updateUserProfile(
  userId: string,
  data: { name?: string; phone?: string; email?: string },
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
    },
  });
}

// Change password
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.passwordHash) throw new Error("Password not set");

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) throw new Error("Current password is incorrect");

  const newHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });
}

// Get all addresses for user
export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });
}

// Add new address
export async function addAddress(
  userId: string,
  data: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  },
) {
  if (data.isDefault) {
    // Unset existing default
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
  return prisma.address.create({
    data: {
      userId,
      ...data,
      isDefault: data.isDefault ?? false,
    },
  });
}

// Update an address
export async function updateAddress(
  addressId: string,
  userId: string,
  data: Partial<{
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }>,
) {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
  return prisma.address.update({
    where: { id: addressId },
    data,
  });
}

// Delete an address
export async function deleteAddress(addressId: string, userId: string) {
  // Ensure the address belongs to the user
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId)
    throw new Error("Address not found");
  return prisma.address.delete({ where: { id: addressId } });
}
