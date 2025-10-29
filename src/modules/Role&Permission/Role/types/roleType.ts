export interface IRole {
  roleId: number;
  name: string;
  modules: {
    moduleId: number;
    permissionIds: number[];
  }[];
}
