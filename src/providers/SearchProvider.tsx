import { createContext, ReactNode, useContext } from "react";
import { CalendarDate } from "@internationalized/date";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { today } from "@internationalized/date";
export interface ISearchContextForm {
  province: string | null;
  municipality: string | null;
  entryDate: CalendarDate | null;
  schedule: string | null;
}

const SearchContext = createContext<
  UseFormReturn<ISearchContextForm> | undefined
>(undefined);

export default function SearchProvider({ children }: { children: ReactNode }) {
  const methods = useForm<ISearchContextForm>({
    defaultValues: {
      province: "02",
      municipality: null,
      entryDate: today("Europe/Madrid"),
      schedule: null,
    },
  });

  return (
    <FormProvider {...methods}>
      <SearchContext.Provider value={methods}>
        {children}
      </SearchContext.Provider>
    </FormProvider>
  );
}

export function useSearchFormContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error(
      "useSearchFormContext must be used within a SearchProvider"
    );
  }

  return context;
}
