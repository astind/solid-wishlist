import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { For, Match, Suspense, Switch } from "solid-js";
import { getPublicListItemsQuery } from "~/api/lists/lists.actions";
import WishlistItem from "~/components/wishlist-item";

export const route = {
  preload: ({ params }) => getPublicListItemsQuery(params.id)
} satisfies RouteDefinition

export default function PublicListPage() {
  const pageParams = useParams();
  const list = createAsync(() => getPublicListItemsQuery(pageParams.id));

  return (
    <Suspense fallback={<div>Loading List...</div>}>
      <div class="flex flex-col">

        <div class="flex">
          <p class="text-sm">Public View:</p>
        </div>

        <div class="flex flex-col items-center space-y-2 mt-4">
          <h1 class="text-2xl mt-4 lg:mt-0 font-semibold">{list()?.name}</h1>
          <p>{list()?.description}</p>
        </div>
        


        <ul class="bg-base-100 rounded-box shadow-md p-5 mt-4">
          <For each={list()?.items}>
            {(item, index) => (
              <Switch>
                <Match when={list()?.listType === "checklist"}>
                  <div></div>
                </Match>
                <Match when={list()?.listType === "wishlist"}>
                  <WishlistItem
                    itemId={item.id}
                    listId={list()!.id}
                    item={{ name: item.name, description: item.description || undefined, url: item.url || undefined, price: item.price || undefined, iconLink: item.iconLink || undefined, done: item.done }}
                    index={index()}
                    canEdit={false}
                  ></WishlistItem>
                </Match>
              </Switch>
            )}
          </For>
        </ul>

      </div>
    </Suspense>
  )
}