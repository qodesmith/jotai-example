import {createStore, ExtractAtomValue, PrimitiveAtom, atom} from 'jotai'
import {RESET, atomWithDefault, atomWithStorage, atomFamily} from 'jotai/utils'

export const currentJotaiStore = {store: createStore()}

// Private atoms - Not to be consumed directly.
const PRIVATE_hellowWorldAtom = atom('hello world')
const PRIVATE_numAtom = atom<number>(0)

/**
 * Simplest version of useState in Jotai.
 * This returns a value and a setter.
 */
export const primitiveAtom = atom(5)

/**
 * This selector is read-only. You do can either:
 * - const [double] = useAtom(doubleSelector)
 * - const double = useAtomValue(doubleSelector)
 *
 * Destructuring the 2nd setter argument with useAtom will not work.
 */
export const doubleSelector = atom(get => get(primitiveAtom) * 2)

/**
 * A writable selector must have 2 arguments:
 * 1. Read function that returns the value of this selector
 * 2. Write function that writes back to any underlying atoms you get().
 *
 * const [plus2, setPlus2] = useAtom(plusTwoWritableSelector)
 *
 * Unlike primitive atoms, the setter from a writable selector does not take a
 * function where you can access the old value. Whatever you pass the setter
 * becomes the value of the underlying atom. So if you pass a function, the
 * function itself becomes the new value stored in the atom.
 *
 * The write function can also return a value!
 *
 * const returnVal = setPlus2(2)
 *
 * Writable selectors are ALWAYS based on an external atom for their source of
 * truth. You cannot try to use the writable selector itself to store data.
 * For example, the following WILL NOT WORK:
 *
 * ```typescript
 * type AB = {a: number; b: number}
 * const writableSelector = atom<AB, [AB | typeof RESET], void>(
 *   () => ({a: 1, b: 2}),
 *   (get, set, newValue) => (newValue === RESET ? {a: 1, b: 2} : newValue)
 * )
 * ```
 * The above example doesn't work because the read function always returns the
 * same value as opposed to returning an underlying atom's value.
 */
export const plusTwoWritableSelector = atom(
  get => get(primitiveAtom) + 2,
  (get, set, newValue: string) => {
    set(primitiveAtom, get(primitiveAtom) + Number(newValue))
    return {hello: 'world'}
  }
)

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
export const squareIdsAtom = atom<number[]>([])
export const squareAtomFamily = atomFamily<number, PrimitiveAtom<Square>>(
  (id: number) => {
    const randomColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)})`
    return atom({id, backgroundColor: randomColor, top: 0, left: 0})
  }
)
export const deleteSquareAtom = atom(null, (get, set, id: number) => {
  set(
    squareIdsAtom,
    get(squareIdsAtom).filter(squareId => squareId !== id)
  )
  squareAtomFamily.remove(id)
})
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
