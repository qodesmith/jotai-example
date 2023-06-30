import {atom, useSetAtom} from 'jotai'
import {useCallback} from 'react'
import Value from './Value'
import {primitiveAtom} from './PrimitiveAtomExample'

/**
 * A "writable selector" is an atom that has read *and* write functions. The
 * read function acts like a selector - it can *read* atom values. The write
 * function is just that - it can *write* atom values.
 *
 * Writable selectors *have **no** internal value*. They simply read and write
 * other atoms, acting like a middle man.
 *
 * A writable selector must have 2 arguments:
 * 1. Read function that returns the value of this selector
 * 2. Write function that writes back to any underlying atoms you `get(...)`.
 *
 * Because there is no internal value, the setter function returned from
 * `useAtom` only accepts direct values. You cannot use a function which has
 * access to the old value since there *is* no old value. If you pass a
 * function, the function *itself* will become the new value stored in the atom.
 *
 *  ```javascript
 * const [plus2, setPlus2] = useAtom(plusTwoWritableSelector)
 * // ❌ wrong
 * setPlus2(oldVal => oldVal + 2)
 * // ✅ correct
 * setPlus2(2)
 * ```
 *
 * The write function can also return a value! I haven't figured out how this
 * might be useful, but it's a feature none the less:
 *
 * ```javascript
 * const [plus2, setPlus2] = useAtom(plusTwoWritableSelector)
 * const returnVal = setPlus2(2)
 * ```
 */
export const plusTwoWritableSelector = atom(
  get => get(primitiveAtom) + 2,
  (get, set, newValue: string) => {
    set(primitiveAtom, get(primitiveAtom) + Number(newValue))
    return {hello: 'world'}
  }
)

export function WritableSelectorExample() {
  const setPlus2 = useSetAtom(plusTwoWritableSelector)
  const addTwoAndLogValue = useCallback(() => {
    const returnVal = setPlus2('2')
    console.log('plusTwoWritableSelector return value:', returnVal)
  }, [setPlus2])

  return (
    <section>
      <h2>+2 Writable Selector</h2>
      <Value atom={plusTwoWritableSelector} />
      <div>
        <em>(setter return value logged to the console)</em>
      </div>
      <button onClick={addTwoAndLogValue}>+2</button>
    </section>
  )
}
