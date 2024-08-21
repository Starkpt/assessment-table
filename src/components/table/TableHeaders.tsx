import React from "react";
import { ColumnData, DataItem, TableHeadersProps } from "../../types/types";

export function addTableHeaderCell(
  acc: ColumnData[],
  cur: DataItem,
  levelKeys: string[],
  depth = 0
): ColumnData[] {
  const parentKey = levelKeys[depth - 1] as keyof typeof cur.location;
  const parentValue = cur.location[parentKey];

  const currentKey = levelKeys[depth] as keyof typeof cur.location;
  const currentValue = cur.location[currentKey];

  // Find the current column entry
  let cellItem = acc.find((entry) => entry.columnValue === currentValue);

  if (!cellItem) {
    // If the column doesn't exist, create a placeholder one
    cellItem = {
      depth,
      columnValue: currentValue,
      parentColumnValue: parentValue,
    };

    acc.push(cellItem);
  }
  // If there's another level, recursively add a subItems
  if (depth < levelKeys.length - 1) {
    if (!cellItem.subColumns) {
      cellItem.subColumns = [];
    }
    addTableHeaderCell(cellItem.subColumns, cur, levelKeys, depth + 1);
  }

  return acc;
}

export function createTableHeaders({
  data,
  levelKeys,
}: {
  data: DataItem[];
  levelKeys: string[];
}): ColumnData[] {
  return data.reduce((acc: ColumnData[], cur: DataItem) => {
    return addTableHeaderCell(acc, cur, levelKeys);
  }, []);
}

function TableHeaders({ headerColumns, handleColumnVisibility, hiddenColumns }: TableHeadersProps) {
  const renderHeaders = (columnData: ColumnData[]) => {
    return columnData.map((column, index) => (
      <React.Fragment key={column.columnValue + index}>
        <th
          colSpan={1}
          style={{
            display:
              hiddenColumns.includes(column.columnValue) ||
              hiddenColumns.includes(column.parentColumnValue ? column.parentColumnValue : "")
                ? "none"
                : "table-cell",
          }}
        >
          {column.columnValue}

          {column.subColumns && (
            <button onClick={() => handleColumnVisibility(column.subColumns)}>
              {hiddenColumns.includes(column.columnValue) &&
              hiddenColumns.includes(column.parentColumnValue ? column.parentColumnValue : "")
                ? "<"
                : ">"}
            </button>
          )}
        </th>

        {/* Recursively render existing subColumns */}
        {column.subColumns && column.subColumns.length > 0 && renderHeaders(column.subColumns)}
      </React.Fragment>
    ));
  };

  return <>{headerColumns && renderHeaders(headerColumns)}</>;
}

export default TableHeaders;
