import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { createEffect, createSignal, For, Match, Show, Suspense, Switch } from "solid-js";
import { getPublicListItemsQuery, toggleCompleteAction } from "~/api/lists/lists.actions";
import { getUserLocalsQuery } from "~/api/users/users.actions";
import WarningModal from "~/components/warning-modal";
import WishlistItem from "~/components/wishlist-item";

export const route = {
  preload: ({ params }) => getPublicListItemsQuery(params.id)
} satisfies RouteDefinition

export default function PublicListPage() {
  const pageParams = useParams();
  const list = createAsync(() => getPublicListItemsQuery(pageParams.id));
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