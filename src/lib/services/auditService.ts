// lib/services/auditService.ts
import prisma from "@/lib/db";

// Get all audit logs, most recent first
export async function getAuditLogs(limit = 100) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { name: true, email: true } },
    },
  });
}

// Optional: create an audit log entry (used by other services)
export async function createAuditLog(
  userId: string | null,
  action: string,
  entity: string,
  entityId?: string,
  metadata?: any
) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      metadata,
    },
  });
}