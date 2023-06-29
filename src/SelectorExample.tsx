import {doubleSelector} from './state'
import Value from './Value'

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
