import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import useDebounce from "../../shared/hooks/debouncer";

import { useLazyGetSearchedDataListQuery } from "../../shared/services/api/stock";
import { useGetCryptoListQuery } from "../../shared/services/api/crypto";
import { StockBestMatchesType } from "../../shared/services/api/stock/types";

import { AssetListType } from "../../type";

type AddAssetType = {
  assetList: AssetListType[];
  setAssetList: (assetList: AssetListType[]) => void;
  closeModal: () => void;
};

type ListItemType = {
  symbol: string;
  name: string;
  id?: string;
};

// const MOCK_STOCK_SEARCH = {
//   bestMatches: [
//     {
//       "1. symbol": "AAPL",
//       "2. name": "Apple Inc",
//       "3. type": "Equity",
//       "4. region": "United States",
//       "5. marketOpen": "09:30",
//       "6. marketClose": "16:00",
//       "7. timezone": "UTC-04",
//       "8. currency": "USD",
//       "9. matchScore": "1.0000",
//     },
//     {
//       "1. symbol": "AAPL34.SAO",
//       "2. name": "Apple Inc",
//       "3. type": "Equity",
//       "4. region": "Brazil/Sao Paolo",
//       "5. marketOpen": "10:00",
//       "6. marketClose": "17:30",
//       "7. timezone": "UTC-03",
//       "8. currency": "BRL",
//       "9. matchScore": "0.6154",
//     },
//     {
//       "1. symbol": "AAPLUSTRAD.BSE",
//       "2. name": "AA Plus Tradelink Ltd",
//       "3. type": "Equity",
//       "4. region": "India/Bombay",
//       "5. marketOpen": "09:15",
//       "6. marketClose": "15:30",
//       "7. timezone": "UTC+5.5",
//       "8. currency": "INR",
//       "9. matchScore": "0.4706",
//     },
//   ],
// };

function AddAsset({ assetList, setAssetList, closeModal }: AddAssetType) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [assetSymbol, setAssetSymbol] = useState<string>("");
  const [searchedData, setSearchedData] = useState<JSX.Element[]>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [assetSelected, setAssetSelected] = useState<boolean>(false);
  const [assetType, setAssetType] = useState("Crypto");
  const [
    getSearchedStockList,
    { data: stockListData, isLoading: stockListLoading },
  ] = useLazyGetSearchedDataListQuery();
  const { data: cryptoListData, isLoading: cryptoListLoading } =
    useGetCryptoListQuery();
  const debouncedSearch = useDebounce(searchValue, 300);

  const onSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!(searchValue.length < 2)) setShowMenu(true);
    setAssetSelected(false);
    setSearchValue(event.target.value);
  };
  const onAssetTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAssetType(event.target.value);
  };
  const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  const onAddAssetClick = () => {
    const newAsset = {
      name: searchValue,
      type: assetType,
      symbol: assetSymbol,
      quantity: quantity.toString(),
      currentValue: "0",
      percentageChange: "0",
    };

    setAssetList([...assetList, newAsset]);
    closeModal();
  };

  const ListItem = ({ symbol, name, id = "" }: ListItemType) => (
    <li
      onClick={() => {
        setSearchValue(name);
        setAssetSymbol(id || symbol);
        setAssetSelected(true);
        setShowMenu(false);
      }}
    >
      <div className="flex justify-between items-start flex-col md:flex-row">
        <div className="font-bold truncate max-w-[12rem]">{symbol}</div>
        <div className="truncate max-w-[12rem]">{name}</div>
      </div>
    </li>
  );

  useEffect(() => {
    if (searchValue.length < 3) return;

    if (assetType === "Stocks") {
      getSearchedStockList(searchValue);
      // setSearchedData(
      //   MOCK_STOCK_SEARCH.bestMatches.map(
      //     (data: StockBestMatchesType, index) => (
      //       <ListItem
      //         key={index}
      //         symbol={data["1. symbol"]}
      //         name={data["2. name"]}
      //       />
      //     )
      //   )
      // );
    } else {
      const regex = new RegExp(
        searchValue.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
        "g"
      );
      if (cryptoListData) {
        const filteredDataList = cryptoListData.filter(
          (data) =>
            data.name.toLowerCase().match(regex) ||
            data.symbol.toLowerCase().match(regex)
        );

        setSearchedData(
          filteredDataList.map((data, index) => (
            <ListItem
              key={index}
              symbol={data.symbol}
              name={data.name}
              id={data.id}
            />
          ))
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, assetType]);

  useEffect(() => {
    if (!stockListData) return;

    setSearchedData(
      stockListData.bestMatches.map((data: StockBestMatchesType, index) => (
        <ListItem
          key={index}
          symbol={data["1. symbol"]}
          name={data["2. name"]}
        />
      ))
    );
  }, [stockListData]);

  return (
    <div className="min-h-96">
      <span className="text-xl font-bold">Add Asset</span>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Asset Type</span>
        </div>
        <select className="select select-bordered" onChange={onAssetTypeChange}>
          <option>Crypto</option>
          <option>Stocks</option>
        </select>
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Asset</span>
        </div>
        <label className="input input-bordered flex items-center">
          <input
            type="text"
            className="grow"
            placeholder="Search for your asset"
            onChange={onSearchValueChange}
            value={searchValue}
          />
          <IoSearchOutline size={20} />
        </label>
        {searchedData.length > 0 ? (
          <ul
            className={`menu dropdown dropdown-end bg-base-200 rounded-xl truncate absolute left-6 right-6 mt-[5.25rem] ${
              !showMenu ? "hidden" : ""
            }`}
          >
            <div className="overflow-y-auto max-h-40 hide-scrollbar">
              {searchedData}
            </div>
          </ul>
        ) : (
          <div
            className={`menu bg-base-200 rounded-xl flex justify-center items-center min-h-20 ${
              !showMenu ? "hidden" : ""
            }`}
          >
            {stockListLoading === true || cryptoListLoading === true ? (
              <span className="loading loading-spinner loading-lg" />
            ) : (
              <p className="italic">No items found</p>
            )}
          </div>
        )}
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Quantity</span>
        </div>
        <label className="input input-bordered flex items-center">
          <input
            type="number"
            className="grow"
            placeholder="Asset quantity"
            onChange={onQuantityChange}
          />
        </label>
      </label>

      <div className="btm-nav flex justify-end bottom-4 pr-6">
        <button
          className={`btn btn-primary max-w-24 ${
            Number(quantity) > 0 && assetSelected ? "" : "disabled"
          }`}
          onClick={onAddAssetClick}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default AddAsset;
