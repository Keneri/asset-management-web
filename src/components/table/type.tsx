type AssetType = {
  name: string;
  type: string;
  symbol: string;
  quantity: number;
  currentValue: number;
  percentageChange: number;
};

type TableComponentType = {
  assetList: AssetType[];
};

export type { AssetType, TableComponentType };
