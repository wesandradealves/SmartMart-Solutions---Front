'use client';

import { Table, message, Button, Input, Modal, Form } from 'antd';
import { fetchCategories, deleteCategory, updateCategory, createCategory } from '@/services/categoryService';
import { PageTitle } from '@/app/style';
import { useMetadata } from '@/hooks/useMetadata';
import { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import { useEffect, useState, useRef } from 'react';
import { updateProductDiscount } from '@/services/productService';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { exportCategoriesCSV, importCategoriesCSV } from '@/services/csvService';

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
    let sortField = 'id';
    let sortOrder = 'asc';
    if (!Array.isArray(sorter) && sorter.field) {
      sortField = String(sorter.field);
      sortOrder = sorter.order === 'descend' ? 'desc' : 'asc';
    }
    fetchData(pagination.current || 1, pagination.pageSize || 10, sortField, sortOrder);
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
      const createdCategory = await createCategory(values);
      message.success(`Categoria criada com sucesso: ${createdCategory.name}`); // Display category name in success message
      setIsModalOpen(false);
      form.resetFields();
      fetchData(pagination.current || 1, pagination.pageSize || 2, 'name', 'asc');
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      if (error instanceof Error) {
        message.error(error.message); // Exibe a mensagem de erro detalhada
      } else {
        message.error('Erro desconhecido ao criar categoria');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportCategoriesCSV();
      message.success('Categorias exportadas com sucesso');
    } catch {
      message.error('Erro ao exportar categorias');
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
        <CustomSelect
          label="Desconto"
          value={record.discount_percentage.toString()}
          onChange={(value) => handleDiscountChange(value, record.id)}
          options={Array.from({ length: 101 }, (_, i) => ({
            value: i.toString(),
            label: `${i}%`,
          }))}
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
    <div>
      <PageTitle className='mb-4 font-bold text-2xl'>Categorias</PageTitle>
      <div className='flex justify-end items-center gap-4 mb-4'>
        <Button type="primary" onClick={() => setIsModalOpen(true)} className="text-md rounded-none bg-blue-900 font-light flex items-center">
          Cadastrar nova
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
                const messageResponse = await importCategoriesCSV(e.target.files[0]);
                message.success(messageResponse);
                fetchData(pagination.current || 1, pagination.pageSize || 10, 'id', 'asc');
              } catch {
                message.error('Erro ao importar categorias');
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
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const numericValue = parseFloat(value);
                  if (!value || (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Insira um número válido entre 0 e 100'));
                },
              }),
            ]}
          >
            <Input
              type="text"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                form.setFieldValue('discount_percentage', value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
