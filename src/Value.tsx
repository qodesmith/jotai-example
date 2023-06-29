import {useAtomValue, Atom} from 'jotai'

export default function Value({atom}: {atom: Atom<any>}) {
  const value = useAtomValue(atom)

  return <div>Value: {value}</div>
}
