'use client';

import { Table, message, Popconfirm, Button } from 'antd';
import { fetchCategories, deleteCategory } from '@/services/categoryService';
import { PageTitle } from '@/app/style';
import { useMetadata } from '@/hooks/useMetadata';
import { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  total_products: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);  
  const [total, setTotal] = useState<number>(0);  
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10, 
    total: 0,
  });

  useMetadata({
    title: `SmartMart - Categorias (${total})`,
    ogTitle: `SmartMart - Categorias (${total})`,
  });

  const fetchData = async (page: number, pageSize: number, sortField: string, sortOrder: string) => {
    setLoading(true);
    try {
      const response = await fetchCategories(page, pageSize, sortField, sortOrder);
      setCategories(
        response.items.map((item: { id: number; name: string; total_products?: number }) => ({
          id: item.id,
          name: item.name,
          total_products: item.total_products ?? 0,
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
    fetchData(pagination.current || 1, pagination.pageSize || 2, 'name', 'asc');
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
    },
    {
      title: 'Total de Produtos',
      dataIndex: 'total_products',
      key: 'total_products',
      sorter: true,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: unknown, record: Category) => (  // Use "unknown" ou "object"
        <Popconfirm
          title="Tem certeza que deseja deletar esta categoria?"
          onConfirm={() => handleDelete(record.id)}
          okText="Sim"
          cancelText="Não"
        >
          <Button type="primary" danger>Deletar</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <PageTitle className='mb-4 font-bold text-2xl'>Categorias</PageTitle>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </>
  );
}
