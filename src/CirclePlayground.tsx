import {
  SetStateAction,
  WritableAtom,
  atom,
  useAtomValue,
  useSetAtom,
} from 'jotai'
import {getRandomNum} from './utils/getRandomNum'
import {jotaiStore} from './jotaiStore'
import {useCallback, useRef} from 'react'
import {atomFamily} from './customAtomFamily'

const WIDTH = 50
const HEIGHT = 50

type Circle = {
  id: number
  backgroundColor: string
  top: number
  left: number
}

export const circleAtomFamily = atomFamily<
  {id: number},
  WritableAtom<Circle, [SetStateAction<Circle>], void>
>(
  ({id}) => {
    const [r, g, b] = [1, 2, 3].map(() => getRandomNum(0, 255))
    return atom({id, backgroundColor: `rgb(${r},${g},${b})`, top: 0, left: 0})
  },
  {
    getStore: () => jotaiStore.store,
    areEqual: (a, b) => a.id === b.id,
  }
)

export function CirclePlayground() {
  const nextIdRef = useRef(0)
  const ids = useAtomValue(circleAtomFamily.paramsAtom)
  const createCircle = useCallback(() => {
    const id = nextIdRef.current++
    circleAtomFamily.add({id})
  }, [])
  const resetCircleFAmily = useCallback(() => circleAtomFamily.clear(), [])

  return (
    <section className="circle-playground">
      <h2>Custom Atom Family</h2>
      <div className="button-group">
        <button onClick={createCircle}>Create circle</button>
        <button onClick={resetCircleFAmily} disabled={!ids.length}>
          Reset circle family
        </button>
      </div>
      {ids.map(({id}) => (
        <Circle key={id} id={id} />
      ))}
    </section>
  )
}

const setCircleFamilySide = atom(
  null,
  (get, set, id: number, newValue: number, side: 'top' | 'left') => {
    set(circleAtomFamily({id}), circle => ({
      ...circle,
      [side]: circle[side] + newValue,
    }))
  }
)

function Circle({id}: {id: number}) {
  const {id: _unusedId, ...circleStyle} = useAtomValue(circleAtomFamily({id}))
  const removeCircle = useCallback(() => {
    circleAtomFamily.remove({id})
  }, [id])
  const setSide = useSetAtom(setCircleFamilySide)
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
      className="circle"
      style={{...circleStyle, width: WIDTH, height: HEIGHT}}
      onMouseDown={onMouseDown}
    >
      <img
        className="circle-delete"
        src="/trash-bin.png"
        width={WIDTH / 2}
        height={HEIGHT / 2}
        onClick={removeCircle}
      />
    </div>
  )
}
