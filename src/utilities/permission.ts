// src/utilities/permission.ts
export type OldPermission = {
  id?: number;
  codename?: string; // e.g. "create_blog"
  name?: string;
  status?: boolean; // true = allowed
};

export type ModulePermissionItem = {
  id?: number;
  name?: string; // e.g. "create"
  slug?: string; // optional
};

export type RoleModulePermission = {
  module: {
    id: number;
    name: string;
    slug: string; // e.g. "blog"
    permissions: ModulePermissionItem[]; // actions under that module
  };
};

function normalize(s?: string) {
  return (s || "").toLowerCase().trim();
}

/**
 * Detects whether the array is the "roleModulePermissions" shape or the old codename/status shape.
 */
function isModulePermissionsArray(arr: any[]): arr is RoleModulePermission[] {
  return Array.isArray(arr) && arr.length > 0 && !!arr[0]?.module;
}

function isOldCodenameArray(arr: any[]): arr is OldPermission[] {
  return Array.isArray(arr) && arr.length > 0 && (arr[0].codename !== undefined || arr[0].name !== undefined);
}

/**
 * Check if the given permissions (either roleModulePermissions or old codename list)
 * contains any permission for the given module slug/key.
 *
 * - permissions: either RoleModulePermission[] or OldPermission[]
 * - moduleKey: either module slug ("blog", "products") or a key from your moduleNames mapping
 *
 * Returns true if the user has *any* permission for that module.
 */
export const hasPermissionForModule = (permissions: any[] | undefined, moduleKey: string): boolean => {
  if (!permissions || !Array.isArray(permissions)) return false;
  const moduleSlug = normalize(moduleKey);

  // NEW shape: roleModulePermissions
  if (isModulePermissionsArray(permissions)) {
    return permissions.some((rp) => normalize(rp.module?.slug) === moduleSlug && Array.isArray(rp.module.permissions) && rp.module.permissions.length > 0);
  }

  // OLD shape: codename/status approach. We check any codename ending with _<module> and status true
  if (isOldCodenameArray(permissions)) {
    return permissions.some((p) => {
      const codename = normalize(p.codename ?? p.name);
      return !!codename && codename.endsWith(`_${moduleSlug}`) && (p.status ?? true);
    });
  }

  return false;
};

/**
 * Checks if user has full CRUD-type access for a module (view/add/change/delete).
 * Works with both shapes.
 */
export const hasFullModuleAccess = (permissions: any[] | undefined, moduleKey: string): boolean => {
  if (!permissions || !Array.isArray(permissions)) return false;
  const moduleSlug = normalize(moduleKey);
  const requiredActions = ["create", "view", "update", "delete"]; // adapt names if your app uses add/change/read etc.

  if (isModulePermissionsArray(permissions)) {
    const moduleObj = permissions.find((rp) => normalize(rp.module?.slug) === moduleSlug);
    if (!moduleObj) return false;
    const actionSet = new Set((moduleObj.module.permissions || []).map((p: any) => normalize(p.name)));
    return requiredActions.every((a) => actionSet.has(a));
  }

  if (isOldCodenameArray(permissions)) {
    return requiredActions.every((action) => 
      permissions.some((p) => {
        const codename = normalize(p.codename ?? p.name);
        return codename === `${action}_${moduleSlug}` && (p.status ?? true);
      })
    );
  }

  return false;
};

/**
 * GetPermission (flexible): checks for specific action+module in either shape.
 * - moduleName: "blog"
 * - action: "create" or "view" or "update" etc.
 */
export const GetPermission = (permissions: any[] | undefined, moduleName: string, action: string): boolean => {
  if (!permissions || !Array.isArray(permissions)) return false;
  const moduleSlug = normalize(moduleName);
  const actionName = normalize(action);

  if (isModulePermissionsArray(permissions)) {
    const moduleObj = permissions.find((rp) => normalize(rp.module?.slug) === moduleSlug);
    if (!moduleObj) return false;
    return (moduleObj.module.permissions || []).some((p: any) => normalize(p.name) === actionName);
  }

  if (isOldCodenameArray(permissions)) {
    const expected = `${actionName}_${moduleSlug}`;
    return permissions.some((p) => {
      const codename = normalize(p.codename ?? p.name);
      return codename === expected && (p.status ?? true);
    });
  }

  return false;
};




// import { actionNames, moduleNames, TPermission } from "./permissionConstant";

// // Fixed GetPermission function
// export const GetPermission = (
//   data: any,
//   moduleName: string,
//   action: string
// ): boolean => {
//   if (!data || !Array.isArray(data)) return false;
//   const existsPermission = data.find(
//     (item) =>
//       item.codename === `${action}_${moduleName}` ||
//       item.name.toLowerCase().includes(`${action}_${moduleName}`) ||
//       item.name.toLowerCase().includes(`${action} ${moduleName}`)
//   );

//   return !!existsPermission && existsPermission.status;
// };

// export const hasPermissionForModule = (
//   permissions: TPermission[],
//   moduleKey: keyof typeof moduleNames
// ): boolean => {
//   const module = moduleNames[moduleKey];

//   return Object.values(actionNames).some((action) => {
//     const codename = `${action}_${module}`;
//     return permissions.some(
//       (perm) => perm.codename === codename && perm.status
//     );
//   });
// };

// export const hasFullModuleAccess = (
//   permissions: TPermission[],
//   moduleName: string
// ): boolean => {
//   return ["view", "add", "change", "delete"].every((action) =>
//     permissions.some(
//       (perm) => perm.codename === `${action}_${moduleName}` && perm.status
//     )
//   );
// };

// export const generatePermissionCodeNames = (
//   actions: Record<string, string>,
//   modules: Record<string, string>
// ): string[] => {
//   const codenames: string[] = [];

//   Object.values(actions).forEach((action) => {
//     Object.values(modules).forEach((module) => {
//       codenames.push(`${action}_${module}`);
//     });
//   });

//   return codenames;
// };

// export const getMatchedPermissionNames = (
//   allCodenames: string[],
//   permissionData: any[]
// ): string[] => {
//   const matchedNames: string[] = [];

//   permissionData.forEach((permission) => {
//     if (allCodenames.includes(permission.codename)) {
//       matchedNames.push(permission);
//     }
//   });

//   return matchedNames;
// };
