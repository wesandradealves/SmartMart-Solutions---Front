'use client';

import { Table, message, Button } from 'antd';
import { fetchProducts, deleteProduct } from '@/services/productService';
import { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';
import { useMetadata } from '@/hooks/useMetadata';
import { PageTitle } from '@/app/style';
import { Modal } from 'antd';

export interface Product {
    id: number;
    name: string;
    price: number;
    brand: string;
    category_id: number;
    category: {
        name: string;
    };
}

const ProdutosPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const showDeleteConfirm = (id: number) => {
        Modal.confirm({
            title: 'Tem certeza que deseja deletar este produto?',
            okText: 'Sim',
            cancelText: 'Não',
            onOk: () => handleDelete(id),
        });
    };

    useMetadata({
        title: `SmartMart - Produtos (${total})`,
        ogTitle: `SmartMart - Produtos (${total})`,
    });

    const fetchData = async (page: number, pageSize: number, sortField: string, sortOrder: string) => {
        setLoading(true);
        try {
            const response = await fetchProducts(page, pageSize, sortField, sortOrder);
            setProducts(response.items);
            setTotal(response.total);
            setPagination((prevPagination) => ({
                ...prevPagination,
                current: page,
                pageSize,
                total: response.total,
            }));
        } catch {
            message.error('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current || 1, pagination.pageSize || 10, 'id', 'asc');
    }, []);

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<Product> | SorterResult<Product>[],
        extra: { currentDataSource: Product[] }
    ) => {
        const sortField = Array.isArray(sorter) ? 'name' : String(sorter.field || 'name');
        const sortOrder = Array.isArray(sorter)
            ? 'asc'
            : sorter.order === 'descend'
                ? 'desc'
                : 'asc';

        fetchData(pagination.current || 1, pagination.pageSize || 10, sortField, sortOrder);
    };

    const handleDelete = async (productId: number) => {
        try {
            await deleteProduct(productId);
            message.success('Produto deletado com sucesso');
            fetchData(pagination.current || 1, pagination.pageSize || 10, 'name', 'asc');
        } catch (error) {
            console.error(error);
            message.error('Erro ao deletar produto');
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
            title: 'Categoria',
            dataIndex: 'category',
            key: 'category',
            sorter: (a: Product, b: Product) => {
                const nameA = a.category?.name?.toLowerCase() || '';
                const nameB = b.category?.name?.toLowerCase() || '';
                return nameA.localeCompare(nameB);
            },
            render: (_: string, record: Product) => (
                <span>{record.category?.name}</span>
            ),
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_: unknown, record: Product) => (
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
            <PageTitle className='mb-4 font-bold text-2xl'>Produtos</PageTitle>
            <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
            />
        </>
    );
};

export default ProdutosPage;
