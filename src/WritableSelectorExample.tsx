import {useSetAtom} from 'jotai'
import {plusTwoWritableSelector} from './state'
import {useCallback} from 'react'
import Value from './Value'

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
