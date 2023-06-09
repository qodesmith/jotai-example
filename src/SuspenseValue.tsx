import {atom, useAtomValue, ExtractAtomValue} from 'jotai'

export default function SuspenseValue() {
  const promiseSelectorValue = useAtomValue(promiseSelector)

  return <div>Value: {promiseSelectorValue}</div>
}

// Not to be consumed directly.
const privateAtom = atom('hello world')

/**
 * Jotai will suspend since this selector returns a promise.
 *
 * We can use Jotai's type helper - ExtractAtomValue - to infer the type from
 * the atom we consume in the selector.
 */
const promiseSelector = atom<Promise<ExtractAtomValue<typeof privateAtom>>>(
  get => {
    return new Promise(resolve => {
      setTimeout(() => resolve(get(privateAtom)), 2000)
    })
  }
)
