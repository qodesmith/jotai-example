import {useCallback, useState} from 'react'
import {atom, ExtractAtomValue} from 'jotai'
import Value from './Value'

const hellowWorldAtom = atom('hello world')

/**
 * Jotai will suspend since this selector returns a promise.
 *
 * We can use Jotai's type helper - ExtractAtomValue - to infer the type from
 * the atom we consume in the selector.
 */
export const promiseSelector = atom<
  Promise<ExtractAtomValue<typeof hellowWorldAtom>>
>(get => {
  return new Promise(resolve => {
    setTimeout(() => resolve(get(hellowWorldAtom)), 2000)
  })
})

export function SuspenseSelectorExample() {
  const [isHidden, setIsHidden] = useState(false)
  const toggleHidden = useCallback(() => {
    setIsHidden(v => !v)
  }, [])

  return (
    <section>
      <h2>Suspense Selector</h2>
      {isHidden ? (
        <div>Supspense is hidden.</div>
      ) : (
        <Value atom={promiseSelector} fallback="Loading..." />
      )}
      <div>
        <button onClick={toggleHidden}>{isHidden ? 'Show' : 'Remove'}</button>
      </div>
    </section>
  )
}
