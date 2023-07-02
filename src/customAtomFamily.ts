import {Atom, atom, getDefaultStore} from 'jotai'

type FamilyOptions<Param> = {
  areEqual?: (a: Param, b: Param) => boolean
  getStore?: () => ReturnType<typeof getDefaultStore>
  isResettable?: boolean
}

export function atomFamily<Param, AtomType extends Atom<unknown>>(
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

  family.clear = () => {
    const store = getStore()
    atomsMap.clear()
    store.set(paramsAtom, [])
  }

  return family
}
