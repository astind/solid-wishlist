import { useSearchParams } from "@solidjs/router";
import { For, mergeProps } from "solid-js";

type SortOptions = {
  name: string;
  value: string;
}

export default function SortInput(props: SortOptions[] | {}) {
  const merged = mergeProps(
    [
      {name: "Price: High to Low", value: "price-up"},
      {name: "Price: Low to High", value: "price-down"},
      {name: "Name", value: "name"},
      {name: "Date Added", value: "date"}
      //{name: "Rank", value: "rank"}
    ], props
  );

  const [searchParams, setSearchParams] = useSearchParams();

  function sortChanged(value: string) {
    setSearchParams({sort: value}, {replace: true});
  }

  return (
    <select class="select" onChange={(e) => sortChanged(e.currentTarget.value)}>
      <option disabled selected={!searchParams.sort}>Sort By</option>
      <For each={merged}>
        {(option) => (
          <option value={option.value} selected={searchParams.sort === option.value}>{option.name}</option>
        )}
      </For>
    </select>
  )
}