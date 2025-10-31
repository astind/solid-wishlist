import { createAsync, revalidate, type RouteDefinition, useParams, useSubmission } from "@solidjs/router"
import { createEffect, createSignal, For, Match, onMount, Show, Suspense, Switch } from "solid-js";
import { addChecklistItemAction, addWishlistItemAction, deleteCompletedAction, deleteListItemAction, getListItemsQuery, toggleCompleteAction, updateListItemAction } from "~/api/lists/lists.actions";
import ChecklistForm from "~/components/checklist-form";
import ChecklistItem from "~/components/checklist-item";
import ListSettings from "~/components/list-settings";
import WishlistForm from "~/components/wishlist-form";
import WishlistItem from "~/components/wishlist-item";

export const route = {
  preload: ({ params }) => getListItemsQuery(params.name),
} satisfies RouteDefinition


export default function ListPage() {
  const pageParams = useParams();
  const list = createAsync(() => getListItemsQuery(pageParams.name));
  const [isNewItemOpen, setIsNewItemOpen] = createSignal(false);
  const [isEditOpen, setIsEditOpen] = createSignal(-1);
  const [isDeleteOpen, setIsDeleteOpen] = createSignal(-1);
  const [checkedCount, setCheckedCount] = createSignal(0);
  const deleteCompletedSubmission = useSubmission(deleteCompletedAction);
  const deleteItemSubmission = useSubmission(deleteListItemAction);
  //const editItemSubmission
  let addNewSubmission;
  if (list()?.listType === "wishlist") {
    addNewSubmission = useSubmission(addWishlistItemAction);
  } else {
    addNewSubmission = useSubmission(addWishlistItemAction);
  }

  onMount(() => {
    countChecked();
  });

  createEffect(() => {
    if (deleteCompletedSubmission.result) {
      console.log(deleteCompletedSubmission.result);
      revalidateList();
      setCheckedCount(0);
      deleteCompletedSubmission.clear();
    }
  })

  createEffect(() => {
    if (addNewSubmission.result) {
      console.log(addNewSubmission.result);
      revalidateList()
      setIsNewItemOpen(false);
      console.log('close new form');
      addNewSubmission.clear();
    }
  })

  createEffect(() => {
    if (deleteItemSubmission.result) {
      console.log(deleteItemSubmission.result)
      setIsDeleteOpen(-1);
      revalidateList();
      countChecked();
      deleteItemSubmission.clear();
    }
  })

  createEffect(() => {
    console.log(checkedCount());
  })

  function revalidateList() {
    revalidate(getListItemsQuery.key);
  }

  function openSettings() {
    const modal = document.getElementById("list-settings-modal") as any;
    modal?.showModal();
  }

  function countChecked() {
    if (list() && list()!.items.length) {
      if (list()!.listType === "checklist" && list()!.items.length) {
        const items = list()!.items;
        let doneCount = 0;
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (items[index].done) {
            doneCount += 1;
          }
        }
        setCheckedCount(doneCount);
      }
    }
  }

  return (
    <Suspense fallback={<div>Loading List...</div>}>
      <div class="flex justify-between md:justify-end space-x-4">
        <div class="space-x-4">
          <button class="btn btn-square" type="button" aria-label="Settings" title="Settings" onClick={openSettings}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>

          <Show when={list()?.private}>
            <button class="btn btn-square" type="button" aria-label="Share" title="Share">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            </button>
          </Show>

        </div>

        <button class="btn btn-square" onClick={() => setIsNewItemOpen(true)} aria-label="Add Item" title="Add Item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
      </div>

      <dialog id="list-settings-modal" class="modal">
        <Show when={list()}>
          <ListSettings
            listname={list()!.name}
            description={list()!.description || undefined}
            listType={list()!.listType}
            private={list()!.private}
            groups={list()?.groups}
            shared={list()?.shared}
            modalId="list-settings-modal"
          >
          </ListSettings>
        </Show>
      </dialog>

      <div class="flex flex-col items-center space-y-2">
        <h1 class="text-2xl mt-4 lg:mt-0 font-semibold">{list()?.name}</h1>
        <p >{list()?.description}</p>
      </div>

      <Show when={isNewItemOpen()}>
        <Switch>
          <Match when={list()?.listType === 'checklist'}>
            <ChecklistForm 
              listId={list()!.id} 
              formOpenSetter={setIsNewItemOpen} 
              formAction={addChecklistItemAction}
              wrapperClass="flex justify-center mt-4"
              >
            </ChecklistForm>
          </Match>
          <Match when={list()?.listType === "wishlist"}>
            <WishlistForm 
              listId={list()!.id} 
              formOpenSetter={setIsNewItemOpen} 
              formAction={addWishlistItemAction}
              wrapperClass="flex justify-center mt-4"
            >
            </WishlistForm>
          </Match>
        </Switch>
      </Show>

      <div class="flex mt-4 justify-between items-center min-h-10">
        <h2 class="text-xl font-semibold">Items:</h2>
        <Show when={list()?.listType === "checklist" && checkedCount() > 0}>
          <form action={deleteCompletedAction} method="post">
            <input type="hidden" name="listId" value={list()?.id} />
            <button class="btn btn-square" type="submit" aria-label="Delete all checked items">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </button>
          </form>
        </Show>
      </div>

      <ul class="bg-base-100 rounded-box shadow-md p-5">
        <For each={list()?.items}>
          {(item, index) => (
            <Switch>
              <Match when={list()?.listType === "checklist"}>
                <ChecklistItem
                  itemId={item.id}
                  listId={list()!.id}
                  checked={item.done}
                  name={item.name}
                  index={index()}
                  toggleAction={toggleCompleteAction}
                  deleteAction={deleteListItemAction}
                  editAction={updateListItemAction}
                  openEditSetter={setIsEditOpen}
                  openDeleteSetter={setIsDeleteOpen}
                  editIndex={isEditOpen()}
                  deleteIndex={isDeleteOpen()}
                  checkedSetter={setCheckedCount}
                ></ChecklistItem>
              </Match>
              <Match when={list()?.listType === "wishlist"}>
                <WishlistItem
                  itemId={item.id}
                  listId={list()!.id}
                  item={{name: item.name, description: item.description || undefined, url: item.url || undefined, price: item.price || undefined, iconLink: item.iconLink || undefined}}
                  index={index()}
                  editIndex={isEditOpen()}
                  deleteIndex={isDeleteOpen()}
                  openEditSetter={setIsEditOpen}
                  openDeleteSetter={setIsDeleteOpen}
                  deleteAction={deleteListItemAction}
                  editAction={updateListItemAction}
                ></WishlistItem>
              </Match>
            </Switch>
          )}
        </For>
      </ul>

    </Suspense>
  )
}