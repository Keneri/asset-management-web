import { useState } from "react";
import { AssetListType } from "../../type";
import { AssetType } from "../table/type";

type AddAssetType = {
  asset: AssetType;
  assetList: AssetListType[];
  setAssetList: (assetList: AssetListType[]) => void;
  closeModal: () => void;
};

function UpdateAsset({
  asset,
  assetList,
  setAssetList,
  closeModal,
}: AddAssetType) {
  const [quantity, setQuantity] = useState<number>(Number(asset.quantity));
  const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  const onUpdateAssetClick = () => {
    const updatedAssetList = assetList.map((assetListItem) => {
      if (assetListItem.name === asset.name)
        assetListItem.quantity = quantity.toString();

      return assetListItem;
    });

    setAssetList([...updatedAssetList]);
    closeModal();
  };

  return (
    <div className="min-h-96">
      <span className="text-xl font-bold">Update Asset</span>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Asset Type</span>
        </div>
        <label className="input input-bordered flex items-center">
          <input disabled value={asset.type} />
        </label>
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Asset</span>
        </div>
        <label className="input input-bordered flex items-center">
          <input disabled value={asset.name} />
        </label>
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
            value={quantity}
          />
        </label>
      </label>

      <div className="btm-nav flex justify-end bottom-4 pr-6">
        <button
          className={`btn btn-primary max-w-24 ${
            Number(quantity) === Number(asset.quantity) ? "disabled" : ""
          }`}
          onClick={onUpdateAssetClick}
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default UpdateAsset;
