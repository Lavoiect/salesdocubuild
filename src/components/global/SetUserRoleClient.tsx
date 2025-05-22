"use client";
import { useEffect } from "react";
import { useUserStore } from "@/lib/store/useUserStore";

type Props = {
  role: string;
};

export default function SetUserRoleClient({ role }: Props) {
  const setRole = useUserStore((state) => state.setRole);

  useEffect(() => {
    setRole(role);
    console.log("User role set to:", role);
  }, [role, setRole]);

  return null;
}
