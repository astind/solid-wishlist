import { A, createAsync, NavigateOptions, revalidate, useParams, useSearchParams, type RouteDefinition } from "@solidjs/router";
import { createEffect, createSignal, For, Match, Show, Suspense, Switch } from "solid-js";
import { getPublicListItemsQuery, toggleCompleteAction } from "~/api/lists/lists.actions";
import { ListSortOptions } from "~/api/models/list.model";
import { getUserLocalsQuery } from "~/api/users/users.actions";
import WarningModal from "~/components/warning-modal";
import WishlistItem from "~/components/wishlist-item";

export const route = {
  preload: ({ params, location }) => getPublicListItemsQuery(params.id, location.query.sort as ListSortOptions || undefined)
} satisfies RouteDefinition

export default function PublicListPage() {
  const pageParams = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const list = createAsync(() => getPublicListItemsQuery(pageParams.id, searchParams.sort as ListSortOptions || undefined));
  const user = createAsync(() => getUserLocalsQuery(false));
  const [warning, setWarning] = createSignal<"close" | "confirm" | "open">("close");

  function openModal() {
    const element = document.getElementById("public-list-warning") as any;
    element?.showModal();
  }

  function closeModal() {
    const element = document.getElementById("public-list-warning") as any;
    element?.close();
  }

  function sortChanged(value: string) {
    setSearchParams({sort: value}, {replace: true});
  }

  createEffect(() => {
    if (warning() === "open") {
      openModal();
    } else if (warning() === "close") {
      closeModal();
    }
  })

  return (
    <Suspense fallback={<div>Loading List...</div>}>
      <div class="flex flex-col">

        <div class="flex flex-col">
          <p class="text-sm">Public View:</p>
          <Show when={user() === undefined}>
            <p class="text-sm mt-2">Contributing to public lists is easier if you are logged in!</p>
            <div>
              <A class="btn btn-outline mt-1" href="/login">Login/Register</A>
            </div>
          </Show>
        </div>

        <dialog id="public-list-warning" class="modal">
          <WarningModal
            title="Mark as bought?"
            text="Since you are not logged in/registered, this is a permanent action. It cannot be undone, and others will not be able to mark this as bought. Continue with change?"
            responseSetter={setWarning}
          ></WarningModal>
        </dialog>

        <div class="flex flex-col items-center space-y-2 mt-4">
          <h1 class="text-2xl mt-4 lg:mt-0 font-semibold">{list()?.name}</h1>
          <p>{list()?.description}</p>
        </div>
        <div class="flex justify-end mt-4">
          <select class="select" onChange={(e) => sortChanged(e.currentTarget.value)}>
            <option disabled selected={!searchParams.sort}>Sort By</option>
            <option value="price-up" selected={searchParams.sort === 'price-up'}>Price: High to Low</option>
            <option value="price-down" selected={searchParams.sort === 'price-down'}>Price: Low to High</option>
            <option value="name" selected={searchParams.sort === 'name'}>Name</option>
            <option value="date" selected={searchParams.sort === 'date'}>Date Added</option>
            {/* <option value="rank" selected={searchParams.sort === 'rank'}>Rank</option> */}
          </select>
        </div>
        <ul class="bg-base-100 rounded-box shadow-md p-5 mt-2">
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
                    item={{ name: item.name, description: item.description || undefined, url: item.url || undefined, price: item.price || undefined, iconLink: item.iconLink || undefined, done: item.done, doneBy: item.doneBy || undefined }}
                    index={index()}
                    canEdit={false}
                    toggleAction={toggleCompleteAction}
                    currentUserId={user()?.id}
                    warningSetter={setWarning}
                    warningSignal={warning()}
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