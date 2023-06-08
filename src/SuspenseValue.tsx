import {atom, useAtomValue} from 'jotai'

export default function SuspenseValue() {
  const promiseSelectorValue = useAtomValue(promiseSelector)

  return <div>Value: {promiseSelectorValue}</div>
}

// Not to be consumed directly.
const privateAtom = atom('hello world')

/**
 * Jotai will suspend since this selector returns a promise.
 */
const promiseSelector = atom<Promise<string>>(get => {
  return new Promise(resolve => {
    setTimeout(() => resolve(get(privateAtom)), 2000)
  })
})
