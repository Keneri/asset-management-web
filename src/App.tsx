import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import NavBar from "./components/navbar";
import Table from "./components/table";
import Modal from "./components/right-drawer";

import { useLazyGetCoinDataQuery } from "./shared/services/api/crypto";
import { useLazyGetDailyStockDataQuery } from "./shared/services/api/stock";

const MOCK_ASSET_DATA = [
  {
    name: "Bitcoin",
    type: "Crypto",
    symbol: "bitcoin",
    quantity: 20.324123123,
    currentValue: 100000,
    percentageChange: 23,
  },
  {
    name: "Apple",
    type: "Stock",
    symbol: "AAPL",
    quantity: 15,
    currentValue: 10000,
    percentageChange: 15,
  },
  {
    name: "Ethereum",
    type: "Crypto",
    symbol: "ethereum",
    quantity: 25,
    currentValue: 50000,
    percentageChange: 7,
  },
];

function App() {
  const [cryptoList, setCryptoList] = useState([]);
  const [assetList, setAssetList] = useState(MOCK_ASSET_DATA);
  const [getCoinData, { data: coinData, isLoading: coinDataLoading }] =
    useLazyGetCoinDataQuery();
  const [getStockData, { data: stockData, isLoading: stockDataLoading }] =
    useLazyGetDailyStockDataQuery();

  const openModal = () =>
    (document.getElementById("generic-modal") as HTMLDialogElement).showModal();

  useEffect(() => {
    // { coinId: "bitcoin", currency: "usd", days: 1 }
    // getCoinData("bitcoin");
    // getCoinData("ethereum");
    // getStockData({ symbol: "ibm" });
  }, []);

  useEffect(() => {
    if (!coinData || coinDataLoading === true) return;

    console.log(coinData);
  }, [coinData, coinDataLoading]);

  useEffect(() => {
    if (!stockData || stockDataLoading === true) return;

    console.log(stockData);
  }, [stockData, stockDataLoading]);

  return (
    <div>
      <NavBar />
      <div className="mx-4 my-8">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl">Assets</h2>
          <button
            className="btn btn-sm btn-square btn-primary"
            onClick={openModal}
          >
            <FaPlus size={16} />
          </button>
        </div>
        <Table assetList={assetList} />
      </div>
      <Modal />
    </div>
  );
}

export default App;
