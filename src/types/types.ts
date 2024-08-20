export type DataItem = {
  version: string;
  entryType: string;
  productType: string | null;
  productSubtype: string | null;
  units: number;
  grossRevenue: number;
  legalEntity: number;
  location: Location;
  unitPrice?: UnitPrice[];
};

export type Location = {
  continent: string;
  country: string;
  city: string;
};

export type UnitPrice = {
  currencyCode?: string;
  currency?: string;
  value?: number;
};

export type TableHeadersProps = {
  headerColumns?: ColumnData[];
  handleColumnVisibility?: any;
  hiddenColumns: string[];
};

export type ColumnData = {
  depth: number;
  cellId?: string;
  columnValue: string;
  parentColumnValue?: string;
  subColumns?: ColumnData[];

  grossRevenue?: number;
  units?: number;
  unitPrice?: UnitPrice[];
};
