import { useGetProfileQuery } from "../../modules/Profile/api/profileEndpoint";

export const usePermission = (moduleSlug: string) => {
  const { data: profileData } = useGetProfileQuery();
  const module = profileData?.data?.role?.roleModulePermissions?.find(
    (m: any) => m?.module?.slug?.toLowerCase() === moduleSlug.toLowerCase()
  );
  const permissions =
    module?.module?.permissions?.map((p: any) => p.slug) || [];
  return {
    canView: permissions.includes("view"),
    canCreate: permissions.includes("create"),
    canUpdate: permissions.includes("update"),
    canDelete: permissions.includes("delete"),
  };
};
