import {Suspense} from 'react'
import Value from './Value'
import {Atom} from 'jotai'

export default function SuspenseValue({atom}: {atom: Atom<any>}) {
  return (
    <Suspense fallback="Loading...">
      <Value atom={atom} />
    </Suspense>
  )
}
