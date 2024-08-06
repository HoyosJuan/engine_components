import { Event } from "./event";

/**
 * A class that extends the built-in Map class and provides additional events for item set, update, delete, and clear operations.
 *
 * @template K - The type of keys in the map.
 * @template V - The type of values in the map.
 */
export class DataMap<K, V> extends Map<K, V> {
  /**
   * An event triggered when a new item is set in the map.
   */
  readonly onItemSet = new Event<{ key: K; value: V }>();

  /**
   * An event triggered when an existing item in the map is updated.
   */
  readonly onItemUpdated = new Event<{ key: K; value: V }>();

  /**
   * An event triggered when an item is deleted from the map.
   */
  readonly onItemDeleted = new Event();

  /**
   * An event triggered when the map is cleared.
   */
  readonly onCleared = new Event();

  /**
   * Constructs a new DataMap instance.
   *
   * @param iterable - An iterable object containing key-value pairs to populate the map.
   */
  constructor(iterable?: Iterable<readonly [K, V]> | null | undefined) {
    super(iterable);
  }

  /**
   * Clears the map and triggers the onCleared event.
   */
  clear() {
    super.clear();
    this.onCleared.trigger();
  }

  /**
   * Sets the value for the specified key in the map and triggers the appropriate event (onItemSet or onItemUpdated).
   *
   * @param key - The key of the item to set.
   * @param value - The value of the item to set.
   * @returns The DataMap instance.
   */
  set(key: K, value: V) {
    const triggerUpdate = this.has(key);
    const result = super.set(key, value);
    if (triggerUpdate) {
      if (!this.onItemUpdated) {
        (this.onItemUpdated as any) = new Event<{ key: K; value: V }>();
      }
      this.onItemUpdated.trigger({ key, value });
    } else {
      if (!this.onItemSet) {
        (this.onItemSet as any) = new Event<{ key: K; value: V }>();
      }
      this.onItemSet.trigger({ key, value });
    }
    return result;
  }

  /**
   * Deletes the specified key from the map and triggers the onItemDeleted event if the key was found.
   *
   * @param key - The key of the item to delete.
   * @returns True if the key was found and deleted; otherwise, false.
   */
  delete(key: K) {
    const deleted = super.delete(key);
    if (deleted) this.onItemDeleted.trigger();
    return deleted;
  }

  /**
   * Clears the map and resets the events.
   */
  dispose() {
    this.clear();
    this.onItemSet.reset();
    this.onItemDeleted.reset();
    this.onCleared.reset();
  }
}
