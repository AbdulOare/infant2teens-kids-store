import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CartIcon from "@/components/ui/CartIcon";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">KidStore</Link>

        <nav className="navbar-links">
          <Link href="/browse">Shop</Link>
          <Link href="/browse?age=infant">Infant</Link>
          <Link href="/browse?age=toddler">Toddler</Link>
          <Link href="/browse?age=kids">Kids</Link>
          <Link href="/browse?age=teens">Teens</Link>
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link href="/orders">Orders</Link>
              <Link href="/account">Account</Link>
            </>
          ) : (
            <Link href="/login">Sign in</Link>
          )}
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
