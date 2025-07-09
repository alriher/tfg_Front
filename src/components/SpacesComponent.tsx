import { useEffect, useState } from "react";
import SpaceCard from "./SpaceCard";
import { ISpace } from "../interfaces/space";
import { getSpaces } from "../services/SpacesService";
import { Pagination, PaginationItemType } from "@nextui-org/react";
import SpacesFilter from "./SpacesFilter";

const ChevronIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M15.5 19l-7-7 7-7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

function SpacesComponent() {
  const [spaces, setSpaces] = useState<ISpace[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);
  // Estados "reales" para la búsqueda
  const [filterProvincia, setFilterProvincia] = useState("");
  const [filterLocalidad, setFilterLocalidad] = useState("");
  const [filterName, setFilterName] = useState("");
  // Estados locales para los inputs
  const [inputProvincia, setInputProvincia] = useState("");
  const [inputLocalidad, setInputLocalidad] = useState("");
  const [inputName, setInputName] = useState("");

  const fetchSpaces = () => {
    getSpaces(page, pageSize, {
      provincia: filterProvincia,
      localidad: filterLocalidad,
      name: filterName,
    }).then((res) => {
      // Protección extra: si res no existe o no tiene spaces, forzamos array vacío
      const safeSpaces = res && Array.isArray(res.spaces) ? res.spaces : [];
      setSpaces(safeSpaces);
      setTotal(res && typeof res.total === 'number' ? res.total : 0);
    }).catch(() => {
      setSpaces([]);
      setTotal(0);
    });
  };

  useEffect(() => {
    fetchSpaces();
    // eslint-disable-next-line
  }, [page, pageSize, filterProvincia, filterLocalidad, filterName]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    // Si hay algún cambio en los filtros o la página, actualiza y fuerza la búsqueda
    if (
      filterProvincia !== inputProvincia ||
      filterLocalidad !== inputLocalidad ||
      filterName !== inputName ||
      page !== 1
    ) {
      setPage(1);
      setFilterProvincia(inputProvincia);
      setFilterLocalidad(inputLocalidad);
      setFilterName(inputName);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }: any) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={"bg-default-200/50 min-w-8 w-8 h-8 " + className}
          onClick={onNext}
        >
          <ChevronIcon className="rotate-180" />
        </button>
      );
    }
    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={"bg-default-200/50 min-w-8 w-8 h-8 " + className}
          onClick={onPrevious}
        >
          <ChevronIcon />
        </button>
      );
    }
    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={className}>
          ...
        </button>
      );
    }
    return (
      <button
        key={key}
        ref={ref}
        className={
          (isActive
            ? "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold "
            : "") + className
        }
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <>
      <div className="mt-4">
      <SpacesFilter
        filterProvincia={inputProvincia}
        setFilterProvincia={setInputProvincia}
        filterLocalidad={inputLocalidad}
        setFilterLocalidad={setInputLocalidad}
        filterName={inputName}
        setFilterName={setInputName}
        onSubmit={handleFilter}
        expandNameInput={true}
      />
      </div>

      <div className="px-6 container m-auto grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {spaces.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12 text-lg">
            No hay espacios creados actualmente.
          </div>
        ) : (
          spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))
        )}
      </div>
      <div className="flex justify-center items-center gap-4 mt-4">
        <Pagination
          disableCursorAnimation
          showControls
          className="gap-2"
          initialPage={1}
          radius="full"
          renderItem={renderItem}
          total={totalPages}
          variant="light"
          page={page}
          onChange={setPage}
        />
      </div>
    </>
  );
}

export default SpacesComponent;
