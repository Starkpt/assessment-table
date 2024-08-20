import { useState } from "react";
import dummy_data from "../../data/dummy_data.json";
import { ColumnData, DataItem } from "../../types/types";
import TableHeaders, { createTableHeaders } from "./TableHeaders";

function TableComponent() {
  const [data, setData] = useState<DataItem[]>(dummy_data);

  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  const handleColumnVisibility = (columnNames: ColumnData[]) => {
    columnNames &&
      columnNames.map((columnName) =>
        setHiddenColumns((prevVisibility) =>
          prevVisibility.includes(columnName.columnValue)
            ? prevVisibility.filter((column) => column !== columnName.columnValue)
            : [...prevVisibility, columnName.columnValue]
        )
      );
  };

  const headerColumns = createTableHeaders({
    data,
    levelKeys: ["continent", "country", "city"],
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>

            <TableHeaders
              headerColumns={headerColumns}
              hiddenColumns={hiddenColumns}
              handleColumnVisibility={handleColumnVisibility}
            />
          </tr>
        </thead>
      </table>

      <pre>{JSON.stringify(hiddenColumns, null, 2)}</pre>
    </div>
  );
}

export default TableComponent;
