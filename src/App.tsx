import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import NavBar from "./components/navbar";
import Table from "./components/table";
import Modal from "./components/modal";
import AddAsset from "./components/add-asset";

import { AssetListType } from "./type";

const MOCK_ASSET_DATA = [
  {
    name: "Bitcoin",
    type: "Crypto",
    symbol: "bitcoin",
    quantity: "20",
    currentValue: "0",
    percentageChange: "0",
  },
  {
    name: "Apple",
    type: "Stocks",
    symbol: "AAPL",
    quantity: "15",
    currentValue: "0",
    percentageChange: "0",
  },
  {
    name: "Ethereum",
    type: "Crypto",
    symbol: "ethereum",
    quantity: "25",
    currentValue: "0",
    percentageChange: "0",
  },
];

function App() {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );
  const [assetList, setAssetList] = useState<AssetListType[]>(MOCK_ASSET_DATA);

  const openModal = () =>
    (document.getElementById("add-modal") as HTMLDialogElement).showModal();
  const closeModal = () =>
    (document.getElementById("add-modal") as HTMLDialogElement).close();

  return (
    <div data-theme={theme}>
      <NavBar setTheme={setTheme} />
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
        <Table assetList={assetList} setAssetList={setAssetList} />
      </div>
      <Modal
        modalId="add-modal"
        child={
          <AddAsset
            assetList={assetList}
            setAssetList={setAssetList}
            closeModal={closeModal}
          />
        }
      />
    </div>
  );
}

export default App;
