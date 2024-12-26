'use client'

export default function AboutFeature() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">CisLunar Commodities Exchange</h1>
          <p className="text-xl text-gray-400">
            The first decentralized exchange for space resources
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-base-200 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Our Mission 🚀</h2>
          <p className="text-gray-300 leading-relaxed">
            As humanity expands into space, the need for efficient resource trading becomes crucial. 
            Our platform enables seamless exchange of essential space commodities, from Liquid Oxygen 
            to Helium-3, supporting the growing space economy.
          </p>
        </div>

        {/* Commodities Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-base-200 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Available Resources</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="text-2xl mr-3">🌬️</span>
                <div>
                  <h3 className="font-bold">LOX (Liquid Oxygen)</h3>
                  <p className="text-gray-400">Essential for life support and rocket propulsion</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">⚛️</span>
                <div>
                  <h3 className="font-bold">H3 (Helium-3)</h3>
                  <p className="text-gray-400">Clean fusion energy fuel</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">💧</span>
                <div>
                  <h3 className="font-bold">H2O (Water)</h3>
                  <p className="text-gray-400">Critical for life support and fuel production</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">⛏️</span>
                <div>
                  <h3 className="font-bold">IRON (Space Iron)</h3>
                  <p className="text-gray-400">Raw material for space construction</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-base-200 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Platform Features</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="text-2xl mr-3">🔒</span>
                <div>
                  <h3 className="font-bold">Secure Trading</h3>
                  <p className="text-gray-400">Fully decentralized and secure transactions</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">⚡</span>
                <div>
                  <h3 className="font-bold">Instant Swaps</h3>
                  <p className="text-gray-400">Lightning-fast resource exchanges</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">🌍</span>
                <div>
                  <h3 className="font-bold">Cross-Station Trading</h3>
                  <p className="text-gray-400">Trade across different space stations and colonies</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <h3 className="font-bold">Real-Time Analytics</h3>
                  <p className="text-gray-400">Advanced market data and trading insights</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-center">
          <p className="text-gray-400">
            Built on Solana | Powering the future of space commerce
          </p>
        </div>
      </div>
    </div>
  )
} 