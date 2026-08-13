// lib/services/inventoryService.ts
import prisma from "@/lib/db";

// Get all inventory records with variant and warehouse details
export async function getAllInventory() {
  return prisma.inventory.findMany({
    include: {
      variant: {
        include: {
          product: {
            select: {
              name: true,
              media: { where: { primary: true }, take: 1 },
            },
          },
        },
      },
      warehouse: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

// Adjust stock quantity and record movement
export async function adjustInventory(
  inventoryId: string,
  quantityChange: number,
  reason: string,
  userId?: string,
) {
  const inventory = await prisma.inventory.findUnique({
    where: { id: inventoryId },
  });
  if (!inventory) throw new Error("Inventory not found");

  const newQuantity = inventory.quantity + quantityChange;
  if (newQuantity < 0) throw new Error("Insufficient stock");

  return prisma.$transaction(async (tx) => {
    // Update quantity
    await tx.inventory.update({
      where: { id: inventoryId },
      data: { quantity: newQuantity },
    });

    // Create movement record
    await tx.inventoryMovement.create({
      data: {
        inventoryId,
        quantityChange,
        reason,
        userId,
      },
    });

    return { success: true, newQuantity };
  });
}
