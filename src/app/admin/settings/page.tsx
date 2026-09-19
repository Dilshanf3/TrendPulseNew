export default function AdminSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-bold text-admin-text">Settings</h1>
      <div className="max-w-lg rounded-sm border border-admin-border bg-admin-surface p-5 shadow-sm">
        <p className="text-sm text-admin-text-muted">
          Store settings such as shipping rates, tax rules, and payment configuration will appear here.
        </p>
      </div>
    </div>
  );
}
