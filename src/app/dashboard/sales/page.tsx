'use client';

import { Table, message, Button, Input, Modal, Form, TablePaginationConfig } from 'antd';
import { useEffect, useState } from 'react';
import { fetchSales, createSale, updateSale, deleteSale, exportSalesCSV, importSalesCSV } from '@/services/salesService';
import { fetchProducts } from '@/services/productService';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { PageTitle } from '@/app/style';
import { ColumnType, FilterValue, SorterResult } from 'antd/es/table/interface';
import type { SaleWithProductName } from '@/services/salesService';

const SalesPage = () => {
    const [sales, setSales] = useState<SaleWithProductName[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    useEffect(() => {
        fetchData(pagination.current || 1, pagination.pageSize || 2, 'id', 'asc', selectedProduct);
        const loadProducts = async () => {
            try {
                const response = await fetchProducts(1, 100, 'name', 'asc');
                setProducts(response.items);
            } catch {
                message.error('Erro ao carregar produtos');
            }
        };
        loadProducts();
    }, [selectedProduct]);

    const handleProductChange = (value: string) => {
        const productId = value ? parseInt(value) : null;
        setSelectedProduct(productId);
        fetchData(1, pagination.pageSize || 10, 'product_id', 'asc', productId);
    };

    const fetchData = async (page: number, pageSize: number, sortBy = 'id', sortOrder = 'asc', productId?: number | null) => {
        setLoading(true);
        try {
            const data = await fetchSales(page, pageSize, sortBy, sortOrder, productId);
            setSales(data.items);
            setPagination({ current: page, pageSize, total: data.total });
        } catch {
            message.error('Erro ao carregar vendas');
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<SaleWithProductName> | SorterResult<SaleWithProductName>[]
    ) => {
        let sortField = 'id';
        let sortOrder = 'asc';
        if (!Array.isArray(sorter) && sorter.field) {
            sortField = String(sorter.field);
            sortOrder = sorter.order === 'descend' ? 'desc' : 'asc';
        }
        fetchData(pagination.current || 1, pagination.pageSize || 10, sortField, sortOrder, selectedProduct);
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            await createSale(values);
            message.success('Venda criada com sucesso');
            setIsModalOpen(false);
            form.resetFields();
            fetchData(pagination.current || 1, pagination.pageSize || 2, 'id', 'asc');
        } catch {
            message.error('Erro ao criar venda');
        }
    };

    const handleDelete = async (saleId: number) => {
        try {
            await deleteSale(saleId);
            message.success('Venda deletada com sucesso');
            fetchData(pagination.current || 1, pagination.pageSize || 2, 'id', 'asc');
        } catch {
            message.error('Erro ao deletar venda');
        }
    };

    const handleExportCSV = async () => {
        try {
            await exportSalesCSV();
            message.success('Vendas exportadas com sucesso');
        } catch {
            message.error('Erro ao exportar vendas');
        }
    };

    const columns: Array<ColumnType<SaleWithProductName>> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
        },
        {
            title: 'Produto',
            dataIndex: 'product_id',
            key: 'product_id',
            sorter: true,
            render: (_: unknown, record: SaleWithProductName) => (
                <span>{record.product_name || record.product_id}</span>
            ),
        },
        {
            title: 'Quantidade',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: true,
            render: (_: unknown, record: SaleWithProductName) => (
                <Input
                    defaultValue={record.quantity}
                    onBlur={(e) => updateSale(record.id, { quantity: parseFloat(e.target.value) })}
                />
            ),
        },
        {
            title: 'Preço Total',
            dataIndex: 'total_price',
            key: 'total_price',
            sorter: true,
            render: (_: unknown, record: SaleWithProductName) => (
                <Input
                    defaultValue={record.total_price}
                    onBlur={(e) => updateSale(record.id, { total_price: parseFloat(e.target.value) })}
                />
            ),
        },
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            sorter: true,
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_: unknown, record: SaleWithProductName) => (
                <Button type="primary" danger onClick={() => handleDelete(record.id)}>
                    Deletar
                </Button>
            ),
        },
    ];

    return (
        <div>
            <PageTitle className="mb-4 font-bold text-2xl">Sales</PageTitle>
            <div className="flex justify-end gap-4 mb-4">
                <Button type="primary" onClick={() => setIsModalOpen(true)} className="text-md rounded-none bg-blue-900 font-light flex items-center">
                    Cadastrar Venda
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
                                const messageResponse = await importSalesCSV(e.target.files[0]);
                                message.success(messageResponse);
                                fetchData(pagination.current, pagination.pageSize);
                            } catch {
                                message.error('Erro ao importar vendas');
                            }
                        }
                    }}
                />
                <Button
                    type="primary"
                    className="text-md rounded-none bg-blue-900 font-light flex items-center"
                    onClick={() => document.getElementById('import-csv-input')?.click()}
                >
                    Importar CSV
                </Button>
                <div className="flex items-center justify-end gap-4">
                    <CustomSelect
                        label="Filtrar por Produto"
                        placeholder='Selecione um produto'
                        value={selectedProduct?.toString() || ''}
                        onChange={handleProductChange}
                        options={products.map((product) => ({
                            value: product.id.toString(),
                            label: product.name,
                        }))}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={sales}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
            />
            <Modal
                title="Cadastrar Venda"
                open={isModalOpen}
                onOk={handleCreate}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="product_id"
                        label="ID do Produto"
                        rules={[{ required: true, message: 'Por favor, insira o ID do produto' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Quantidade"
                        rules={[{ required: true, message: 'Por favor, insira a quantidade' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="total_price"
                        label="Preço Total"
                        rules={[{ required: true, message: 'Por favor, insira o preço total' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Data"
                        rules={[{ required: true, message: 'Por favor, insira a data' }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SalesPage;