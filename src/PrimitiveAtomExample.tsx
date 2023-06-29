import {useSetAtom} from 'jotai'
import {primitiveAtom} from './state'
import {useCallback} from 'react'
import Value from './Value'

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
