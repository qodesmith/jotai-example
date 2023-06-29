import {useSetAtom} from 'jotai'
import ColorBox from './ColorBox'
import Value from './Value'
import {numSelector, writeOnlyNumAtom2} from './state'

export function WriteOnlyAtomExample() {
  const setNumValue = useSetAtom(writeOnlyNumAtom2)

  return (
    <section>
      <h2>Set a write-only atom</h2>
      <Value atom={numSelector} />
      <ColorBox setState={setNumValue} />
    </section>
  )
}
