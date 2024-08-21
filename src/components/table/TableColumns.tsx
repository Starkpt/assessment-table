import React from "react";
import { ColumnData, DataItem, Product, TableBodyProps } from "../../types/types";
import _ from "lodash";
import { accessSync } from "fs";

export function addTableCell(
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
    // If the column doesn't exist, create a new one
    cellItem = {
      depth,
      columnValue: currentValue,
      parentColumnValue: parentValue,
      grossRevenue: cur.grossRevenue,
      parentCategoryId: cur.product?.parentCategoryId,
      categoryId: cur.product?.categoryId,
      units: cur.units,
      unitPrice: [
        {
          currencyCode: "eur",
          currency: "Euro",
          value: 0,
        },
        {
          currencyCode: "usd",
          currency: "US Dollar",
          value: 0,
        },
      ],
    };
    acc.push(cellItem);
  }

  if (depth < levelKeys.length - 1) {
    addTableCell(acc, cur, levelKeys, depth + 1);
  }

  return acc;
}

export function createTableColumns({
  data,
  levelKeys,
}: {
  data: DataItem[];
  levelKeys: string[];
}): ColumnData[] {
  return data.reduce((acc: ColumnData[], cur: DataItem) => {
    return addTableCell(acc, cur, levelKeys);
  }, []);
}

export function createNewRows(headers: ColumnData[], columns: ColumnData[]) {
  const groupRows = _.groupBy(columns, "categoryId");

  const rows = Object.entries(groupRows).map((row: [string, ColumnData[]], index) => {
    return {
      depth: index,
      name: row[0],
      columns: row[1],
    };
  });

  return rows;
}

export function createRows(data: DataItem[]) {
  const groupRows = _.groupBy(data, "product.categoryId");

  const rows = Object.entries(groupRows).map((row: [string, DataItem[]], index) => {
    return {
      depth: index,
      name: row[0],
      columns: createTableColumns({
        data: row[1],
        levelKeys: ["continent", "country", "city"],
      }),
    };
  });

  console.log(rows);

  return rows;
}

function TableColumns({
  columns,
  headerColumns,
  hiddenColumns,
  currencyCode = "eur",
}: TableBodyProps) {
  // Recursive function to build headers with hierarchical structure based on the level keys

  const columnsWithPlaceholders = headerColumns?.reduce((acc, cur) => {
    const column = columns?.find((col) => col.columnValue === cur.columnValue);

    if (!column) {
      const emptyCell = {
        ...cur,
        grossRevenue: 0,
        units: 0,
        unitPrice: [
          {
            currencyCode: "eur",
            currency: "Euro",
            value: 0,
          },
          {
            currencyCode: "usd",
            currency: "US Dollar",
            value: 0,
          },
        ],
      };

      cur = emptyCell;
    } else {
      cur = column;
    }

    // @ts-ignore
    acc.push(cur);
    return acc;
  }, []);

  const renderCells = (headers: ColumnData[]) => {
    return headers.map((column, index) => {
      const priceValue = column.unitPrice?.find(
        (price) => price.currencyCode === currencyCode
      )?.value;

      return (
        <React.Fragment key={index}>
          <td
            colSpan={1}
            style={{
              border: "1px solid black",
              display:
                hiddenColumns.includes(column.columnValue) ||
                hiddenColumns.includes(column.parentColumnValue ? column.parentColumnValue : "")
                  ? "none"
                  : "table-cell",
            }}
          >
            <table>
              <tbody>
                <tr>
                  <td>{column.units}</td>
                </tr>
                <tr>
                  <td>{priceValue}</td>
                </tr>
                <tr>
                  <td>{column.grossRevenue}</td>
                </tr>
              </tbody>
            </table>
          </td>

          {column.subColumns && column.subColumns.length > 0 && renderCells(column.subColumns)}
        </React.Fragment>
      );
    });
  };

  return <>{columnsWithPlaceholders && renderCells(columnsWithPlaceholders)}</>;
}

export default TableColumns;
