import { useState } from "react";
import dummy_data from "../../data/dummy_data.json";
import { ColumnData, DataItem } from "../../types/types";
import TableHeaders, { createTableHeaders } from "./TableHeaders";
import TableColumns, { createTableColumns, createRows, createNewRows } from "./TableColumns";

function TableComponent() {
  // const [data, setData] = React.useState(() => makeData(4));

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

  const levelKeys = ["continent", "country", "city"];
  const headerColumns = createTableHeaders({ data, levelKeys });
  const tableColumns = createTableColumns({ data, levelKeys });
  const rows = createNewRows(headerColumns, tableColumns);

  return (
    <div>
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

        <tbody>
          {rows &&
            rows.map((row) => {
              console.log(row);
              return (
                <>
                  <tr
                    className="row"
                    style={{
                      border: "1px solid black",
                      display: "table-row",
                    }}
                  >
                    <td>{row.name}</td>

                    <td style={{ border: "1px solid black" }}>
                      <table>
                        <thead>
                          <tr>
                            <td>Units</td>
                          </tr>
                          <tr>
                            <td>Unit Price</td>
                          </tr>
                          <tr>
                            <td>Gross Revenue</td>
                          </tr>
                        </thead>
                      </table>
                    </td>

                    <TableColumns
                      columns={row.columns}
                      headerColumns={tableColumns}
                      hiddenColumns={hiddenColumns}
                    />
                  </tr>
                </>
              );
            })}
        </tbody>
      </table>

      <pre>{JSON.stringify(hiddenColumns, null, 2)}</pre>
    </div>
  );
}

export default TableComponent;
