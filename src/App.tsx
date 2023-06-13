import './App.css'
import {Provider, atom, createStore, useAtom, useAtomValue} from 'jotai'
import {atomWithStorage, RESET} from 'jotai/utils'
import SuspenseValue from './SuspenseValue'
import {Suspense, useCallback, useEffect, useState} from 'react'

let currentStore = createStore()

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
  const [store, setStore] = useState(currentStore)
  const handleResetStore = useCallback(() => {
    currentStore = createStore()
    setStore(currentStore)
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
      <button onClick={handleResetStore}>Reset Jotai store</button>
      <App />
    </Provider>
  )
}

function App() {
  const [primitive, setPrimitive] = useAtom(primitiveAtom)
  const double = useAtomValue(doubleSelector)
  const [plus2, setPlus2] = useAtom(plusTwoWritableSelector)
  const [isHidden, setIsHidden] = useState(false)
  const [localStorageValue, setLocalStorageValue] = useAtom(localStorageAtom)

  return (
    <>
      <h1>Jotai Test</h1>
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
          <h2>Local Storage Atom</h2>
          <div>Value: {localStorageValue}</div>
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
      </div>
    </>
  )
}

/**
 * Behavior for localStorageAtom:
 * - locaStorage will NOT be set to the initialValue just by accessing the atom
 * - As soon as the atom's value is changed, an entry is made in localStorage
 * - The atom will initialize to the value found in localStorage upon refresh
 * - Resetting the atom removes the key from localStorage
 */
const localStorageAtom = atomWithStorage('jotaiLocalStorageAtom', 'test')

/**
 * A writable selector must have 2 arguments:
 * 1. Read function that returns the value of this selector
 * 2. Write function that writes back to any underlying atoms you get().
 *
 * const [plus2, setPlus2] = useAtom(plusTwoWritableSelector)
 *
 * Unlike primitive atoms, the setter from a writable selector does not take a
 * function where you can access the old value. Whatever you pass the setter
 * becomes the value of the underlying atom. So if you pass a function, the
 * function itself becomes the new value stored in the atom.
 *
 * The write function can also return a value!
 *
 * const returnVal = setPlus2(2)
 */
const plusTwoWritableSelector = atom(
  get => get(primitiveAtom) + 2,
  (get, set, newValue: string) => {
    set(primitiveAtom, get(primitiveAtom) + Number(newValue))
    return {hello: 'world'}
  }
)

/**
 * This selector is read-only. You do can either:
 * - const [double] = useAtom(doubleSelector)
 * - const double = useAtomValue(doubleSelector)
 *
 * Destructuring the 2nd setter argument with useAtom will not work.
 */
const doubleSelector = atom(get => get(primitiveAtom) * 2)

/**
 * Simplest version of useState in Jotai.
 * This returns a value and a setter.
 */
const primitiveAtom = atom(5)
