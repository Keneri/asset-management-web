type AssetType = {
  name: string;
  type: string;
  symbol: string;
  quantity: string;
  currentValue: string;
  percentageChange: string;
};

type TableComponentType = {
  assetList: AssetType[];
  setAssetList: (assetList: AssetType[]) => void;
};

interface RowType extends TableComponentType {
  asset: AssetType;
  index: number;
}

export type { AssetType, TableComponentType, RowType };
