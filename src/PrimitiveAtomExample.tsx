import {atom, useSetAtom} from 'jotai'
import {useCallback} from 'react'
import Value from './Value'

/**
 * `atom` is the basic building block in Jotai. A primitive atom is an atom that
 * is initialized with a value instead of a read function. Atoms can hold any
 * JavaScript value, such as primitives, objects, arrays, Maps, Sets, etc.
 */
export const primitiveAtom = atom(5)

export function PrimitiveAtomExample() {
  const setPrimitive = useSetAtom(primitiveAtom)
  const handleDecrement = useCallback(
    () => setPrimitive(old => old - 1),
    [setPrimitive]
  )
  const handleIncrement = useCallback(
    () => setPrimitive(old => old + 1),
    [setPrimitive]
  )

  return (
    <section>
      <h2>Primitive Atom</h2>
      <Value atom={primitiveAtom} />
      <div className="button-group">
        <button onClick={handleDecrement}>-</button>
        <button onClick={handleIncrement}>+</button>
      </div>
    </section>
  )
}
