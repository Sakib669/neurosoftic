// lib/services/cmsService.ts
import prisma from "@/lib/db";

// Get all homepage sections ordered by sortOrder
export async function getHomepageSections() {
  return prisma.homepageSection.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

// Create a new section
export async function createHomepageSection(data: {
  type: string;
  title?: string;
  subtitle?: string;
  config?: any;
  sortOrder?: number;
  active?: boolean;
}) {
  return prisma.homepageSection.create({
    data: {
      type: data.type,
      title: data.title,
      subtitle: data.subtitle,
      config: data.config || {},
      sortOrder: data.sortOrder ?? 0,
      active: data.active ?? true,
    },
  });
}

// Update an existing section
export async function updateHomepageSection(
  id: string,
  data: Partial<{
    type: string;
    title: string;
    subtitle: string;
    config: any;
    sortOrder: number;
    active: boolean;
  }>
) {
  return prisma.homepageSection.update({
    where: { id },
    data,
  });
}

// Delete a section
export async function deleteHomepageSection(id: string) {
  return prisma.homepageSection.delete({
    where: { id },
  });
}

// Reorder sections (swap sortOrder of two sections)
export async function reorderHomepageSections(
  orderedIds: string[]
) {
  // Use a transaction to update sortOrder for each section
  return prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.homepageSection.update({
        where: { id },
        data: { sortOrder: index + 1 },
      })
    )
  );
}