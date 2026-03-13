"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CreateUser from "@/components/admin/users/create-user/createuser";
import { getUserById } from "@/api/uaeadminlogin";

function UpdateUser() {
  const router = useRouter();
  const { id } = router.query;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      if (!id) return;

      const res = await getUserById(id);
      setUserData(res?.data?.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full py-12 text-center text-gray-500">
        Loading user...
      </div>
    );
  }

  return <CreateUser initialData={userData} />;
}

export default UpdateUser;
