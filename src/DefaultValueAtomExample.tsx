import {useSetAtom} from 'jotai'
import {RESET} from 'jotai/utils'
import {defaultValueAtom} from './state'
import Value from './Value'
import {useCallback} from 'react'

export function DefaultValueAtomExample() {
  const setWithDefault = useSetAtom(defaultValueAtom)
  const handleUpdateValue = useCallback(() => {
    setWithDefault(+Math.random().toFixed(2))
  }, [setWithDefault])
  const resetValue = useCallback(() => {
    setWithDefault(RESET)
  }, [setWithDefault])

  return (
    <section>
      <h2>Atom With Default Value</h2>
      <Value atom={defaultValueAtom} />
      <div className="button-group">
        <button onClick={handleUpdateValue}>Set selector to random val</button>
        <button onClick={resetValue}>Reset</button>
      </div>
    </section>
  )
}
