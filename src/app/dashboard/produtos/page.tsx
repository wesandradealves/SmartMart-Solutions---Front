'use client';

import { useEffect, useState } from 'react';
import { Table, message, Button, Input, InputNumber, Modal, Form } from 'antd';
import { fetchProducts, deleteProduct, updateProduct, createProduct } from '@/services/productService';
import { fetchCategories } from '@/services/categoryService';
import { TablePaginationConfig, SorterResult, FilterValue } from 'antd/es/table/interface';
import { useMetadata } from '@/hooks/useMetadata';
import { PageTitle } from '@/app/style';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import TextArea from 'antd/es/input/TextArea';
import { exportProductsCSV, importProductsCSV } from '@/services/csvService';

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

const ProductForm = ({
    form,
    categories,
}: {
    form: ReturnType<typeof Form.useForm>[0];
    categories: { id: number; name: string }[];
}) => (
    <Form form={form} layout="vertical">
        <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome do produto' }]}
        >
            <Input />
        </Form.Item>
        <Form.Item name="description" label="Descrição">
            <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="price" label="Preço">
            <Input type="number" />
        </Form.Item>
        <Form.Item name="brand" label="Marca">
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
                onChange={(value) => form.setFieldsValue({ category_id: parseInt(value) })}
                options={categories.map((category) => ({
                    value: category.id.toString(),
                    label: category.name,
                }))}
            />
        </Form.Item>
    </Form>
);

