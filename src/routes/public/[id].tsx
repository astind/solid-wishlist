import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Suspense } from "solid-js";
import { getPublicListItemsQuery } from "~/api/lists/lists.actions";

export const route = {
  preload: ({params}) => getPublicListItemsQuery(params.id) 
} satisfies RouteDefinition

export default function PublicListPage() {
  const pageParams = useParams();
  const list = createAsync(() => getPublicListItemsQuery(pageParams.id));

  return (
    <Suspense fallback={<div>Loading List...</div>}>
      <div class="flex flex-col">
        <div class="flex flex-col items-center space-y-2 mt-4">
          <h1 class="text-2xl mt-4 lg:mt-0 font-semibold">{list()?.name}</h1>
          <p>{list()?.description}</p>
        </div>
      </div>
    </Suspense>
  )
}