import {useAtom, useAtomValue, useSetAtom} from 'jotai'
import {useCallback, useRef} from 'react'
import {
  squareIdsAtom,
  setSquareFamilyTop,
  setSquareFamilyLeft,
  squareAtomFamily,
  deleteSquareAtom,
} from './state'

type Square = {
  id: number
  backgroundColor: string
}

const WIDTH = 50
const HEIGHT = 50

let lastId = 1
export default function SquarePlayground() {
  const [ids, setIds] = useAtom(squareIdsAtom)
  const addId = useCallback(() => {
    setIds(oldIds => [...oldIds, lastId++])
  }, [setIds])

  return (
    <section className="square-playground">
      <h2>Atom Family</h2>
      <button onClick={addId}>Create square</button>
      {ids.map(id => (
        <Square key={id} id={id} />
      ))}
    </section>
  )
}

function Square({id}: {id: number}) {
  const divRef = useRef<HTMLDivElement | null>(null)
  const {backgroundColor, top, left} = useAtomValue(squareAtomFamily(id))
  const setTop = useSetAtom(setSquareFamilyTop)
  const setLeft = useSetAtom(setSquareFamilyLeft)
  const deleteSquare = useSetAtom(deleteSquareAtom)
  const onDelete = useCallback(() => deleteSquare(id), [id, deleteSquare])
  const isDraggingRef = useRef(false)
  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return
      isDraggingRef.current = true

      const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return

        setTop(id, e.movementY)
        setLeft(id, e.movementX)
      }
      const onMouseUp = () => {
        isDraggingRef.current = false
        document.removeEventListener('mouseup', onMouseUp)
        document.removeEventListener('mousemove', onMouseMove)
      }

      document.addEventListener('mouseup', onMouseUp)
      document.addEventListener('mousemove', onMouseMove)
    },
    [id, setLeft, setTop]
  )

  const style = {backgroundColor, top, left, width: WIDTH, height: HEIGHT}

  return (
    <div
      className="square"
      ref={divRef}
      style={style}
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
