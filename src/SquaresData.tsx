import {useAtomValue} from 'jotai'
import {useMemo} from 'react'
import {squareAtomFamily, squareIdsAtom} from './SquarePlayground'

export default function SquaresData() {
  const ids = useAtomValue(squareIdsAtom)

  return (
    <section className="squares-data">
      <h2>Atom Family Data</h2>
      <div className="squares-data-items">
        {ids.map(id => (
          <SquareData key={id} id={id} />
        ))}
      </div>
    </section>
  )
}

function SquareData({id}: {id: number}) {
  const {backgroundColor, top, left} = useAtomValue(squareAtomFamily(id))
  const style = useMemo(() => ({backgroundColor}), [backgroundColor])

  return (
    <div className="square-data">
      <div className="square-data-color" style={style} />
      <code>{JSON.stringify({id, top, left})}</code>
    </div>
  )
}
