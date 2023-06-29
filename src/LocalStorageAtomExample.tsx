import {useAtomValue, useSetAtom} from 'jotai'
import {RESET} from 'jotai/utils'
import {localStorageAtom} from './state'
import {useCallback} from 'react'
import Value from './Value'

export function LocalStorageAtomExample() {
  const setLocalStorageValue = useSetAtom(localStorageAtom)
  const genRandomString = useCallback(() => {
    setLocalStorageValue(getRandomString())
  }, [setLocalStorageValue])
  const resetAtom = useCallback(() => {
    setLocalStorageValue(RESET)
  }, [setLocalStorageValue])

  return (
    <section>
      <h2>Local Storage Atom</h2>
      <Value atom={localStorageAtom} />
      <div>
        <em>(values logged to the console)</em>
      </div>
      <div className="button-group">
        <button onClick={genRandomString}>Set to random string</button>
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
