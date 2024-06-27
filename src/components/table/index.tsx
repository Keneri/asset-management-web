import Row from "./row";

import { TableComponentType } from "./type";

function Table({ assetList, setAssetList }: TableComponentType) {
  const rows = assetList.map((asset, index) => (
    <Row
      assetList={assetList}
      setAssetList={setAssetList}
      asset={asset}
      index={index}
      key={index}
    />
  ));

  return (
    <div className="overflow-x-auto hide-scrollbar">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Current Value (USD)</th>
            <th>24H % Change</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default Table;
