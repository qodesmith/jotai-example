import {
  Atom,
  SetStateAction,
  WritableAtom,
  atom,
  useAtomValue,
  getDefaultStore,
} from 'jotai'
import {getRandomNum} from './utils/getRandomNum'
import {jotaiStore} from './jotaiStore'
import {useCallback, useRef} from 'react'

const WIDTH = 50
const HEIGHT = 50

type Circle = {
  id: number
  backgroundColor: string
  top: number
  left: number
}

type FamilyOptions<Param> = {
  areEqual?: (a: Param, b: Param) => boolean
  getStore?: () => ReturnType<typeof getDefaultStore>
}

function atomFamily<Param, AtomType extends Atom<unknown>>(
  initializer: (p: Param) => AtomType,
  options?: FamilyOptions<Param>
) {
  const atomsMap = new Map<Param, AtomType>()
  const paramsAtom = atom<Param[]>([])
  const getStore = () => options?.getStore?.() ?? getDefaultStore()
  const defaultAreEqual = (a: Param, b: Param) => Object.is(a, b)
  const areEqual = options?.areEqual ?? defaultAreEqual

  function family(param: Param) {
    let paramUsed = param

    if (typeof param === 'object') {
      const existingParam = [...atomsMap.keys()].find(currentParam =>
        areEqual(currentParam, param)
      )
      if (existingParam) paramUsed = existingParam
    }

    let anAtom = atomsMap.get(paramUsed)

    if (!anAtom) {
      const store = getStore()
      anAtom = initializer(paramUsed)
      atomsMap.set(paramUsed, anAtom)
      store.set(paramsAtom, [...store.get(paramsAtom), paramUsed])
    }

    return anAtom
  }

  /**
   * Exposing this allows components to dynamically consume the keys in order
   * to render however many items are in the map.
   */
  family.paramsAtom = atom(get => get(paramsAtom))

  /**
   * Exposing this allows components to avoid having to track their own "params"
   * item which is typically used to dynamically render all the items in the
   * family.
   */
  family.add = (param: Param) => {
    if (typeof param === 'object') {
      const existingParam = [...atomsMap.keys()].find(currentParam =>
        areEqual(currentParam, param)
      )
      if (existingParam) return
    }

    const store = getStore()
    const newAtom = initializer(param)
    atomsMap.set(param, newAtom)
    store.set(paramsAtom, [...store.get(paramsAtom), param])
  }

  /**
   * Jotai families already have this feature baked in, so we provide it too.
   */
  family.remove = (param: Param) => {
    let paramUsed = param

    if (typeof param === 'object') {
      const existingParam = [...atomsMap.keys()].find(currentParam =>
        areEqual(currentParam, param)
      )
      if (!existingParam) return
      paramUsed = existingParam
    }

    const store = getStore()
    atomsMap.delete(paramUsed)
    store.set(
      paramsAtom,
      store.get(paramsAtom).filter(p => p !== paramUsed)
    )
  }

  return family
}

const circleAtomFamily = atomFamily<
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

  return (
    <section className="circle-playground">
      <h2>Custom Atom Family</h2>
      <div className="button-group">
        <button onClick={createCircle}>Create circle</button>
        <button disabled={!ids.length}>Reset circle atom values</button>
      </div>
      {ids.map(({id}) => (
        <Circle key={id} id={id} />
      ))}
    </section>
  )
}

function Circle({id}: {id: number}) {
  const {id: _unusedId, ...circleStyle} = useAtomValue(circleAtomFamily({id}))
  const removeCircle = useCallback(() => {
    circleAtomFamily.remove({id})
  }, [id])

  return (
    <div
      className="circle"
      style={{...circleStyle, width: WIDTH, height: HEIGHT}}
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
