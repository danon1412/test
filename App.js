
import React, { useState, useEffect } from "react";

import "./styles.css";
import {
  ShoppingCartIcon,
  KeyIcon,
  UserIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  TagIcon,
  CubeIcon,
  PlusIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("tablecrm_token") || ""
  );
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [activeSection, setActiveSection] = useState("token");
  const [clientPhone, setClientPhone] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [priceTypes, setPriceTypes] = useState([]);
  const [selectedPriceType, setSelectedPriceType] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    if (isAuthenticated) {
     
      setOrganizations([
        { id: 38, name: 'ООО "Ромашка"' },
        { id: 43, name: "ИП Сидоров" },
        { id: 45, name: 'ОАО "Весна"' },
        { id: 40, name: 'ТД "Стройматериалы"' },
      ]);

     
      setWarehouses([
        { id: 39, name: "Основной склад" },
        { id: 50, name: "Склад на Ленина" },
        { id: 34, name: "Склад на Гагарина" },
        { id: 47, name: "Центральный склад" },
      ]);

  
      setPriceTypes([
        { id: 1, name: "Розничная" },
        { id: 2, name: "Оптовая" },
        { id: 3, name: "Дилерская" },
        { id: 4, name: "Специальная" },
      ]);

     
      setProducts([
        { id: 1, name: "Товар 1", price: 1000 },
        { id: 2, name: "Товар 2", price: 500 },
        { id: 3, name: "Товар 3", price: 750 },
        { id: 4, name: "Товар 4", price: 1200 },
      ]);
    }
  }, [isAuthenticated]);

  const handleAuth = () => {
    if (token) {
      localStorage.setItem("tablecrm_token", token);
      setIsAuthenticated(true);
      setActiveSection("client");
    }
  };

  const searchClients = () => {
    if (clientPhone) {
      setIsLoading(true);
    
      setTimeout(() => {
        setClients([
          { id: 360753, name: "Test", phone: "+79123456789" },
          { id: 360686, name: "рыбалка", phone: "+79234567890" },
          { id: 361216, name: "ttttt", phone: "+79345678901" },
        ]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const addProduct = (product) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);

    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }

    setSelectedProducts(
      selectedProducts.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const createOrder = (processOrder) => {
    if (!selectedOrg || !selectedWarehouse || selectedProducts.length === 0) {
      alert("Заполните все обязательные поля и добавьте товары");
      return;
    }

    const orderData = {
      operation: "Заказ",
      organization: parseInt(selectedOrg),
      warehouse: parseInt(selectedWarehouse),
      price_type: selectedPriceType ? parseInt(selectedPriceType) : null,
      contragent: selectedClient ? selectedClient.id : null,
      goods: selectedProducts.map((product) => ({
        nomenclature: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      status: processOrder,
    };

    console.log("Order data:", orderData);
    alert(processOrder ? "Заказ создан и проведен!" : "Заказ создан!");

  
    setSelectedClient(null);
    setClientPhone("");
    setSelectedOrg("");
    setSelectedWarehouse("");
    setSelectedPriceType("");
    setSelectedProducts([]);
    setActiveSection("client");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mt-10">
          <div className="flex items-center justify-center mb-6">
            <ShoppingCartIcon className="h-10 w-10 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">
              TableCRM Заказы
            </h1>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="token"
            >
              Токен доступа
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Введите ваш токен API"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            onClick={handleAuth}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
          >
            <KeyIcon className="h-5 w-5 mr-2" />
            Авторизоваться
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="flex items-center justify-center">
          <ShoppingCartIcon className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold">TableCRM Заказы</h1>
        </div>
      </header>

      <div className="p-4">
        {/* Клиент */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex items-center mb-4">
            <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Клиент</h2>
          </div>

          <div className="mb-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Телефон клиента
            </label>
            <div className="flex">
              <input
                id="phone"
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+7 (XXX) XXX-XX-XX"
                className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                onClick={searchClients}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
              >
                {isLoading ? "Поиск..." : "Найти"}
              </button>
            </div>
          </div>

          {clients.length > 0 && (
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Результаты поиска
              </label>
              <div className="border rounded divide-y">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 cursor-pointer ${
                      selectedClient?.id === client.id
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-600">{client.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedClient && (
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <div className="font-medium">Выбранный клиент:</div>
              <div>
                {selectedClient.name} ({selectedClient.phone})
              </div>
            </div>
          )}
        </div>

        {/* Организация */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex items-center mb-4">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Организация</h2>
          </div>

          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Выберите организацию</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* Склад */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex items-center mb-4">
            <BuildingStorefrontIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Склад</h2>
          </div>

          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Выберите склад</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        {/* Тип цен */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex items-center mb-4">
            <TagIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Тип цен</h2>
          </div>

          <select
            value={selectedPriceType}
            onChange={(e) => setSelectedPriceType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Выберите тип цен</option>
            {priceTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Товары */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CubeIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Товары</h2>
            </div>
            <button
              onClick={() => setActiveSection("products")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Добавить
            </button>
          </div>

          {selectedProducts.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              Товары не добавлены
            </div>
          ) : (
            <div className="divide-y">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">
                      {product.price} ₽/шт
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        updateQuantity(product.id, product.quantity - 1)
                      }
                      className="bg-gray-200 hover:bg-gray-300 rounded-l px-2 py-1"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 bg-white border-t border-b">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, product.quantity + 1)
                      }
                      className="bg-gray-200 hover:bg-gray-300 rounded-r px-2 py-1"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="ml-3 text-red-600 hover:text-red-800"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedProducts.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <div className="flex justify-between font-medium">
                <span>Итого:</span>
                <span>{calculateTotal()} ₽</span>
              </div>
            </div>
          )}
        </div>

        {/* Модальное окно выбора товаров */}
        {activeSection === "products" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Выбор товаров</h3>
                <button
                  onClick={() => setActiveSection("")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="py-3 border-b flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">
                        {product.price} ₽
                      </div>
                    </div>
                    <button
                      onClick={() => addProduct(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                    >
                      Добавить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={() => createOrder(false)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Создать заказ
          </button>
          <button
            onClick={() => createOrder(true)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
          >
            <CheckBadgeIcon className="h-5 w-5 mr-1" />
            Создать и провести
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
