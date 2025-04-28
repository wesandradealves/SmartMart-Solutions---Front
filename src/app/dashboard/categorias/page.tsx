'use client';

import { Table, message, Button, Input, Modal, Form } from 'antd';
import { fetchCategories, deleteCategory, updateCategory, createCategory } from '@/services/categoryService';
import { PageTitle } from '@/app/style';
import { useMetadata } from '@/hooks/useMetadata';
import { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import { useEffect, useState, useRef } from 'react';
import { updateProductDiscount } from '@/services/productService';

export interface Category {
  id: number;
  name: string;
  description?: string;
  total_products: number;
  discount_percentage: number;
}

const { TextArea } = Input;

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: 'Tem certeza que deseja deletar esta categoria?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: () => handleDelete(id),
    });
  };

  useMetadata({
    title: `SmartMart - Categorias (${total})`,
    ogTitle: `SmartMart - Categorias (${total})`,
  });

  const fetchData = async (page: number, pageSize: number, sortField: string, sortOrder: string) => {
    setLoading(true);
    try {
      const response = await fetchCategories(page, pageSize, sortField, sortOrder);
      setCategories(
        response.items.map((item: { id: number; name: string; description?: string; total_products?: number; discount_percentage?: number }) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          total_products: item.total_products ?? 0,
          discount_percentage: item.discount_percentage ?? 0,
        }))
      );
      setTotal(response.total);
      setPagination((prevPagination) => ({
        ...prevPagination,
        current: page,
        pageSize,
        total: response.total,
      }));
    } catch {
      message.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current || 1, pagination.pageSize || 2, 'id', 'asc');
  }, []);
  
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Category> | SorterResult<Category>[],
    extra: { currentDataSource: Category[] }
  ) => {
    const sortField = Array.isArray(sorter) ? 'name' : String(sorter.field || 'name');
    const sortOrder = Array.isArray(sorter)
      ? 'asc'
      : sorter.order === 'descend'
      ? 'desc'
      : 'asc';

    fetchData(pagination.current || 1, pagination.pageSize || 2, sortField, sortOrder);
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      message.success('Categoria deletada com sucesso');
      fetchData(pagination.current || 1, pagination.pageSize || 2, 'name', 'asc');
    } catch (error) {
      console.error(error);
    }
  };

  const handleFieldChange = (value: string, categoryId: number, field: 'name' | 'description') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  
    timeoutRef.current = setTimeout(async () => {
      try {
        if (field === 'name') {
          if (value.trim() !== "") {
            const response = await updateCategory(categoryId, { name: value.trim() });
            message.success('Nome da categoria atualizado com sucesso');
            setCategories((prevCategories) =>
              prevCategories.map((category) =>
                category.id === categoryId ? { ...category, name: response.name } : category
              )
            );
          } else {
            message.error('Nome da categoria não pode ser vazio');
          }
        } else if (field === 'description') {
          const updatedDescription = value.trim();
          if (updatedDescription !== "") {
            const response = await updateCategory(categoryId, { description: updatedDescription });
            message.success('Descrição da categoria atualizada com sucesso');
            setCategories((prevCategories) =>
              prevCategories.map((category) =>
                category.id === categoryId ? { ...category, description: updatedDescription } : category
              )
            );
          } else {
            message.error('Descrição não pode ser vazia');
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar campo:', error);
        message.error('Erro ao atualizar');
      }
    }, 1000);
  };
  
  
  const handleDiscountChange = (value: string, categoryId: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  
    timeoutRef.current = setTimeout(async () => {
      try {
        const formattedValue = value.replace(',', '.');
        const discount = parseFloat(formattedValue);
  
        if (!isNaN(discount)) {
          const response = await updateProductDiscount(categoryId, discount);
  
          if (response.success) {
            message.success('Desconto atualizado com sucesso');
          } else {
            message.error('Erro ao atualizar desconto');
          }
        } else {
          message.error('Valor de desconto inválido');
        }
      } catch (error) {
        console.error('Erro ao atualizar desconto:', error);
        message.error('Erro ao atualizar desconto');
      }
    }, 1000);
  };
  
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createCategory(values);
      message.success('Categoria criada com sucesso');
      setIsModalOpen(false);
      form.resetFields();
      fetchData(pagination.current || 1, pagination.pageSize || 2, 'name', 'asc');
    } catch (error) {
      message.error('Erro ao criar categoria');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (_: unknown, record: Category) => (
        <Input
          defaultValue={record.name}
          onChange={(e) => handleFieldChange(e.target.value, record.id, 'name')}
        />
      ),
    },
    {
      title: 'Total de Produtos',
      dataIndex: 'total_products',
      key: 'total_products',
      sorter: true,
    },
    {
      title: 'Descriçao',
      dataIndex: 'description',
      key: 'description',
      sorter: true,
      render: (_: unknown, record: Category) => (
        <TextArea
          defaultValue={record.description}
          onChange={(e) => handleFieldChange(e.target.value, record.id, 'description')}
          rows={4} 
        />
      ),
    },
    {
      title: 'Desconto Aplicado (%)',
      dataIndex: 'discount_percentage',
      key: 'discount_percentage',
      sorter: true,
      render: (_: unknown, record: Category) => (
        <Input
          type='number'
          defaultValue={record.discount_percentage}
          onChange={(e) => handleDiscountChange(e.target.value, record.id)}
          suffix="%"
        />
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: unknown, record: Category) => (
        <Button
          type="primary"
          danger
          htmlType="button"
          onClick={() => showDeleteConfirm(record.id)}
        >
          Deletar
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageTitle className='mb-4 font-bold text-2xl'>Categorias</PageTitle>
      <Button type="primary" onClick={() => setIsModalOpen(true)} className="mb-4 me-auto text-md rounded-none bg-blue-900 font-light flex items-center">
        Cadastrar nova
      </Button>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title="Cadastrar Categoria"
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome da categoria' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descrição">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="discount_percentage"
            label="Desconto (%)"
            rules={[{ type: 'number', min: 0, max: 100, message: 'Insira um valor entre 0 e 100' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
