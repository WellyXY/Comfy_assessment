type StatusBarProps = {
  nodeCount: number
}

export function StatusBar({ nodeCount }: StatusBarProps) {
  return (
    <div className="absolute left-2 bottom-2 z-10 text-[0.75rem] leading-tight text-smoke-700 font-mono pointer-events-none select-none">
      <div>T: 0.00s</div>
      <div>I: 0</div>
      <div>N: {nodeCount} [0]</div>
      <div>V: 0</div>
      <div>FPS: 87.57</div>
      <div className="text-smoke-800">Comfy Cloud</div>
    </div>
  )
}
