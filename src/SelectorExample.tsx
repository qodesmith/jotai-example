import {useAtomValue} from 'jotai'
import {doubleSelector} from './state'

export function SelectorExample() {
  const double = useAtomValue(doubleSelector)

  return (
    <section>
      <h2>Double Selector</h2>
      <div>Value: {double}</div>
      <div>
        Double the value of <code>primitiveAtom</code>
      </div>
    </section>
  )
}
