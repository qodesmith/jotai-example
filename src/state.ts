import {ExtractAtomValue, atom} from 'jotai'
import {atomWithDefault, atomWithStorage} from 'jotai/utils'

/**
 * This atom has the same syntax as a selector (read-only atom), but it is
 * writable! The 1st argument is a function which returns the default value.
 *
 * It acts almost like a writable selector except IT IS the source of truth -
 * no other atom is required to make it a "writable selector".
 * This atom can be reset.
 */
export const atomWithDefaultValue = atomWithDefault(() => 9001)

/**
 * Behavior for localStorageAtom:
 * - locaStorage will NOT be set to the initialValue just by accessing the atom
 * - As soon as the atom's value is changed, an entry is made in localStorage
 * - The atom will initialize to the value found in localStorage upon refresh
 * - Resetting the atom removes the key from localStorage
 */
export const localStorageAtom = atomWithStorage('jotaiLocalStorageAtom', 'test')

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
 * This selector is read-only. You do can either:
 * - const [double] = useAtom(doubleSelector)
 * - const double = useAtomValue(doubleSelector)
 *
 * Destructuring the 2nd setter argument with useAtom will not work.
 */
export const doubleSelector = atom(get => get(primitiveAtom) * 2)

/**
 * Simplest version of useState in Jotai.
 * This returns a value and a setter.
 */
export const primitiveAtom = atom(5)

// Not to be consumed directly.
const PRIVATE_hellowWorldAtom = atom('hello world')
