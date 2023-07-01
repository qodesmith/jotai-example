import {useSetAtom} from 'jotai'
import {RESET, atomWithDefault} from 'jotai/utils'
import Value from './Value'
import {useCallback} from 'react'

/**
 * This atom has the same syntax as a selector (read-only atom), but it is
 * writable! The 1st argument is a function which returns the default value. You
 * can choose to use the `get` function argument to select other atom values.
 *
 * It acts almost like a writable selector except IT IS the source of truth -
 * no other atom is required to make it a "writable selector".
 *
 * This atom can be reset.
 */
const defaultValueAtom = atomWithDefault(() => 9001)

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
        <button onClick={handleUpdateValue}>Set to random val</button>
        <button onClick={resetValue}>Reset</button>
      </div>
    </section>
  )
}
