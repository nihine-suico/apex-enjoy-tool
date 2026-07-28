import { useEffect, useRef, useState } from 'react'

// ルーレット演出用フック
// start() を呼ぶと表示が高速で切り替わり、スロットごとに順番に確定していく

const TICK_MS = 70
const FIRST_SETTLE_MS = 900
const SETTLE_INTERVAL_MS = 400

export function useRoulette<T>() {
  const [spinning, setSpinning] = useState(false)
  // 表示中のアイテム（回転中はランダム、確定後は結果）
  const [display, setDisplay] = useState<T[]>([])
  // 確定済みスロット数
  const [settledCount, setSettledCount] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  const start = (finalResults: T[], randomItem: () => T) => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setSpinning(true)
    setSettledCount(0)

    const slots = finalResults.length
    let settled = 0

    const interval = setInterval(() => {
      setDisplay((prev) => {
        const next = [...prev]
        for (let i = 0; i < slots; i++) {
          // 確定済みスロットは結果を維持、それ以外は高速切り替え
          next[i] = i < settled ? finalResults[i] : randomItem()
        }
        return next.slice(0, slots)
      })
    }, TICK_MS)
    timersRef.current.push(interval as unknown as ReturnType<typeof setTimeout>)

    for (let i = 0; i < slots; i++) {
      const timer = setTimeout(() => {
        settled = i + 1
        setSettledCount(settled)
        if (settled === slots) {
          clearInterval(interval)
          setDisplay(finalResults)
          setSpinning(false)
        }
      }, FIRST_SETTLE_MS + i * SETTLE_INTERVAL_MS)
      timersRef.current.push(timer)
    }
  }

  const reset = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setSpinning(false)
    setDisplay([])
    setSettledCount(0)
  }

  return { spinning, display, settledCount, start, reset }
}
