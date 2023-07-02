import {atom, useSetAtom} from 'jotai'
import ColorBox from './ColorBox'
import Value from './Value'

const numAtom = atom<number>(0)
const numSelector = atom(get => get(numAtom))
const writeOnlyNumAtom = atom(null, (get, set, newValue: number) => {
  set(numAtom, newValue)
})

/**
 * This atom is a write-only atom which sets another write-only atom! It shows
 * that trying to set a write-only atom will simply run that atom's write
 * function.
 */
const writeOnlyAtom = atom(null, (get, set, newValue: number) => {
  set(writeOnlyNumAtom, newValue)
})

export function WriteOnlyAtomExample() {
  const setNumValue = useSetAtom(writeOnlyAtom)

  return (
    <section>
      <h2>Set a write-only atom</h2>
      <Value atom={numSelector} />
      <ColorBox setState={setNumValue} />
    </section>
  )
}
