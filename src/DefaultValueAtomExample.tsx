import {useSetAtom} from 'jotai'
import {atomWithDefault, useResetAtom} from 'jotai/utils'
import Value from './Value'
import {useCallback} from 'react'
import {getRandomNum} from './utils/getRandomNum'

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
const defaultValueAtom = atomWithDefault(() => getRandomNum(1, 9999))

export function DefaultValueAtomExample() {
  const setWithDefault = useSetAtom(defaultValueAtom)
  const add1 = useCallback(() => {
    setWithDefault(oldVal => oldVal + 1)
  }, [setWithDefault])
  const resetAtom = useResetAtom(defaultValueAtom)
  return (
    <section>
      <h2>Atom With Default Value</h2>
      <Value atom={defaultValueAtom} />
      <div className="button-group">
        <button onClick={add1}>+1</button>
        <button onClick={resetAtom}>Reset</button>
      </div>
    </section>
  )
}
