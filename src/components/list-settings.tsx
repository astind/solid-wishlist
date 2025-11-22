import { useSubmission } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js"
import { updateListAction } from "~/api/lists/lists.actions";
import { List } from "~/api/models/list.model";

export type ListSettingsProp = {
  list: List
  groups?: any[],
  shared?: any[],
  modalId: string
}


export default function ListSettings(props: ListSettingsProp) {
  const listName = props.list.name;
  const [section, setSection] = createSignal("list");
  const [updateMessage, setUpdateMessage] = createSignal<string>();
  const [showWarning, setShowWarning] = createSignal<boolean>(false);
  const listSubmission = useSubmission(updateListAction);

  createEffect(() => {
    if (listSubmission.result) {
      // display result
      setUpdateMessage(listSubmission.result.message);
    }
    if (listSubmission.error) {
      setUpdateMessage(listSubmission.error);
    }
  })

  function closeModal() {
    const modal = document.getElementById(props.modalId) as any;
    modal?.close();
    setSection("list");
    setUpdateMessage(undefined);
  }

  const onCheckboxChange = (event: any) => {
    setSection(event.target.value)
  }

  function nameChangeWarning(value: string) {
    setShowWarning(listName !== value);
  }

  return (
    <div class="modal-box">
      <h3 class="text-lg font-bold">{props.list.name} Settings:</h3>
      <div class="collapse collapse-arrow bg-base-200 border-base-300 border mt-4">
        <input type="radio" name="list-settings" value="list" checked={section() === 'list'} onChange={onCheckboxChange} />
        <div class="collapse-title font-semibold">List Details</div>
        <div class="collapse-content">
          <form method="post" action={updateListAction}>
            <fieldset class="fieldset w-full px-4">
              <input type="hidden" name="listId" value={props.list.id} />
              <label class="label" for="name">Name:</label>
              <input type="text" id="name" class="input w-full" placeholder="Name" name="name" value={props.list.name} onInput={(e) => nameChangeWarning(e.currentTarget.value)}/>
              <Show when={showWarning()}>
                <p class="text-warning">Changing list name will redirect you back to your lists home page.</p>
              </Show>

              <label class="label" for="description">Description</label>
              <input type="text" class="input w-full" id="description" name="description" value={props.list.description || ""} placeholder="Description" />

              <label class="label" for="list-type">List Type:</label>
              <select name="listType" id="list-type" class="select" value={props.list.listType}>
                <option value="checklist">Checklist</option>
                <option value="wishlist">Wishlist</option>
              </select>

              <label class="label mt-2">
                <input type="checkbox" class="checkbox" name="private" checked={props.list.private} />
                Private
              </label>
              <p class="label">Private lists cannot be found with a link.</p>

              <div class="flex mt-2">
                <p></p>
              </div>
              <div class="flex justify-between space-x-4">
                <div class="flex items-center">
                  <Show when={updateMessage() !== undefined}>
                    <p>
                      {updateMessage()}
                    </p>
                  </Show>
                </div>
                <button type="submit" class="btn btn-info">Save</button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
      <div class="collapse collapse-arrow bg-base-200 border-base-300 border mt-4">
        <input type="radio" name="list-settings" value="groups" checked={section() === 'groups'} onChange={onCheckboxChange} />
        <div class="collapse-title font-semibold">List Groups</div>
        <div class="collapse-content">
          <Show when={props.groups?.length} fallback={<div>List has not been shared to any groups</div>}>
            <div>
              {
                // Add a for loop here
              }
            </div>
          </Show>
        </div>
      </div>

      <div class="collapse collapse-arrow bg-base-200 border-base-300 border mt-4">
        <input type="radio" name="list-settings" value="shared" checked={section() === 'shared'} onChange={onCheckboxChange} />
        <div class="collapse-title font-semibold">Shared Users:</div>
        <div class="collapse-content">
          <Show when={props.shared?.length} fallback={<div>List has not been shared with any users</div>}>
            <div>
              {
                // Add a for loop here
              }
            </div>
          </Show>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn" type="button" onClick={closeModal}>Close</button>
      </div>
    </div>
  )
}