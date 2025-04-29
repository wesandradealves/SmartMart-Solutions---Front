'use client';

import { SetStateAction, useEffect, useState } from "react";
import { Bar } from "@ant-design/plots";
import { fetchSales, fetchProfit, fetchPriceHistory } from "@/services/dashboardService";
import { useMetadata } from "@/hooks/useMetadata";
import { useAuth } from "@/context/auth";
import { PageTitle } from "../style";
import { GridTitle } from "./styles";
import { Table, Modal, message } from "antd";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { user } = useAuth();

  useMetadata({
    title: `SmartMart - Bem vindo, ${user?.username} - Dashboard`,
    ogTitle: `SmartMart - Bem vindo, ${user?.username} - Dashboard`,
  });

  const [salesData, setSalesData] = useState<{ product_id: number; product_name: string; total_price: number; date: string }[]>([]);
  const [profitData, setProfitData] = useState([]);
  const [priceHistoryModalVisible, setPriceHistoryModalVisible] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [clientUser, setClientUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientUser(user?.username || null);
    }
  }, [user]);

  useEffect(() => {
    async function loadData() {
      const sales = await fetchSales();
      const formattedSales = sales.map((sale: { date: string | number | Date; }) => ({
        ...sale,
        date: new Date(sale.date).toLocaleDateString("pt-BR"),
      }));
      const profit = await fetchProfit();
      const formattedProfit = profit
        .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((item: { date: string | number | Date; }) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("pt-BR"),
        }));

      setSalesData(formattedSales);
      setProfitData(formattedProfit);
    }
    loadData();
  }, []);

  const handleProductClick = async (productId: number, productName: SetStateAction<string>) => {
    try {
      const history = await fetchPriceHistory(productId);
      if (history.length > 0) {
        setPriceHistory(
          history.map((item: { date: string | number | Date; price: number; }) => ({
            date: new Date(item.date).toLocaleDateString("pt-BR"),
            price: item.price,
          }))
        );
        setSelectedProductName(productName);
        setPriceHistoryModalVisible(true);
      } else {
        message.info("Histórico de preços não encontrado para este produto.");
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message); 
      } else {
        message.error("Erro ao buscar o histórico de preços. Tente novamente mais tarde.");
      }
    }
  };

  const productColumns = [
    {
      title: "Produto",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Preço Total",
      dataIndex: "total_price",
      key: "total_price",
      render: (price: number) => `R$ ${price.toFixed(2)}`,
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: { product_id: number; product_name: SetStateAction<string>; }) => (
        <a
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => handleProductClick(record.product_id, record.product_name)}
        >
          Ver Histórico de Preços
        </a>
      ),
    },
  ];

  const salesConfig = {
    data: salesData,
    xField: "total_price",
    yField: "product_name",
    seriesField: "date",
    colorField: "product_name",
    legend: { position: "top-left" },
  };

  const profitConfig = {
    data: profitData,
    xField: "date",
    yField: "profit",
    seriesField: "product_id",
    colorField: "product_id",
    legend: { position: "top-left" },
    xAxis: {
      type: "timeCat",
      label: {
        formatter: (text: string | number | Date) => new Date(text).toLocaleDateString("pt-BR"),
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <>
      <PageTitle className="mb-1 font-bold text-2xl">Dashboard</PageTitle>
      <div className="text-sm font-medium mb-4">
        Bem Vindo, {clientUser || "Usuário"}
      </div>
      <div className="grid grid-cols-2 gap-4 p-2">
        <div className="bg-white p-4 shadow rounded">
          <GridTitle className="text-lg font-bold mb-4">Vendas</GridTitle>
          <Bar {...salesConfig} />
        </div>
        <div className="bg-white p-4 shadow rounded">
          <GridTitle className="text-lg font-bold mb-4">Lucro</GridTitle>
          <Bar {...profitConfig} />
        </div>
        <div className="bg-white p-4 shadow rounded">
          <GridTitle className="text-lg font-bold mb-4">Produtos</GridTitle>
          <Table
            columns={productColumns}
            dataSource={salesData}
            rowKey="product_id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
      <Modal
        title={`Histórico de Preços - ${selectedProductName}`}
        open={priceHistoryModalVisible}
        onCancel={() => setPriceHistoryModalVisible(false)}
        footer={null}
      >
        <Table
          dataSource={priceHistory}
          columns={[
            {
              title: "Data",
              dataIndex: "date",
              key: "date",
            },
            {
              title: "Preço",
              dataIndex: "price",
              key: "price",
              render: (price) => `R$ ${price.toFixed(2)}`,
            },
          ]}
          rowKey="date"
          pagination={false}
        />
      </Modal>
    </>
  );
}
