import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { useGetProfileQuery } from "../modules/Profile/api/profileEndpoint";

interface WithPermissionProps {
  requiredPermission: string; // e.g. "blog", "role", "users"
  children: ReactNode;
}

const WithPermission = ({
  requiredPermission,
  children,
}: WithPermissionProps) => {
  const { data: profileData, isLoading, isError } = useGetProfileQuery();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !isError && profileData) {
      const rolePermissions =
        profileData?.data?.role?.roleModulePermissions || [];

      // ✅ check if any module.slug matches requiredPermission
      const hasModuleAccess = rolePermissions.some(
        (rp: any) =>
          rp?.module?.slug?.toLowerCase()?.trim() ===
          requiredPermission.toLowerCase().trim()
      );

      if (hasModuleAccess) {
        setHasAccess(true);
      } else {
        // ❌ no permission → redirect to home (or show 403)
        navigate("/");
      }
    }
  }, [profileData, isLoading, isError, navigate, requiredPermission]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-10">
        <Spin />
      </div>
    );

  if (isError) return <div>Error loading permissions</div>;

  return hasAccess ? <>{children}</> : <div>No access to this page</div>;
};

export default WithPermission;