const ProdutosPage = () => {
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
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const translationMap: { [key: string]: string } = {
        name: "Nome",
        description: "Descrição",
        price: "Preço",
        category_id: "Categoria",
        brand: "Marca",
        id: "ID",
        category: "Categoria",
    };

    useMetadata({
        title: `SmartMart - Produtos (${total})`,
        ogTitle: `SmartMart - Produtos (${total})`,
    });

    const translateKey = (key: string): string => translationMap[key] || key;

    const fetchData = async (page: number, pageSize: number, sortField: string, sortOrder: string, categoryId: number | null) => {
        setLoading(true);
        try {
            console.log('Fetching products with params:', { page, pageSize, sortField, sortOrder, categoryId });
            const response = await fetchProducts(page, pageSize, sortField, sortOrder, categoryId);  
            setProducts(response.items);
            setTotal(response.total);
            setPagination((prev) => ({
                ...prev,
                current: Math.max(page, 1), // Garante que o valor de current seja sempre positivo
                pageSize,
                total: response.total,
            }));

            if (response.items.length > pageSize) {
                console.warn(
                    '[antd: Table] dataSource length is greater than pageSize. Check backend response or frontend logic.'
                );
            }
        } catch {
            message.error('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current || 1, pagination.pageSize || 10, 'id', 'asc', null);
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategories(1, 100, 'name', 'asc');
                setCategories(response.items);
            } catch {
                message.error('Erro ao carregar categorias');
            }
        };
        loadCategories();

        return () => {
            setCategories([]);
        };
    }, []);

    useEffect(() => {
        if (selectedCategory !== null) {
            fetchData(pagination.current || 1, pagination.pageSize || 10, 'id', 'asc', selectedCategory);
        }
    }, [selectedCategory]);

    /* eslint-disable @typescript-eslint/no-unused-vars */

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<Product> | SorterResult<Product>[],
        extra: { currentDataSource: Product[] }
    ) => {
        let sortField = 'id';
        let sortOrder = 'asc';
        if (!Array.isArray(sorter) && sorter.field) {
            sortField = String(sorter.field);
            sortOrder = sorter.order === 'descend' ? 'desc' : 'asc';
        }
        fetchData(pagination.current || 1, pagination.pageSize || 10, sortField, sortOrder, selectedCategory);
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const createdProduct = await createProduct(values);
            message.success(`Produto criado com sucesso: ${createdProduct.name}`);
            setIsModalOpen(false);
            form.resetFields();
            fetchData(pagination.current || 1, pagination.pageSize || 10, 'name', 'asc', selectedCategory);
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            message.error('Erro ao criar produto');
        }
    };

    const handleDelete = async (productId: number) => {
        try {
            await deleteProduct(productId);
            message.success('Produto deletado com sucesso');
            fetchData(pagination.current || 1, pagination.pageSize || 10, 'name', 'asc', selectedCategory);
        } catch {
            message.error('Erro ao deletar produto');
        }
    };

    const handleFieldChange = async (productId: number, field: string, value: string | number | boolean) => {
        try {
            await updateProduct(productId, { [field]: value });
            message.success(`${translateKey(field)} atualizado com sucesso`);
            fetchData(pagination.current || 1, pagination.pageSize || 10, 'id', 'asc', null);
        } catch {
            message.error(`Erro ao atualizar ${field}`);
        }
    };

    const handleCategoryChange = (value: string) => {
        const categoryId = value ? parseInt(value) : null;
        setSelectedCategory(categoryId);
        fetchData(1, pagination.pageSize || 10, 'id', 'asc', categoryId); // Passa o valor atualizado diretamente
    };

    const handleExportCSV = async (p0?: File) => {
        try {
            await exportProductsCSV();
            message.success('Produtos exportados com sucesso');
        } catch {
            message.error('Erro ao exportar produtos');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: true },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (_: unknown, record: Product) => (
                <Input defaultValue={record.name} onBlur={(e) => handleFieldChange(record.id, 'name', e.target.value)} />
            ),
        },
        {
            title: 'Categoria',
            dataIndex: 'category',
            key: 'category',
            sorter: true,
            render: (_: unknown, record: Product) => (
                <CustomSelect
                    label="Categoria"
                    value={record.category_id.toString()}
                    onChange={(value) => handleFieldChange(record.id, 'category_id', parseInt(value))}
                    options={categories.map((c) => ({ value: c.id.toString(), label: c.name }))}
                />
            ),
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
            render: (_: unknown, record: Product) => (
                <Input.TextArea defaultValue={record.description} rows={2} onBlur={(e) => handleFieldChange(record.id, 'description', e.target.value)} />
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
                        className="ms-2"
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
                <Input defaultValue={record.brand} onBlur={(e) => handleFieldChange(record.id, 'brand', e.target.value)} />
            ),
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_: unknown, record: Product) => (
                <Button type="primary" danger onClick={() => handleDelete(record.id)}>
                    Deletar
                </Button>
            ),
        },
    ];

    return (
        <div>
            <PageTitle className="mb-4 font-bold text-2xl">Produtos</PageTitle>



            <Modal
                title="Cadastrar Produto"
                open={isModalOpen}
                onOk={handleCreate}
                onCancel={() => setIsModalOpen(false)}
            >
                <ProductForm form={form} categories={categories} />
            </Modal>

            <div className='flex justify-end items-center gap-4 mb-4'>
                <div className="flex items-center justify-end gap-4">
                    <Button type="primary" onClick={() => setIsModalOpen(true)} className="text-md rounded-none bg-blue-900 font-light flex items-center">
                        Cadastrar novo
                    </Button>
                    <Button type="primary" onClick={() => handleExportCSV()} className="text-md rounded-none bg-blue-900 font-light flex items-center">
                        Exportar CSV
                    </Button>
                    <Button type="primary" onClick={() => document.getElementById('import-csv-input')?.click()} className="text-md rounded-none bg-blue-900 font-light flex items-center">
                        Importar CSV
                    </Button>
                    <input
                        type="file"
                        id="import-csv-input"
                        style={{ display: 'none' }}
                        accept=".csv"
                        onChange={async (e) => {
                            if (e.target.files?.[0]) {
                                try {
                                    const messageResponse = await importProductsCSV(e.target.files[0]);
                                    message.success(messageResponse);
                                    fetchData(pagination.current || 1, pagination.pageSize || 10, 'id', 'asc', selectedCategory);
                                } catch {
                                    message.error('Erro ao importar produtos');
                                }
                            }
                        }}
                    />
                </div>
                <div className="flex items-center justify-end gap-4">
                    <p className='font-bold text-sm'>Filtrar por</p>
                    <CustomSelect
                        label="Filtrar por Categoria"
                        placeholder='Selecione uma categoria'
                        value={selectedCategory?.toString() || ''}
                        onChange={handleCategoryChange}
                        options={categories.map((category) => ({
                            value: category.id.toString(),
                            label: category.name,
                        }))}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                key={JSON.stringify(products)} // Força a re-renderização quando os dados mudam
            />
        </div>
    );
};

export default ProdutosPage;
