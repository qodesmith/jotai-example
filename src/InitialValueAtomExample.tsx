import {useSetAtom} from 'jotai'
import Value from './Value'
import {initialNumAtom} from './state'
import {useCallback} from 'react'

export function InitialValueAtomExample() {
  const setInitialNum = useSetAtom(initialNumAtom)
  const incrementNum = useCallback(() => {
    setInitialNum(n => n + 1)
  }, [setInitialNum])

  return (
    <section>
      <h2>Atom With Initial Value</h2>
      <Value atom={initialNumAtom} />
      <button onClick={incrementNum}>Change num</button>
    </section>
  )
}
