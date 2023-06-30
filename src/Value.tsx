import {useAtomValue, Atom} from 'jotai'
import {ReactNode, Suspense} from 'react'

type Props = {
  atom: Atom<any>
  fallback?: ReactNode
}

export default function Value({atom, fallback}: Props) {
  return (
    <Suspense fallback={fallback}>
      <DisplayValue atom={atom} />
    </Suspense>
  )
}

function DisplayValue({atom}: {atom: Props['atom']}) {
  const value = useAtomValue(atom)
  return <div>Value: {value}</div>
}
