import { createContext, ReactNode } from "react";
import { IMunicipality } from "../interfaces/municipality";
import { IProvince } from "../interfaces/province";
import { CalendarDate } from "@internationalized/date";

export interface ISearchContext {
  municipality: IMunicipality | null;
  province: IProvince | null;
  entryDate: CalendarDate | null;
  schedule: string | null;
}

const SearchContext = createContext<ISearchContext | null>(null);

export default function SearchProvider({ children }: { children: ReactNode }) {
  return (
    <SearchContext.Provider
      value={{
        municipality: null,
        province: null,
        entryDate: null,
        schedule: null,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
