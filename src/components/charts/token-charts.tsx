'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { fetchTokenSupply } from '@/lib/helius'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const H3_MINT_ADDRESS = process.env.NEXT_PUBLIC_H3_TOKEN_MINT

export function TokenCharts() {
  const [h3Data, setH3Data] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (H3_MINT_ADDRESS) {
          const supply = await fetchTokenSupply(H3_MINT_ADDRESS)
          setH3Data([supply])
          setLabels(['Current Supply'])
        }
      } catch (error) {
        console.error('Error fetching H3 supply:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    }
  }

  const h3ChartData = {
    labels,
    datasets: [{
      label: 'H3 Supply',
      data: h3Data,
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
    }]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-black">
      <div className="bg-[#1a1b1e] p-4 rounded-lg h-[400px]">
        <h2 className="text-xl font-bold mb-4 text-white">LOX Price Chart</h2>
        <iframe
          height="100%"
          width="100%"
          title="LOX Chart"
          src="https://www.defined.fi/sol/CEqfTHUBLdf4rPABDoMdTupRZYLsgQSvrf4vKicX5YVE?quoteToken=token0&embedded=1&hideTxTable=1&hideSidebar=1&hideChart=0&hideChartEmptyBars=1&chartSmoothing=0&embedColorMode=DEFAULT"
          frameBorder="0"
          allow="clipboard-write"
        />
      </div>
      <div className="bg-[#1a1b1e] p-4 rounded-lg h-[400px]">
        <h2 className="text-xl font-bold mb-4 text-white">H3 Supply Chart</h2>
        <Line options={chartOptions} data={h3ChartData} />
      </div>
    </div>
  )
} 