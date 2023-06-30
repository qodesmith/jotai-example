import {useCallback, useState} from 'react'
import SuspenseValue from './SuspenseValue'
import {promiseSelector} from './state'

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
