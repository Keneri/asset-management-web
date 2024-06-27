import moment from "moment";
import { useEffect } from "react";
import {
  BsCaretUpSquareFill,
  BsCaretDownSquareFill,
  BsDashSquareFill,
} from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";

import { AssetType, RowType } from "../type";
import { useLazyGetCoinDataQuery } from "../../../shared/services/api/crypto";
import { useLazyGetDailyStockDataQuery } from "../../../shared/services/api/stock";

function Row({ assetList, setAssetList, asset, index }: RowType) {
  const [getCoinData, { data: coinData, isLoading: coinDataLoading }] =
    useLazyGetCoinDataQuery();
  const [getStockData, { data: stockData, isLoading: stockDataLoading }] =
    useLazyGetDailyStockDataQuery();

  const fetchData = () => {
    if (asset.type === "Crypto") getCoinData(asset.symbol);
    else if (asset.type === "Stock") getStockData(asset.symbol);
  };

  const percentageCalculation = (currentPrice: number, oldPrice: number) => {
    if (!currentPrice || !oldPrice) return;

    setAssetList(
      assetList.map((asset: AssetType, i: number) => {
        if (index === i) {
          asset.percentageChange = (
            ((currentPrice - oldPrice) / oldPrice) *
            100
          ).toFixed(2);
        }

        return asset;
      })
    );
  };

  const currentValueCalculation = (currentPrice: number, quantity: number) => {
    if (!currentPrice || !quantity) return;

    setAssetList(
      assetList.map((asset: AssetType, i: number) => {
        if (index === i) {
          asset.currentValue = (currentPrice * quantity)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        return asset;
      })
    );
  };

  const deleteRow = () => {
    if (index < 0) return;

    const tempAssetList = [...assetList];
    tempAssetList.splice(index, 1);
    setAssetList(tempAssetList);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!coinData || coinDataLoading === true) return;

    const currentPrice = coinData.market_data.current_price.usd;
    const priceChange24H = coinData.market_data.price_change_24h;

    percentageCalculation(currentPrice, currentPrice - priceChange24H);
    currentValueCalculation(currentPrice, Number(asset.quantity));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinData, coinDataLoading]);

  useEffect(() => {
    if (!stockData || stockDataLoading === true || stockData["Information"])
      return;

    const currentPrice =
      stockData["Time Series (Daily)"][
        moment().subtract(1, "days").format("YYYY-MM-DD").toString()
      ]["4. close"];
    const oldPrice =
      stockData["Time Series (Daily)"][
        moment().subtract(2, "days").format("YYYY-MM-DD").toString()
      ]["4. close"];

    percentageCalculation(currentPrice, oldPrice);
    currentValueCalculation(currentPrice, Number(asset.quantity));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockData, stockDataLoading]);

  return (
    <tr key={index}>
      <td>{asset.name}</td>
      <td>{asset.type}</td>
      <td>{asset.quantity}</td>
      <td>
        {coinDataLoading || stockDataLoading ? (
          <div className="skeleton h-4 w-24"></div>
        ) : (
          asset.currentValue
        )}
      </td>
      <td>
        <div className="flex items-center">
          {coinDataLoading || stockDataLoading ? (
            <div className="skeleton h-4 w-24"></div>
          ) : (
            <>
              {Number(asset.percentageChange) > 0 ? (
                <BsCaretUpSquareFill
                  size={16}
                  className="mr-2 text-green-500 fill-current"
                />
              ) : Number(asset.percentageChange) < 0 ? (
                <BsCaretDownSquareFill
                  size={16}
                  className="mr-2 text-red-500 fill-current"
                />
              ) : (
                <BsDashSquareFill size={16} className="mr-2" />
              )}
              {Math.abs(Number(asset.percentageChange))}
            </>
          )}
        </div>
      </td>
      <td>
        <ul className="menu menu-horizontal menu-xs p-0 min-w-16">
          <li>
            <button onClick={() => {}}>
              <MdEdit size={16} />
            </button>
          </li>
          <li>
            <button onClick={deleteRow}>
              <MdDelete size={16} />
            </button>
          </li>
        </ul>
      </td>
    </tr>
  );
}

export default Row;
