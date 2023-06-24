import {useCallback, type MouseEvent} from 'react'

export default function ColorBox({setState}: {setState: (n: number) => void}) {
  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      setState(e.clientX)
    },
    [setState]
  )

  return (
    <span className="color-box" onMouseMove={onMouseMove}>
      move mouse over me
    </span>
  )
}
