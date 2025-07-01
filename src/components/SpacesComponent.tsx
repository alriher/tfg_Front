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
  const [filterProvincia, setFilterProvincia] = useState("");
  const [filterLocalidad, setFilterLocalidad] = useState("");
  const [filterName, setFilterName] = useState("");

  const fetchSpaces = () => {
    getSpaces(page, pageSize, {
      provincia: filterProvincia,
      localidad: filterLocalidad,
      name: filterName,
    }).then((res) => {
      setSpaces(res.spaces);
      setTotal(res.total);
    });
  };

  useEffect(() => {
    fetchSpaces();
    // eslint-disable-next-line
  }, [page, pageSize]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    getSpaces(1, pageSize, {
      provincia: filterProvincia,
      localidad: filterLocalidad,
      name: filterName,
    }).then((res) => {
      setSpaces(res.spaces);
      setTotal(res.total);
    });
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
          filterProvincia={filterProvincia}
          setFilterProvincia={setFilterProvincia}
          filterLocalidad={filterLocalidad}
          setFilterLocalidad={setFilterLocalidad}
          filterName={filterName}
          setFilterName={setFilterName}
          onSubmit={handleFilter}
          expandNameInput={true}
        />
      </div>

      <div className="px-6 container m-auto grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
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
