import {useCallback, useState} from 'react'
import SuspenseValue from './SuspenseValue'
import {atom, ExtractAtomValue} from 'jotai'

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
        <SuspenseValue atom={promiseSelector} />
      )}
      <div>
        <button onClick={toggleHidden}>{isHidden ? 'Show' : 'Remove'}</button>
      </div>
    </section>
  )
}
