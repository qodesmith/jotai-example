import {useAtom} from 'jotai'
import {plusTwoWritableSelector} from './state'
import {useCallback} from 'react'

export function WritableSelectorExample() {
  const [plus2, setPlus2] = useAtom(plusTwoWritableSelector)
  const addTwoAndLogValue = useCallback(() => {
    const returnVal = setPlus2('2')
    console.log('plusTwoWritableSelector return value:', returnVal)
  }, [setPlus2])

  return (
    <section>
      <h2>+2 Writable Selector</h2>
      <div>Value: {plus2}</div>
      <div>
        <em>(setter return value logged to the console)</em>
      </div>
      <button onClick={addTwoAndLogValue}>+2</button>
    </section>
  )
}
