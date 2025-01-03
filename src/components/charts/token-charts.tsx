'use client'

import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { fetchTokenSupply } from '@/lib/helius'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
          const date = new Date().toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })
          
          // Keep only last 7 days of data
          setH3Data(prev => [...prev, supply].slice(-7))
          setLabels(prev => [...prev, date].slice(-7))
        }
      } catch (error) {
        console.error('Error fetching H3 supply:', error)
      }
    }

    // Initial fetch
    fetchData()
    
    // Fetch every 24 hours
    const interval = setInterval(fetchData, 86400000)
    return () => clearInterval(interval)
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'center' as const,
        labels: {
          boxWidth: 20,
          padding: 20,
          color: '#ffffff'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#ffffff',
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  }

  const h3ChartData = {
    labels,
    datasets: [{
      label: 'H3 Daily Supply',
      data: h3Data,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1
    }]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-black">
      <div className="bg-[#1a1b1e] p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">LOX Price Chart</h2>
        <div className="h-[320px] w-full">
          <iframe
            className="h-full w-full"
            title="LOX Chart"
            src="https://www.defined.fi/sol/CEqfTHUBLdf4rPABDoMdTupRZYLsgQSvrf4vKicX5YVE?quoteToken=token0&embedded=1&hideTxTable=1&hideSidebar=1&hideChart=0&hideChartEmptyBars=1&chartSmoothing=0&embedColorMode=DEFAULT"
            frameBorder="0"
            allow="clipboard-write"
          />
        </div>
      </div>
      <div className="bg-[#1a1b1e] p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">H3 Supply Chart</h2>
        <div className="h-[320px]">
          <Bar options={chartOptions} data={h3ChartData} />
        </div>
      </div>
    </div>
  )
} 