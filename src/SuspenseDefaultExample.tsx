import {Suspense, useState} from 'react'
import SuspenseValue2 from './SuspenseValue2'
import {useSetAtom} from 'jotai'
import {useResetAtom} from 'jotai/utils'
import {setAsyncDefaultValueAtom, asyncDefaultValueAtom} from './state'

export function SuspenseDefaultExample() {
  const [isHidden2, setIsHidden2] = useState(false)
  const asyncDefaultValueAtomUpdater = useSetAtom(setAsyncDefaultValueAtom)
  const resetAsyncDefaultValueAtom = useResetAtom(asyncDefaultValueAtom)

  return (
    <section>
      <h2>Suspense Default Atom</h2>
      {isHidden2 ? (
        <div>Supspense is hidden.</div>
      ) : (
        <Suspense key={Math.random()} fallback="Loading...">
          <SuspenseValue2 />
        </Suspense>
      )}
      <div className="button-group">
        <button onClick={() => setIsHidden2(v => !v)}>
          {isHidden2 ? 'Show' : 'Remove'}
        </button>
        <button onClick={asyncDefaultValueAtomUpdater}>Update</button>
        <button onClick={resetAsyncDefaultValueAtom}>Reset</button>
      </div>
    </section>
  )
}
