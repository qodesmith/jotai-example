import {useAtomValue} from 'jotai'
import {asyncDefaultValueAtom} from './state'

export default function SuspenseValue2() {
  const promiseSelectorValue = useAtomValue(asyncDefaultValueAtom)

  return <div>Value: {promiseSelectorValue}</div>
}
