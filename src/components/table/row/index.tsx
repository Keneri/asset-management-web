import moment from "moment";
import { useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  BsCaretUpSquareFill,
  BsCaretDownSquareFill,
  BsDashSquareFill,
} from "react-icons/bs";
import { FaChartArea } from "react-icons/fa";

import Modal from "../../modal";
import UpdateAsset from "../../update-asset";

import { AssetType, RowType } from "../type";
import { useAppDispatch } from "../../../shared/hooks/redux-hook";
import {
  useLazyGetCoinDataQuery,
  useLazyGetDailyCoinDataQuery,
} from "../../../shared/services/api/crypto";
import { useLazyGetDailyStockDataQuery } from "../../../shared/services/api/stock";
import {
  setChartName,
  setChartData,
  setChartLabel,
} from "../../../shared/services/slices/chart";

function Row({ assetList, setAssetList, asset, index }: RowType) {
  const dispatch = useAppDispatch();
  const [getCoinData, { data: coinData, isLoading: coinDataLoading }] =
    useLazyGetCoinDataQuery();
  const [getDailyCoinData, { data: dailyCoinData }] =
    useLazyGetDailyCoinDataQuery();
  const [getStockData, { data: stockData, isLoading: stockDataLoading }] =
    useLazyGetDailyStockDataQuery();

  const openModal = () =>
    (
      document.getElementById(`update-modal-${asset.name}`) as HTMLDialogElement
    ).showModal();
  const closeModal = () =>
    (
      document.getElementById(`update-modal-${asset.name}`) as HTMLDialogElement
    ).close();

  const fetchData = () => {
    if (asset.type === "Crypto") {
      getCoinData(asset.symbol);
      getDailyCoinData(asset.symbol);
    } else if (asset.type === "Stocks") getStockData(asset.symbol);
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

  const onChartClick = () => {
    if (!(stockData || (coinData && dailyCoinData))) return;

    dispatch(setChartName(asset.name));

    if (asset.type === "Stocks") {
      const chartLabel = Object.keys(
        stockData["Time Series (Daily)"]
      ).reverse();
      const chartData = chartLabel.map(
        (label) => stockData["Time Series (Daily)"][label]["4. close"]
      );

      dispatch(setChartLabel(chartLabel));
      dispatch(setChartData(chartData));
    } else if (asset.type === "Crypto") {
      const chartLabel = dailyCoinData.prices.map((arr: [number, number]) =>
        moment(arr[0]).format("YYYY-MM-DD")
      );
      const chartData = dailyCoinData.prices.map(
        (arr: [number, number]) => arr[1]
      );
      dispatch(setChartLabel(chartLabel));
      dispatch(setChartData(chartData));
    }
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
  }, [coinData, coinDataLoading, asset.quantity]);

  useEffect(() => {
    if (!stockData || stockDataLoading === true || stockData["Information"])
      return;

    const dates = Object.keys(stockData["Time Series (Daily)"]);

    const currentPrice = stockData["Time Series (Daily)"][dates[0]]["4. close"];
    const oldPrice = stockData["Time Series (Daily)"][dates[1]]["4. close"];

    percentageCalculation(currentPrice, oldPrice);
    currentValueCalculation(currentPrice, Number(asset.quantity));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockData, stockDataLoading, asset.quantity]);

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
        <ul className="menu menu-horizontal menu-xs p-0 min-w-24">
          <li>
            <button onClick={onChartClick}>
              <FaChartArea size={16} />
            </button>
          </li>
          <li>
            <button onClick={openModal}>
              <MdEdit size={16} />
            </button>
          </li>
          <li>
            <button onClick={deleteRow}>
              <MdDelete size={16} />
            </button>
          </li>
        </ul>
        <Modal
          modalId={`update-modal-${asset.name}`}
          child={
            <UpdateAsset
              asset={asset}
              assetList={assetList}
              setAssetList={setAssetList}
              closeModal={closeModal}
            />
          }
        />
      </td>
    </tr>
  );
}

export default Row;
