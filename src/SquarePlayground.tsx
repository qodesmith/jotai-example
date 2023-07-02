import {
  SetStateAction,
  WritableAtom,
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
} from 'jotai'
import {atomFamily} from 'jotai/utils'
import {useCallback, useRef} from 'react'
import {getRandomNum} from './utils/getRandomNum'
import {jotaiStore} from './jotaiStore'

type Square = {
  id: number
  backgroundColor: string
  top: number
  left: number
}

const WIDTH = 50
const HEIGHT = 50

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
export const squareAtomFamily = atomFamily<
  number,
  WritableAtom<Square, [SetStateAction<Square>], void>
>(id => {
  const [r, g, b] = [1, 2, 3].map(() => getRandomNum(0, 255))
  return atom({id, backgroundColor: `rgb(${r},${g},${b})`, top: 0, left: 0})
})

const resetSquaresAtom = atom(null, (get, set) => {
  const ids = get(squareIdsAtom)
  ids.forEach(id => {
    set(squareAtomFamily(id), old => ({...old, top: 0, left: 0}))
  })
})

const setSquareFamilySide = atom(
  null,
  (get, set, id: number, newValue: number, side: 'top' | 'left') => {
    set(squareAtomFamily(id), square => ({
      ...square,
      [side]: square[side] + newValue,
    }))
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

  /**
   * If we don't remove the atom from the family, it will continue to take up
   * memory. We would then have atoms in memory that are inaccessible to the UI.
   */
  squareAtomFamily.remove(id)
})

/**
 * Jotai doesn't expose the underlying Map used to store all the atoms in an
 * atomFamily. Since we're keeping track of all the params (ids) which are
 * keys to the internal Map, we need to use the global store to get the ids,
 * then iterate over them to remove each one from `squareAtomFamily`.
 */
export const resetSquareAtomFamily = () => {
  const ids = jotaiStore.store.get(squareIdsAtom)
  ids.forEach(squareAtomFamily.remove)
}

export function SquarePlayground() {
  const lastIdRef = useRef(1)
  const [ids, setIds] = useAtom(squareIdsAtom)
  const resetAtoms = useSetAtom(resetSquaresAtom)
  const addId = useCallback(() => {
    setIds(oldIds => [...oldIds, lastIdRef.current++])
  }, [setIds])

  return (
    <section className="square-playground">
      <h2>Atom Family</h2>
      <div className="button-group">
        <button onClick={addId}>Create square</button>
        <button onClick={resetAtoms} disabled={!ids.length}>
          Reset square atom values
        </button>
      </div>
      {ids.map(id => (
        <Square key={id} id={id} />
      ))}
    </section>
  )
}

function Square({id}: {id: number}) {
  const divRef = useRef<HTMLDivElement | null>(null)
  const {id: _unusedId, ...square} = useAtomValue(squareAtomFamily(id))
  const setSide = useSetAtom(setSquareFamilySide)
  const deleteSquare = useSetAtom(deleteSquareAtom)
  const onDelete = useCallback(() => deleteSquare(id), [id, deleteSquare])
  const isDraggingRef = useRef(false)
  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return
      isDraggingRef.current = true

      const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return

        setSide(id, e.movementY, 'top')
        setSide(id, e.movementX, 'left')
      }
      const onMouseUp = () => {
        isDraggingRef.current = false
        document.removeEventListener('mouseup', onMouseUp)
        document.removeEventListener('mousemove', onMouseMove)
      }

      document.addEventListener('mouseup', onMouseUp)
      document.addEventListener('mousemove', onMouseMove)
    },
    [id, setSide]
  )

  return (
    <div
      className="square"
      ref={divRef}
      style={{...square, width: WIDTH, height: HEIGHT}}
      onMouseDown={onMouseDown}
    >
      <img
        className="square-delete"
        src="/trash-bin.png"
        width={WIDTH / 2}
        height={HEIGHT / 2}
        onClick={onDelete}
      />
    </div>
  )
}
