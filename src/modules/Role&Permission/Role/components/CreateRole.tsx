"use client";

import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Divider, Space, message } from "antd";

interface Permission {
  id: number;
  name: string;
}

interface Module {
  id: number;
  name: string;
  permission: Permission[];
}

interface RoleFormProps {
  modules: Module[];
  onSubmit: (data: any) => void; // expects JSON { name, modules: [{moduleId, permissionIds}] }
}

export const CreateRole: React.FC<RoleFormProps> = ({ modules, onSubmit }) => {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<number, number[]>
  >({});
  const [allSelected, setAllSelected] = useState(false);

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const all: Record<number, number[]> = {};
      modules.forEach((m) => (all[m.id] = m.permission.map((p) => p.id)));
      setSelectedPermissions(all);
      setAllSelected(true);
    } else {
      setSelectedPermissions({});
      setAllSelected(false);
    }
  };

  const toggleModule = (moduleId: number, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const copy = { ...prev };
      const module = modules.find((m) => m.id === moduleId);
      if (!module) return copy;
      if (checked) copy[moduleId] = module.permission.map((p) => p.id);
      else delete copy[moduleId];
      return copy;
    });
  };

  const togglePermission = (
    moduleId: number,
    permissionId: number,
    checked: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const copy = { ...prev };
      const perms = copy[moduleId] || [];
      if (checked) copy[moduleId] = [...perms, permissionId];
      else {
        copy[moduleId] = perms.filter((id) => id !== permissionId);
        if (copy[moduleId].length === 0) delete copy[moduleId];
      }
      return copy;
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const modulesPayload = Object.entries(selectedPermissions).map(
        ([moduleId, permissionIds]) => ({
          moduleId: Number(moduleId),
          permissionIds,
        })
      );

      if (!values.name || typeof values.name !== "string") {
        message.error("Role name is required and must be a string");
        return;
      }

      if (modulesPayload.length === 0) {
        message.error("Please select at least one permission");
        return;
      }

      // Send proper JSON
      const payload = {
        name: values.name,
        modules: modulesPayload,
      };

      onSubmit(payload); // <-- make sure your API call sends JSON
    });
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Role Name"
        name="name"
        rules={[{ required: true, message: "Role name is required" }]}
      >
        <Input placeholder="Enter role name" />
      </Form.Item>

      <Divider />
      <Checkbox
        checked={allSelected}
        onChange={(e) => toggleAll(e.target.checked)}
      >
        Select All Permissions
      </Checkbox>
      <Divider />

      <Space direction="vertical" size="middle" className="w-full">
        {modules.map((mod) => {
          const moduleSelected =
            selectedPermissions[mod.id]?.length === mod.permission.length;
          return (
            <div key={mod.id} className="border rounded p-3 mb-2">
              <Checkbox
                checked={moduleSelected}
                onChange={(e) => toggleModule(mod.id, e.target.checked)}
                className="flex items-center space-x-2 font-semibold"
              >
                <span>{mod.name}</span>
              </Checkbox>

              <div className="pl-6 mt-2 space-y-1 flex items-center justify-between">
                {mod.permission.map((p) => (
                  <Checkbox
                    key={p.id}
                    checked={
                      selectedPermissions[mod.id]?.includes(p.id) || false
                    }
                    onChange={(e) =>
                      togglePermission(mod.id, p.id, e.target.checked)
                    }
                    className="flex items-center space-x-2"
                  >
                    <span>{p.name}</span>
                  </Checkbox>
                ))}
              </div>
            </div>
          );
        })}
      </Space>

      <Divider />
      <Button type="primary" onClick={handleSubmit}>
        Create Role
      </Button>
    </Form>
  );
};
