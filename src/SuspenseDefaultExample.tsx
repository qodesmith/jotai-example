import {useCallback, useState} from 'react'
import {atom, useSetAtom} from 'jotai'
import {RESET, atomWithDefault, useResetAtom} from 'jotai/utils'
import {promiseSelector} from './SuspenseSelectorExample'
import Value from './Value'

/**
 * `atomWithDefault` is a resettable atom. Resetting the atom will return it
 * to its initialized value. In this case, the default value is a selector which
 * reads the value of an async atom. You can imagine the underlying promise
 * resolving to a different value as time goes on, however, when resetting this
 * atom it will go back to the initially resolved promise.
 *
 * https://github.com/pmndrs/jotai/releases/tag/v2.2.0
 *
 * As of Jotai 2.2.0, you need to `.then` the promise if you want to
 * use the value prior to returning it. For example, this atom appends more
 * string content to the resolved `promiseSelector` value.
 *
 * If you want to be able to set the atom to non-promise values *after* it
 * has resolved, you need to type it accordingly:
 *
 * ```typescript
 * atomWithDefault<Promise<Value> | Value>(...)
 * ```
 */
const asyncDefaultValueAtom = atomWithDefault<Promise<string> | string>(
  async get => get(promiseSelector).then(val => `${val} => goodbye nowhere!`)
)

const writableAsyncDefaultValueAtom = atom(
  get => get(asyncDefaultValueAtom),
  (get, set, newValue) => {
    set(
      asyncDefaultValueAtom,
      newValue === RESET ? RESET : Math.random().toFixed(4)
    )
  }
)

export function SuspenseDefaultExample() {
  const [isHidden, setIsHidden] = useState(false)
  const toggleHidden = useCallback(() => {
    setIsHidden(v => !v)
  }, [])
  const setToRandomNumber = useSetAtom(writableAsyncDefaultValueAtom)
  const resetAtom = useResetAtom(writableAsyncDefaultValueAtom)

  return (
    <section>
      <h2>Suspense Default Atom</h2>
      {isHidden ? (
        <div>Supspense is hidden.</div>
      ) : (
        <Value atom={asyncDefaultValueAtom} fallback="Loading..." />
      )}
      <div className="button-group">
        <button onClick={toggleHidden}>{isHidden ? 'Show' : 'Remove'}</button>
        <button onClick={setToRandomNumber}>Update</button>
        <button onClick={resetAtom}>Reset</button>
      </div>
    </section>
  )
}
