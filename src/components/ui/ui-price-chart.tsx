'use client'

import { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

interface PriceData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

interface PriceChartProps {
  data: PriceData[]
  containerClassName?: string
}

export function PriceChart({ data, containerClassName = "w-full h-full" }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const container = chartContainerRef.current
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      width: container.clientWidth,
      height: container.clientHeight,
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',        // Green for up candles
      downColor: '#ef4444',      // Red for down candles
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    // Sample candle data - you'll need to update your data structure
    const candleData = [
      { time: '2024-01-01', open: 1.00, high: 1.05, low: 0.98, close: 1.02 },
      { time: '2024-02-01', open: 1.02, high: 1.20, low: 1.01, close: 1.15 },
      { time: '2024-03-01', open: 1.15, high: 1.18, low: 1.05, close: 1.08 },
      { time: '2024-04-01', open: 1.08, high: 1.35, low: 1.07, close: 1.32 },
      { time: '2024-05-01', open: 1.32, high: 1.48, low: 1.30, close: 1.45 },
      { time: '2024-06-01', open: 1.45, high: 1.46, low: 1.39, close: 1.41 },
      { time: '2024-07-01', open: 1.41, high: 1.70, low: 1.40, close: 1.68 },
    ]

    candleSeries.setData(candleData)
    chartRef.current = chart

    const handleResize = () => {
      chart.applyOptions({ 
        width: container.clientWidth,
        height: container.clientHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data])

  return (
    <div 
      ref={chartContainerRef} 
      className={`${containerClassName} w-full h-full`}
      style={{ minHeight: '500px' }}
    />
  )
} 