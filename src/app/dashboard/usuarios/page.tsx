"use client";

import { Table, message, Button, Input, Select } from "antd";
import { fetchUsers, updateUser, deleteUser, fetchRoles } from "@/services/userService";
import { useEffect, useState } from "react";
import { PageTitle } from "@/app/style";
import { Modal } from "antd";

export interface User {
  id: number;
  email: string;
  role: string;
  password?: string;
}
 /* eslint-disable @typescript-eslint/no-unused-vars */
const UsuariosPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>([]); 
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const data = await fetchUsers(page, pageSize);
      setUsers(data.items);
      setTotal(data.total);
      setPagination({ ...pagination, current: page, total: data.total });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRolesData = async () => {
    try {
      const rolesData = await fetchRoles();
      setRoles(rolesData);
    } catch (error) {
      console.log(error);
      message.error("Erro ao carregar roles");
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
    fetchRolesData(); // Fetch roles on component mount
  }, []);

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      message.success("Usuário deletado com sucesso");
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("Erro ao deletar usuário");
    }
  };

  const handleFieldChange = async (
    userId: number,
    field: string,
    value: string
  ) => {
    try {
      const updatedData = { [field]: value };
      await updateUser(userId, updatedData);
      message.success(`${field} atualizado com sucesso`);
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(`Erro ao atualizar ${field}`);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      render: (_: unknown, record: User) => (
        <Input
          defaultValue={record.email}
          onBlur={(e) => handleFieldChange(record.id, "email", e.target.value)}
        />
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_: unknown, record: User) => (
        <Select
          value={record.role}
          onChange={(value) => handleFieldChange(record.id, "role", value)}
          options={roles.map((role) => ({ value: role, label: role }))}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: User) => (
        <Button
          type="primary"
          danger
          onClick={() =>
            Modal.confirm({
              title: "Tem certeza que deseja deletar este usuário?",
              okText: "Sim",
              cancelText: "Não",
              onOk: () => handleDelete(record.id),
            })
          }
        >
          Deletar
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageTitle className="mb-4 font-bold text-2xl">Usuários</PageTitle>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={(pagination) =>
          fetchData(pagination.current || 1, pagination.pageSize || 10)
        }
      />
    </>
  );
};

export default UsuariosPage;