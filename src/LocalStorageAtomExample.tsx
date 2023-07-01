import {useSetAtom} from 'jotai'
import {atomWithStorage, useResetAtom} from 'jotai/utils'
import {useCallback} from 'react'
import Value from './Value'

/**
 * Behavior for localStorageAtom:
 * - The UI will render initialValue and localStorage will ***not*** be set
 * - As soon as the atom's value is changed, an entry is made in localStorage
 * - The atom will initialize to the value found in localStorage upon refresh
 * - Resetting the atom removes the key from localStorage and consumes
 *   initialValue in the UI
 */
export const localStorageAtom = atomWithStorage('jotaiLocalStorageAtom', 'test')

export function LocalStorageAtomExample() {
  const setLocalStorageValue = useSetAtom(localStorageAtom)
  const setToRandomString = useCallback(() => {
    setLocalStorageValue(getRandomString())
  }, [setLocalStorageValue])
  const resetAtom = useResetAtom(localStorageAtom)

  return (
    <section>
      <h2>Local Storage Atom</h2>
      <Value atom={localStorageAtom} />
      <div>
        <em>(values logged to the console)</em>
      </div>
      <div className="button-group">
        <button onClick={setToRandomString}>Set to random string</button>
        <button onClick={resetAtom}>Clear value</button>
      </div>
    </section>
  )
}

const letters = 'abcdefghijklmnopqrstuvwxyz'
function getRandomString() {
  return Array.from({length: 10})
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join('')
}
