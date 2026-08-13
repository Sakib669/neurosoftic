// app/admin/audit-logs/page.tsx
import { getAuditLogs } from "@/lib/services/auditService";

export default async function AdminAuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      <p className="text-sm text-on-surface-variant">
        Recent administrative actions and security events.
      </p>

      <div className="rounded-lg border border-outline-variant bg-surface overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr className="border-b border-outline-variant">
              <th className="px-4 py-3 text-sm font-medium">User</th>
              <th className="px-4 py-3 text-sm font-medium">Action</th>
              <th className="px-4 py-3 text-sm font-medium">Entity</th>
              <th className="px-4 py-3 text-sm font-medium">Entity ID</th>
              <th className="px-4 py-3 text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-on-surface-variant">
                  No audit logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low">
                  <td className="px-4 py-3 text-sm">
                    {log.user ? log.user.name || log.user.email : "System"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{log.action}</td>
                  <td className="px-4 py-3 text-sm">{log.entity}</td>
                  <td className="px-4 py-3 text-sm">{log.entityId || "—"}</td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">
                    {log.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}