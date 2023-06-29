import {useAtom} from 'jotai'
import {primitiveAtom} from './state'
import {useCallback} from 'react'

export function PrimitiveAtomExample() {
  const [primitive, setPrimitive] = useAtom(primitiveAtom)
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
      <div>Value: {primitive}</div>
      <div className="button-group">
        <button onClick={handleDecrement}>-</button>
        <button onClick={handleIncrement}>+</button>
      </div>
    </section>
  )
}
