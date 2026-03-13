"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Address } from "@/types/database";

interface AddressPickerProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function AddressPicker({ selected, onSelect }: AddressPickerProps) {
  const supabase = createClient();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (data) {
        setAddresses(data);
        const def = data.find((a) => a.is_default) ?? data[0];
        if (def) onSelect(def.id);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading addresses...</p>;

  if (addresses.length === 0) {
    return <p>No saved addresses. Please add one in your account settings.</p>;
  }

  return (
    <div className="address-picker">
      {addresses.map((address) => (
        <button
          key={address.id}
          onClick={() => onSelect(address.id)}
          className={`address-option ${selected === address.id ? "active" : ""}`}
        >
          <span className="address-label">{address.label ?? "Address"}</span>
          <span>{address.street}</span>
          <span>{address.city}, {address.state}</span>
        </button>
      ))}
    </div>
  );
}
