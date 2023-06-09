import './App.css'
import {atom, useAtom, useAtomValue} from 'jotai'
import SuspenseValue from './SuspenseValue'
import {Suspense, useState} from 'react'

function App() {
  const [primitive, setPrimitive] = useAtom(primitiveAtom)
  const double = useAtomValue(doubleSelector)
  const [plus2, setPlus2] = useAtom(plusTwoWritableSelector)
  const [isHidden, setIsHidden] = useState(true)

  return (
    <>
      <h1>Jotai Test</h1>
      <div className="sections">
        <section>
          <h2>Primitive Atom</h2>
          <div>Value: {primitive}</div>
          <button onClick={() => setPrimitive(old => old - 1)}>-</button>
          <button onClick={() => setPrimitive(old => old + 1)}>+</button>
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
      </div>
    </>
  )
}

export default App

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
