import { Country, Month, Category } from "./foodItem";

export interface QueryParams {
  country?: Country;
  month?: Month;
  categories?: Category[];
  beta?: boolean;
}
