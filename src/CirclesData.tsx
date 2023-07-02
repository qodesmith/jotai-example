import {useAtomValue} from 'jotai'
import {circleAtomFamily} from './CirclePlayground'

export default function CirclesData() {
  const ids = useAtomValue(circleAtomFamily.paramsAtom)

  return (
    <section className="circles-data">
      <h2>Custom Atom Family Data</h2>
      <div className="circles-data-items">
        {ids.map(({id}) => (
          <CircleData key={id} id={id} />
        ))}
      </div>
    </section>
  )
}

function CircleData({id}: {id: number}) {
  const {backgroundColor, top, left} = useAtomValue(circleAtomFamily({id}))

  return (
    <div className="circle-data">
      <div className="circle-data-color" style={{backgroundColor}} />
      <code>{JSON.stringify({id, top, left})}</code>
    </div>
  )
}
