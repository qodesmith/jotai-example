import './App.css'
import {createStore, Provider, useAtom, useAtomValue, useSetAtom} from 'jotai'
import {RESET} from 'jotai/utils'
import {useCallback, useEffect, useState} from 'react'
import {
  defaultValueAtom,
  localStorageAtom,
  numSelector,
  writeOnlyNumAtom2,
  resetSquareAtomFamily,
  currentJotaiStore,
  initialNumAtom,
} from './state'
import ColorBox from './ColorBox'
import SquarePlayground from './SquarePlayground'
import SquaresData from './SquaresData'
import {PrimitiveAtomExample} from './PrimitiveAtomExample'
import {SelectorExample} from './SelectorExample'
import {WritableSelectorExample} from './WritableSelectorExample'
import {SuspenseSelectorExample} from './SuspenseSelectorExample'
import {SuspenseDefaultExample} from './SuspenseDefaultExample'
import {LocalStorageAtomExample} from './LocalStorageAtomExample'

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
  const [withDefault, setWithDefault] = useAtom(defaultValueAtom)
  const numValue = useAtomValue(numSelector)
  const setNumValue = useSetAtom(writeOnlyNumAtom2)
  const [initialNum, setInitialNum] = useAtom(initialNumAtom)

  return (
    <>
      <header>
        <h1>Jotai Test</h1>
        <button onClick={resetStore}>Reset Jotai store</button>
      </header>
      <div className="sections">
        <PrimitiveAtomExample />
        <SelectorExample />
        <WritableSelectorExample />
        <SuspenseSelectorExample />
        <SuspenseDefaultExample />
        <LocalStorageAtomExample />
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
          <h2>Atom With Initial Value</h2>
          <div>Value: {initialNum}</div>
          <button onClick={() => setInitialNum(n => n + 1)}>Change num</button>
        </section>
        <section>
          <h2>Set a write-only atom</h2>
          <div>Value: {numValue}</div>
          <ColorBox setState={setNumValue} />
        </section>
        <SquarePlayground />
        <SquaresData />
      </div>
    </>
  )
}
