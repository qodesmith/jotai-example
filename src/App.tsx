import './App.css'
import {atom, useAtom, useAtomValue} from 'jotai'

function App() {
  const [primitive, setPrimitive] = useAtom(primitiveAtom)
  const double = useAtomValue(doubleSelector)

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
      </div>
    </>
  )
}

export default App

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
