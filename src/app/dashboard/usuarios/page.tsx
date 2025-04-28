"use client";

import { Table, message, Button, Input, Form, Modal } from "antd";
import { fetchUsers, updateUser, deleteUser, fetchRoles, createUser } from "@/services/userService";
import { useEffect, useState } from "react";
import { PageTitle } from "@/app/style";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { useMetadata } from "@/hooks/useMetadata";
import { exportUsersCSV, importUsersCSV } from '@/services/csvService';

export interface User {
  id: number;
  email: string;
  role: "admin" | "viewer";
  password?: string;
  username: string;
  created_at: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useMetadata({
    title: `SmartMart - Usuários`,
    ogTitle: `SmartMart - Usuários`,
  });

  const handleRoleChange = (value: string) => {
    const role = value || undefined;
    setSelectedRole(role ?? null);
    fetchData(1, pagination.pageSize || 10, role);
  };

  const fetchData = async (page: number, pageSize: number, role: string | null = null) => {
    setLoading(true);
    try {
      const data = await fetchUsers(page, pageSize, role || undefined);
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
    fetchData(1, pagination.pageSize, selectedRole);
    fetchRolesData();
  }, [selectedRole]);

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      message.success("Usuário deletado com sucesso");
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("Erro ao deletar usuário");
      console.error(error);
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
      console.error(error);
    }
  };

  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      const createdUser = await createUser(values);
      message.success(`Usuário criado com sucesso: ${createdUser.username}`);
      setIsModalOpen(false);
      form.resetFields();
      fetchData(pagination.current || 1, pagination.pageSize || 10);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Erro desconhecido ao criar usuário');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
        await exportUsersCSV();
        message.success('Usuários exportados com sucesso');
    } catch {
        message.error('Erro ao exportar usuários');
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
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (_: unknown, record: User) => (
        <Input
          defaultValue={record.username}
          onBlur={(e) => handleFieldChange(record.id, "username", e.target.value)}
        />
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_: unknown, record: User) => (
        <CustomSelect
          value={record.role}
          onChange={(value: string | number) => handleFieldChange(record.id, "role", String(value))}
          options={roles.map((role) => ({ value: role, label: role }))}
          placeholder="Selecione uma role" label={""} />
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
    <div>
      <PageTitle className="mb-4 font-bold text-2xl">Usuários</PageTitle>



      <Modal
        title="Cadastrar Usuário"
        open={isModalOpen}
        onOk={handleCreateUser}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Por favor, insira o nome do usuário' }]}
          >
            <Input
              onChange={(e) => {
                const value = e.target.value.toLowerCase().replace(/\s+/g, '');
                form.setFieldsValue({ username: value });
              }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[{ required: true, message: 'Por favor, insira o e-mail do usuário' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Senha"
            rules={[{ required: true, message: 'Por favor, insira a senha do usuário' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Por favor, selecione uma role' }]}
          >
            <CustomSelect
              options={roles.map((role) => ({ value: role, label: role }))}
              placeholder="Selecione uma role"
              value={selectedRole || ""}
              onChange={(selectedValue) => {
                setSelectedRole(String(selectedValue));
                form.setFieldsValue({ role: selectedValue });
              }} label={""} />
          </Form.Item>
        </Form>
      </Modal>

      <div className='flex justify-end items-center gap-4 mb-4'>
        <div className="flex items-center justify-end gap-4">
          <Button type="primary" onClick={() => setIsModalOpen(true)} className="text-md rounded-none bg-blue-900 font-light flex items-center">
            Cadastrar novo
          </Button>
          <Button type="primary" onClick={handleExportCSV} className="text-md rounded-none bg-blue-900 font-light flex items-center">
            Exportar CSV
          </Button>
          <input
            type="file"
            id="import-csv-input"
            style={{ display: 'none' }}
            accept=".csv"
            onChange={async (e) => {
                if (e.target.files?.[0]) {
                    try {
                        const messageResponse = await importUsersCSV(e.target.files[0]);
                        message.success(messageResponse);
                        fetchData(pagination.current || 1, pagination.pageSize || 10);
                    } catch {
                        message.error('Erro ao importar usuários');
                    }
                }
            }}
          />
          <Button
            type="primary"
            onClick={() => document.getElementById('import-csv-input')?.click()}
            className="text-md rounded-none bg-blue-900 font-light flex items-center"
          >
            Importar CSV
          </Button>
        </div>
        <div className="flex items-center justify-end gap-4">
          <p className='font-bold text-sm'>Filtrar por</p>
          <CustomSelect
            label="Filtrar por Role"
            placeholder='Selecione uma role'
            value={selectedRole || ''}
            onChange={handleRoleChange}
            options={roles.map((role) => ({
              value: role,
              label: role,
            }))}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={(pagination) =>
          fetchData(pagination.current || 1, pagination.pageSize || 10, selectedRole)
        }
      />
    </div>
  );
};

export default UsuariosPage;