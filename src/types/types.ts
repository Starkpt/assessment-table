export type DataItem = {
  version: string;
  units: number;
  grossRevenue: number;
  legalEntity: number;
  location: Location;
  unitPrice?: UnitPrice[];
  product?: Product;
};

type Category = string | null;

export type Product = {
  parentCategoryId: Category;
  parentCategory: Category;
  categoryId: Category;
  category: Category;
  subCategoryId: Category;
  subCategory: Category;
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

export type TableBodyProps = {
  columns?: ColumnData[];
  headerColumns?: ColumnData[];
  hiddenColumns: string[];
  currencyCode?: string;
};

export type ColumnData = {
  depth: number;
  cellId?: string;
  columnValue: string;
  parentColumnValue?: string;
  subColumns?: ColumnData[];

  parentCategoryId?: string | null;
  categoryId?: string | null;

  grossRevenue?: number;
  units?: number;
  unitPrice?: UnitPrice[];
};
