import './App.css'
import {createStore, Provider, useAtom, useAtomValue, useSetAtom} from 'jotai'
import {RESET, useResetAtom} from 'jotai/utils'
import SuspenseValue from './SuspenseValue'
import SuspenseValue2 from './SuspenseValue2'
import {Suspense, useCallback, useEffect, useState} from 'react'
import {
  asyncDefaultValueAtom,
  defaultValueAtom,
  doubleSelector,
  localStorageAtom,
  numSelector,
  plusTwoWritableSelector,
  primitiveAtom,
  setAsyncDefaultValueAtom,
  writeOnlyNumAtom2,
  resetSquareAtomFamily,
  currentJotaiStore,
} from './state'
import ColorBox from './ColorBox'
import SquarePlayground from './SquarePlayground'

/**
 * The Jotai <Provider> isn't necessary to use atoms. However, you can reset all
 * atoms within a <Providers>'s tree by remounting it. This will clear the
 * entire Jotai store.
 *
 * 3 main reasons for providers, according to the docs:
 * - To provide a different state for each sub tree.
 * - To accept initial values of atoms.
 * - To clear all atoms by remounting.
 *
 * In order to clear the store:
 * - DO pass a store prop and recreate the store
 * - DON'T pass a store prop and remount the Provider with a key change
 * - Know that localStorage atoms will not be reset
 *
 * Remounting a <Provider> with a stable store reference won't clear the store.
 */
export default function AppProvider() {
  const [store, setStore] = useState(currentJotaiStore.store)
  const handleResetStore = useCallback(() => {
    resetSquareAtomFamily()
    setStore((currentJotaiStore.store = createStore()))
  }, [])

  useEffect(() => {
    // Just a simple way to see when the localStorage atom changes.
    const unsub = store.sub(localStorageAtom, () => {
      console.log(localStorage)
    })

    return unsub
  }, [store])

  return (
    <Provider store={store}>
      <App resetStore={handleResetStore} />
    </Provider>
  )
}

function App({resetStore}: {resetStore: () => void}) {
  const [primitive, setPrimitive] = useAtom(primitiveAtom)
  const double = useAtomValue(doubleSelector)
  const [plus2, setPlus2] = useAtom(plusTwoWritableSelector)
  const [isHidden, setIsHidden] = useState(false)
  const [isHidden2, setIsHidden2] = useState(false)
  const [localStorageValue, setLocalStorageValue] = useAtom(localStorageAtom)
  const [withDefault, setWithDefault] = useAtom(defaultValueAtom)
  const asyncDefaultValueAtomUpdater = useSetAtom(setAsyncDefaultValueAtom)
  const resetAsyncDefaultValueAtom = useResetAtom(asyncDefaultValueAtom)
  const numValue = useAtomValue(numSelector)
  const setNumValue = useSetAtom(writeOnlyNumAtom2)

  return (
    <>
      <header>
        <h1>Jotai Test</h1>
        <button onClick={resetStore}>Reset Jotai store</button>
      </header>
      <div className="sections">
        <section>
          <h2>Primitive Atom</h2>
          <div>Value: {primitive}</div>
          <div className="button-group">
            <button onClick={() => setPrimitive(old => old - 1)}>-</button>
            <button onClick={() => setPrimitive(old => old + 1)}>+</button>
          </div>
        </section>
        <section>
          <h2>Double Selector</h2>
          <div>Value: {double}</div>
          <div>
            Double the value of <code>primitiveAtom</code>
          </div>
        </section>
        <section>
          <h2>+2 Writable Selector</h2>
          <div>Value: {plus2}</div>
          <div>
            <em>(setter return value logged to the console)</em>
          </div>
          <button
            onClick={() => {
              const returnVal = setPlus2('2')
              console.log('returnVal:', returnVal)
            }}
          >
            +2
          </button>
        </section>
        <section>
          <h2>Suspense Selector</h2>
          {isHidden ? (
            <div>Supspense is hidden.</div>
          ) : (
            <Suspense key={Math.random()} fallback="Loading...">
              <SuspenseValue />
            </Suspense>
          )}
          <div>
            <button onClick={() => setIsHidden(v => !v)}>
              {isHidden ? 'Show' : 'Remove'}
            </button>
          </div>
        </section>
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
        <section>
          <h2>Local Storage Atom</h2>
          <div>Value: {localStorageValue}</div>
          <div>
            <em>(values logged to the console)</em>
          </div>
          <div className="button-group">
            <button
              onClick={() => setLocalStorageValue(Math.random().toString())}
            >
              Set to random number
            </button>
            <button onClick={() => setLocalStorageValue(RESET)}>
              Clear value
            </button>
          </div>
        </section>
        <section>
          <h2>Atom With Default Value</h2>
          <div>Value: {withDefault}</div>
          <div className="button-group">
            <button onClick={() => setWithDefault(+Math.random().toFixed(2))}>
              Set selector to random val
            </button>
            <button onClick={() => setWithDefault(RESET)}>Reset</button>
          </div>
        </section>
        <section>
          <h2>Set a write-only atom</h2>
          <div>Value: {numValue}</div>
          <ColorBox setState={setNumValue} />
        </section>
        <SquarePlayground />
      </div>
    </>
  )
}
