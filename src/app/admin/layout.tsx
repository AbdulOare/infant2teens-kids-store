import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-logo">KidStore Admin</p>
        <nav className="admin-nav">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/brands">Brands</Link>
          <Link href="/admin/coupons">Coupons</Link>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
