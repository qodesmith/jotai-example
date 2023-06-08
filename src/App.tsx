import {atom, useAtom} from 'jotai'

function App() {
  const [primitive, setPrimitive] = useAtom(primitiveAtom)

  return (
    <>
      <h1>Jotai Test</h1>
      <div className="sections"></div>
      <section>
        <h2>Primitive Atom</h2>
        <div>Primitive value: {primitive}</div>
        <button onClick={() => setPrimitive(old => old + 1)}>+</button>
        <button onClick={() => setPrimitive(old => old - 1)}>-</button>
      </section>
    </>
  )
}

export default App

const primitiveAtom = atom(5)
