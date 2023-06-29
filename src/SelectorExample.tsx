import {atom} from 'jotai'
import {primitiveAtom} from './PrimitiveAtomExample'
import Value from './Value'

/**
 * Selectors are read-only atoms that are initialized with a single read
 * function. The read function has the ability to get other atom values via the
 * `get` function which is its only argument.
 *
 * To consume the atom's value, you can do either:
 * - const [double] = useAtom(doubleSelector)
 * - const double = useAtomValue(doubleSelector) => preferred
 */
const doubleSelector = atom(get => get(primitiveAtom) * 2)

export function SelectorExample() {
  return (
    <section>
      <h2>Double Selector</h2>
      <Value atom={doubleSelector} />
      <div>
        Double the value of <code>primitiveAtom</code>
      </div>
    </section>
  )
}
