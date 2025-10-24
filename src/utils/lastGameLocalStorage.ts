import ProfileStore from "../singletons/cacheStores/ProfileStore";

const getUserEmail = () => ProfileStore.instance.email;

const getUserLastGameKey = () => `${getUserEmail()}LastGame`;

const getUserTimestampKey = () => `${getUserEmail()}LastGameOn`;

/**
 * Save the last game into Local Storage
 * @param json JSON string
 * @author Daniel Desira
 */
export const saveLastGameLocalStorage = (json: string) =>
  localStorage.setItem(getUserLastGameKey(), json);

/**
 * Fetch the last game from Local Storage
 * @author Daniel Desira
 * @returns JSON string | null
 */
export const getLastGameLocalStorage = () =>
  localStorage.getItem(getUserLastGameKey());

/**
 * Delete the last game from Local Storage
 * @author Daniel Desira
 */
export const deleteLastGameLocalStorage = () =>
  localStorage.removeItem(getUserLastGameKey());

/**
 * Save the last game's timestamp into Local Storage
 * @param timestamp Timestamp
 * @author Daniel Desira
 */
export const saveLastGameTimestampLocalStorage = (
  timestamp: number = Date.now()
) => localStorage.setItem(getUserTimestampKey(), timestamp.toString());

/**
 * Fetch the last game's timestamp from Local Storage
 * @author Daniel Desira
 * @returns Timestamp as string | null
 */
export const getLastGameTimestampLocalStorage = () =>
  localStorage.getItem(getUserTimestampKey());

/**
 * Delete the last game's timestamp from Local Storage
 * @author Daniel Desira
 */
export const deleteLastGameTimestampLocalStorage = () =>
  localStorage.removeItem(getUserTimestampKey());
