'use client';

import { Table, message, Button, Input, InputNumber, Modal, Form } from 'antd';
import { fetchProducts, deleteProduct, updateProduct, createProduct } from '@/services/productService';
import { fetchCategories } from '@/services/categoryService';
import { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';
import { useMetadata } from '@/hooks/useMetadata';
import { PageTitle } from '@/app/style';
import TextArea from 'antd/es/input/TextArea';
import CustomSelect from '@/components/CustomSelect/CustomSelect';

export interface Product {
    id: number;
    name: string;
    price: number;
    brand: string;
    description: string;
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
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const translationMap: { [key: string]: string } = {
        name: "Nome",
        description: "Descrição",
        price: "Preço",
        category_id: "Categoria",
        brand: "Marca",
        id: "ID",
        category: "Categoria",
    };

    const translateKey = (key: string): string => {
        return translationMap[key] || key;
    };

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

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategories(1, 100, 'name', 'asc');
                setCategories(response.items.map((category: { id: number; name: string }) => ({
                    id: category.id,
                    name: category.name,
                })));
            } catch {
                message.error('Erro ao carregar categorias');
            }
        };
        loadCategories();
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

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const createdProduct = await createProduct(values);
            message.success(`Produto criado com sucesso: ${createdProduct.name}`);
            setIsModalOpen(false);
            form.resetFields();
            fetchData(pagination.current || 1, pagination.pageSize || 10, 'name', 'asc');
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('Erro desconhecido ao criar produto');
            }
        }
    };

    const handleDelete = async (productId: number) => {
        try {
            await deleteProduct(productId);
            message.success('Produto deletado com sucesso');
            fetchData(pagination.current || 1, pagination.pageSize || 10, 'name', 'asc');
        } catch (error) {
            console.error(error);
        }
    };

    const handleFieldChange = async (productId: number, field: string, value: string | number | boolean) => {
        try {
            const updatedData = { [field]: value };
            await updateProduct(productId, updatedData);

            message.success(`${translateKey(field)} atualizado com sucesso`);

            fetchData(pagination.current || 1, pagination.pageSize || 10, 'id', 'asc');
        } catch (error) {
            message.error(`Erro ao atualizar ${field}`);
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
            render: (_: unknown, record: Product) => (
                <Input
                    defaultValue={record.name}
                    onBlur={(e) => handleFieldChange(record.id, 'name', e.target.value)}
                />
            ),
        },
        {
            title: 'Categoria',
            dataIndex: 'category',
            key: 'category',
            sorter: true,
            render: (_: unknown, record: Product) => (
                <div className='relative block'>
                    <CustomSelect
                        label="Categoria"
                        value={record.category_id.toString()}
                        onChange={(value) => handleFieldChange(record.id, 'category_id', parseInt(value))}
                        options={categories.map((category) => ({
                            value: category.id.toString(),
                            label: category.name,
                        }))}
                    />
                </div>
            ),
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
            render: (_: unknown, record: Product) => (
                <Input.TextArea
                    defaultValue={record.description}
                    rows={2}
                    onBlur={(e) => handleFieldChange(record.id, 'description', e.target.value)}
                />
            ),
        },
        {
            title: 'Preço',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            render: (_: unknown, record: Product) => (
                <>
                    R$
                    <InputNumber
                        defaultValue={record.price}
                        min={0}
                        className='ms-2'
                        formatter={(value) => `${value}`}
                        parser={(value) => parseFloat(value?.replace(/R\$\s?/g, '') || '0')}
                        onBlur={(e) => handleFieldChange(record.id, 'price', parseFloat(e.target.value))}
                    />
                </>
            ),
        },
        {
            title: 'Marca',
            dataIndex: 'brand',
            key: 'brand',
            sorter: true,
            render: (_: unknown, record: Product) => (
                <Input
                    defaultValue={record.brand}
                    onBlur={(e) => handleFieldChange(record.id, 'brand', e.target.value)}
                />
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
            <Button type="primary" onClick={() => setIsModalOpen(true)} className="mb-4 me-auto text-md rounded-none bg-blue-900 font-light flex items-center">
                Cadastrar novo
            </Button>
            <Modal
                title="Cadastrar Produto"
                open={isModalOpen}
                onOk={handleCreate}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Nome"
                        rules={[{ required: true, message: 'Por favor, insira o nome do produto' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Descrição"
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Preço"
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="brand"
                        label="Marca"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="category_id"
                        label="Categoria"
                        rules={[{ required: true, message: 'Por favor, selecione uma categoria' }]}
                    >
                        <CustomSelect
                            label="Categoria"
                            value={form.getFieldValue('category_id')?.toString() || ''}
                            onChange={(value) => form.setFieldValue('category_id', parseInt(value))}
                            options={categories.map((category) => ({
                                value: category.id.toString(),
                                label: category.name,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
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
