import {useAtomValue} from 'jotai'
import {promiseSelector} from './state'

export default function SuspenseValue() {
  const promiseSelectorValue = useAtomValue(promiseSelector)

  return <div>Value: {promiseSelectorValue}</div>
}
