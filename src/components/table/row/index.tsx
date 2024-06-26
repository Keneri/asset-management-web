import moment from "moment";
import { useEffect, useState } from "react";
import {
  BsCaretUpSquareFill,
  BsCaretDownSquareFill,
  BsDashSquareFill,
} from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";

import { AssetType } from "../type";
import { useLazyGetCoinDataQuery } from "../../../shared/services/api/crypto";
import { useLazyGetDailyStockDataQuery } from "../../../shared/services/api/stock";

type RowType = {
  asset: AssetType;
  index: number;
};

function Row({ asset, index }: RowType) {
  const [percentage, setPercentage] = useState<string>("0");
  const [currentValue, setCurrentValue] = useState<string>("0");
  const [getCoinData, { data: coinData, isLoading: coinDataLoading }] =
    useLazyGetCoinDataQuery();
  const [getStockData, { data: stockData, isLoading: stockDataLoading }] =
    useLazyGetDailyStockDataQuery();

  const percentageCalculation = (currentPrice: number, oldPrice: number) => {
    if (!currentPrice || !oldPrice) return;
    setPercentage((((currentPrice - oldPrice) / oldPrice) * 100).toFixed(2));
  };

  const currentValueCalculation = (currentPrice: number, quantity: number) => {
    if (!currentPrice || !quantity) return;
    setCurrentValue(
      (currentPrice * quantity)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  useEffect(() => {
    if (asset.type === "Crypto") getCoinData(asset.symbol);
    else if (asset.type === "Stock") getStockData(asset.symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!coinData || coinDataLoading === true) return;

    const currentPrice = coinData.market_data.current_price.usd;
    const priceChange24H = coinData.market_data.price_change_24h;

    percentageCalculation(currentPrice, currentPrice - priceChange24H);
    currentValueCalculation(currentPrice, asset.quantity);
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
    currentValueCalculation(currentPrice, asset.quantity);
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
          currentValue
        )}
      </td>
      <td>
        <div className="flex items-center">
          {coinDataLoading || stockDataLoading ? (
            <div className="skeleton h-4 w-24"></div>
          ) : (
            <>
              {Number(percentage) > 0 ? (
                <BsCaretUpSquareFill
                  size={16}
                  className="mr-2 text-green-500 fill-current"
                />
              ) : Number(percentage) < 0 ? (
                <BsCaretDownSquareFill
                  size={16}
                  className="mr-2 text-red-500 fill-current"
                />
              ) : (
                <BsDashSquareFill size={16} className="mr-2" />
              )}
              {Math.abs(Number(percentage))}
            </>
          )}
        </div>
      </td>
      <td>
        <ul className="menu menu-horizontal menu-xs p-0 min-w-16">
          <li>
            <a href="_">
              <MdEdit size={16} />
            </a>
          </li>
          <li>
            <a href="_">
              <MdDelete size={16} />
            </a>
          </li>
        </ul>
      </td>
    </tr>
  );
}

export default Row;
