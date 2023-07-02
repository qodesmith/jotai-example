import {createStore, PrimitiveAtom, atom} from 'jotai'
import {atomFamily} from 'jotai/utils'
import {getRandomNum} from './utils/getRandomNum'

export const currentJotaiStore = {store: createStore()}

// Private atoms - Not to be consumed directly.
const PRIVATE_numAtom = atom<number>(0)

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
    const r = getRandomNum(0, 255)
    const g = getRandomNum(0, 255)
    const b = getRandomNum(0, 255)

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
