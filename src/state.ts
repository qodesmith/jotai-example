import {createStore, ExtractAtomValue, PrimitiveAtom, atom} from 'jotai'
import {RESET, atomWithDefault, atomWithStorage, atomFamily} from 'jotai/utils'

export const currentJotaiStore = {store: createStore()}

// Private atoms - Not to be consumed directly.
const PRIVATE_hellowWorldAtom = atom('hello world')
const PRIVATE_numAtom = atom<number>(0)

/**
 * Jotai will suspend since this selector returns a promise.
 *
 * We can use Jotai's type helper - ExtractAtomValue - to infer the type from
 * the atom we consume in the selector.
 */
export const promiseSelector = atom<
  Promise<ExtractAtomValue<typeof PRIVATE_hellowWorldAtom>>
>(get => {
  return new Promise(resolve => {
    setTimeout(() => resolve(get(PRIVATE_hellowWorldAtom)), 2000)
  })
})

/**
 * This atom's default value consumes a selector which returns a promise,
 * therefore Jotai will suspend.
 *
 * https://github.com/pmndrs/jotai/releases/tag/v2.2.0
 *
 * As of Jotai 2.2.0, you need to `.then` the promise if you want to
 * use the value prior to returning it. For example, this atom appends more
 * string content to the resolved `promiseSelector` value.
 *
 * If you want to be able to set the atom to non-promise values *after* it
 * has resolved, you need to type it accordingly:
 *
 * ```
 * atomWithDefault<Promise<Value> | Value>(...)
 * ```
 */
export const asyncDefaultValueAtom = atomWithDefault<Promise<string> | string>(
  get => get(promiseSelector).then(val => `${val} => goodbye nowhere!`)
)

/**
 * This atom is just a setter for `asyncDefaultValueAtom`. It doesn't pay
 * pay attention to the value passed into it, but if you want to reset the
 * underlying `asyncDefaultValueAtom`, you need to explicitly handle that by
 * checking if `newValue === RESET`.
 */
export const setAsyncDefaultValueAtom = atom(null, (get, set, newValue) => {
  set(
    asyncDefaultValueAtom,
    newValue === RESET ? RESET : Math.random().toFixed(4)
  )
})

/**
 * Behavior for localStorageAtom:
 * - locaStorage will NOT be set to the initialValue just by accessing the atom
 * - As soon as the atom's value is changed, an entry is made in localStorage
 * - The atom will initialize to the value found in localStorage upon refresh
 * - Resetting the atom removes the key from localStorage
 */
export const localStorageAtom = atomWithStorage('jotaiLocalStorageAtom', 'test')

/**
 * This atom has the same syntax as a selector (read-only atom), but it is
 * writable! The 1st argument is a function which returns the default value.
 *
 * It acts almost like a writable selector except IT IS the source of truth -
 * no other atom is required to make it a "writable selector".
 *
 * This atom can be reset.
 */
export const defaultValueAtom = atomWithDefault(() => 9001)

/**
 * `createAtomWithInitialValue` returns a writable atom that takes an initial
 * value. This type of atom is "resettable" in that resetting the Jotai store
 * will return the atom to it's initial value.
 */
export const initialNumAtom = createAtomWithInitialValue(9001)
function createAtomWithInitialValue<T>(initialValue: T) {
  const anAtom = atom(initialValue, (get, set, newValue: ((v: T) => T) | T) => {
    // For some reason, typeof newValue === 'function' doesn't work 🤷‍♂️
    set(anAtom, newValue instanceof Function ? newValue(get(anAtom)) : newValue)
  })

  return anAtom
}

export const numSelector = atom(get => get(PRIVATE_numAtom))
const writeOnlyNumAtom = atom(null, (get, set, newValue: number) => {
  set(PRIVATE_numAtom, newValue)
})

/**
 * This atom is a write-only atom which sets another write-only atom! It shows
 * that trying to set a write-only atom will simply run that atom's write
 * function.
 */
export const writeOnlyNumAtom2 = atom(null, (get, set, newValue: number) => {
  set(writeOnlyNumAtom, newValue)
})

type Square = {
  id: number
  backgroundColor: string
  top: number
  left: number
}

/**
 * This atom keeps track of all the ids for the `squareAtomFamily`. Since atom
 * families don't give us an API to list out their contents, a separate atom to
 * track their identifiers is needed.
 *
 * Atom families are initialized with a `param`, in this case a number as the
 * id. The idea is to keep track of the params (ids) in a separate atom so that
 * we later have the ability to remove all atoms in the family by iterating over
 * the ids and removing them from the family one-by-one.
 */
export const squareIdsAtom = atom<number[]>([])

/**
 * This is a vanilla Jotai atomFamily. It doesn't give us access to the
 * underlying Map which stores all the atoms. We keep track of the params (ids)
 * in `squareIdsAtom` so we can keep track of what's inside the family.
 */
export const squareAtomFamily = atomFamily<number, PrimitiveAtom<Square>>(
  (id: number) => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)

    return atom({id, backgroundColor: `rgb(${r},${g},${b})`, top: 0, left: 0})
  }
)

/**
 * This write-only atom captures the logic to delete an atom from
 * `squareAtomFamily`. Out of the box, in order to delete an atom from an
 * atomFamily, we need to:
 * - Keep track of the params in a separate atom - access that here and filter
 *   out the param (id) we want to delete.
 * - Call `atomFamily.remove(id)` to remove the atom from the family.
 */
export const deleteSquareAtom = atom(null, (get, set, id: number) => {
  set(
    squareIdsAtom,
    get(squareIdsAtom).filter(squareId => squareId !== id)
  )
  squareAtomFamily.remove(id)
})

/**
 * Jotai doesn't expose the underlying Map used to store all the atoms in an
 * atomFamily. Since we're keeping track of all the params (ids) which are
 * keys to the internal Map, we need to use the global store to get the ids,
 * then iterate over them to remove each one from `squareAtomFamily`.
 */
export const resetSquareAtomFamily = () => {
  const ids = currentJotaiStore.store.get(squareIdsAtom)
  ids.forEach(squareAtomFamily.remove)
}

export const setSquareFamilyTop = atom(
  null,
  (get, set, id: number, newValue: number) => {
    set(squareAtomFamily(id), old => ({...old, top: old.top + newValue}))
  }
)
export const setSquareFamilyLeft = atom(
  null,
  (get, set, id: number, newValue: number) => {
    set(squareAtomFamily(id), old => ({...old, left: old.left + newValue}))
  }
)
export const resetSquaresAtom = atom(null, (get, set) => {
  const ids = get(squareIdsAtom)
  ids.forEach(id => {
    set(squareAtomFamily(id), old => ({...old, top: 0, left: 0}))
  })
})
