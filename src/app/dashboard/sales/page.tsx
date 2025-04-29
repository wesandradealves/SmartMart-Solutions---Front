'use client';

import { Table, message, Button, Input, Modal, Form, TablePaginationConfig } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import type { FilterValue } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';
import { fetchSales, createSale, updateSale, deleteSale, exportSalesCSV, importSalesCSV } from '@/services/salesService';
import { fetchProducts } from '@/services/productService';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { PageTitle } from '@/app/style';
import { ColumnType } from 'antd/es/table/interface';
import type { SaleWithProductName } from '@/services/salesService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

const SalesPage = () => {
    const [sales, setSales] = useState<SaleWithProductName[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [products, setProducts] = useState<{ id: number; name: string; price: number }[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
    const [formTotalPrice, setFormTotalPrice] = useState<number>(0);

    useEffect(() => {
        fetchData(pagination.current || 1, pagination.pageSize || 2, 'id', 'asc', selectedProduct);
        const loadProducts = async () => {
            try {
                const response = await fetchProducts(1, 100, 'name', 'asc');
                setProducts(response.items.map((item: { id: number; name: string; price: number }) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                })));
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

    const handleFormValuesChange = (
        changedValues: Record<string, unknown>,
        allValues: { product_id?: number; quantity?: string }
    ) => {
        const product = products.find(p => p.id === allValues.product_id);
        const quantity = parseFloat(allValues.quantity ?? '');
        if (product && !isNaN(quantity)) {
            setFormTotalPrice(product.price * quantity);
        } else {
            setFormTotalPrice(0);
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const product = products.find(p => p.id === values.product_id);
            const quantity = parseFloat(values.quantity);
            const total_price = product && !isNaN(quantity) ? product.price * quantity : 0;
            await createSale({ ...values, total_price });
            message.success('Venda criada com sucesso');
            setIsModalOpen(false);
            form.resetFields();
            setFormTotalPrice(0);
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

    const showDeleteConfirm = (id: number) => {
        Modal.confirm({
            title: 'Tem certeza que deseja deletar esta venda?',
            okText: 'Sim',
            cancelText: 'Não',
            onOk: () => handleDelete(id),
        });
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
                    type="number"
                    defaultValue={record.quantity}
                    onBlur={async (e) => {
                        const newQuantity = parseFloat(e.target.value);
                        const product = products.find(p => p.id === record.product_id);
                        if (!product) {
                            message.error('Produto não encontrado');
                            return;
                        }
                        const total_price = product.price * newQuantity;
                        const result = await updateSale(record.id, { quantity: newQuantity, total_price });
                        message.success(result.message);
                        fetchData(pagination.current || 1, pagination.pageSize || 10, 'id', 'asc', selectedProduct);
                    }}
                />
            ),
        },
        {
            title: 'Preço Total',
            dataIndex: 'total_price',
            key: 'total_price',
            sorter: true,
            render: (_: unknown, record: SaleWithProductName) => (
                <span>{Number(record.total_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            ),
        },
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            render: (_: unknown, record: SaleWithProductName) => (
                <DatePicker
                    showTimeSelect
                    selected={record.date ? dayjs(record.date).toDate() : null}
                    dateFormat="yyyy-MM-dd'T'HH:mm:ss"
                    onChange={async (date: Date | null) => {
                        if (!date) return;
                        const formattedDate = dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
                        const result = await updateSale(record.id, { date: formattedDate });
                        message.success(result.message);
                        fetchData(pagination.current || 1, pagination.pageSize || 10, 'id', 'asc', selectedProduct);
                    }}
                />
            ),
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_: unknown, record: SaleWithProductName) => (
                <Button type="primary" danger onClick={() => showDeleteConfirm(record.id)}>
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
                <Form form={form} layout="vertical" onValuesChange={handleFormValuesChange}>
                    <Form.Item
                        name="product_id"
                        label="Produto"
                        rules={[{ required: true, message: 'Por favor, selecione o produto' }]}
                    >
                        <CustomSelect
                            label="Produto"
                            placeholder="Selecione um produto"
                            value={form.getFieldValue('product_id')?.toString() || ''}
                            onChange={(value) => form.setFieldsValue({ product_id: parseInt(value) })}
                            options={products.map((product) => ({
                                value: product.id.toString(),
                                label: product.name,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Quantidade"
                        rules={[{ required: true, message: 'Por favor, insira a quantidade' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <div className="mb-4">
                        <span className="font-bold">Preço Total: </span>
                        <span>{formTotalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
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