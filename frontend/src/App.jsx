import React, { useEffect, useMemo, useState } from 'react';
import { Menu, Spin, ConfigProvider, theme as antdTheme, Switch, Input } from 'antd';
import axios from 'axios';
import CryptocurrencyCard from './components/CryptocurrencyCard.jsx';

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [currencyData, setCurrencyData] = useState(null);
  const [selectedKey, setSelectedKey] = useState('1');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('isDarkTheme');
    return savedTheme !== null ? JSON.parse(savedTheme) : true;
  });

  const fetchCurrencies = async () => {
    try {
      setError('');
      const r = await axios.get('/api/cryptocurrencies');
      const currenciesResponse = r.data;

      setAllCurrencies(currenciesResponse);

      if (currenciesResponse.length > 0) {
        setSelectedKey(String(currenciesResponse[0].id));
      }
    } catch (error) {
      console.error('Request error:', error);
      setError('Failed to load cryptocurrencies list');
    }
  };

  const fetchCurrency = async (id) => {
    try {
      setError('');
      const r = await axios.get(`/api/cryptocurrencies/${id}`);
      setCurrencyData(r.data);
    } catch (error) {
      console.error('Request error:', error);
      setError('Failed to load cryptocurrency data');
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (!selectedKey) return;
    setCurrencyData(null);
    fetchCurrency(selectedKey);
  }, [selectedKey]);

  useEffect(() => {
    localStorage.setItem('isDarkTheme', JSON.stringify(isDark));
  }, [isDark]);

  const filteredCurrencies = useMemo(() => {
    return allCurrencies.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCurrencies, searchTerm]);

  useEffect(() => {
    const menuItems = [
      {
        key: 'grp',
        label: 'List of cryptocurrencies',
        type: 'group',
        children: filteredCurrencies.map((c) => ({
          label: c.name,
          key: String(c.id),
        })),
      },
    ];

    setCurrencies(menuItems);
  }, [filteredCurrencies]);

  const onClick = (e) => {
    setSelectedKey(e.key);
  };

  const showEmptySearchState =
    !error && searchTerm.trim() !== '' && filteredCurrencies.length === 0;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
      }}
    >
      <div
        className={`flex min-h-screen transition-colors duration-300 ${
          isDark ? 'bg-slate-950 text-white' : 'bg-zinc-100 text-zinc-900'
        }`}
      >
        <div
          className={`flex flex-col border-r transition-colors duration-300 ${
            isDark
              ? 'bg-[#081a29] border-slate-800'
              : 'bg-white border-zinc-200'
          }`}
        >
          <div
            className={`flex items-center justify-between px-4 py-4 border-b ${
              isDark ? 'border-slate-800 bg-[#101826]' : 'border-zinc-200'
            }`}
            style={{ width: 256 }}
          >
            <span className="text-sm font-semibold">
              {isDark ? 'Dark mode' : 'Light mode'}
            </span>
            <Switch
              checked={isDark}
              onChange={setIsDark}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
          </div>

          <div
            className={`px-3 py-3 border-b ${
              isDark ? 'border-slate-800 bg-[#0d1b2a]' : 'border-zinc-200 bg-white'
            }`}
            style={{ width: 256 }}
          >
            <Input
              placeholder="Search cryptocurrency"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              size="middle"
            />
          </div>

          {showEmptySearchState ? (
            <div
              className={`flex h-[calc(100vh-129px)] items-center justify-center px-4 text-center text-sm ${
                isDark ? 'text-slate-300' : 'text-zinc-500'
              }`}
              style={{ width: 256 }}
            >
              No cryptocurrencies found
            </div>
          ) : (
            <Menu
              onClick={onClick}
              style={{ width: 256 }}
              selectedKeys={[selectedKey]}
              mode="inline"
              items={currencies}
              theme={isDark ? 'dark' : 'light'}
              className="h-[calc(100vh-129px)] overflow-y-auto"
            />
          )}
        </div>

        <div className="flex-1 p-6 flex items-center justify-center">
          {error ? (
            <p className="text-red-500 text-lg">{error}</p>
          ) : currencyData ? (
            <CryptocurrencyCard currency={currencyData} isDark={isDark} />
          ) : (
            <Spin size="large" />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;