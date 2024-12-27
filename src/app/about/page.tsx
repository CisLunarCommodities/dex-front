export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About CisLunar Commodities Exchange</h1>
        
        <div className="prose prose-invert">
          <p className="text-lg mb-6">
            The CisLunar Commodities Exchange (CLCE) is a decentralized platform facilitating 
            the trade of space resources and investment in space-focused ventures.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            To accelerate the development of the space economy by creating a liquid market 
            for space resources and providing funding opportunities for innovative space companies.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Trade tokenized space resources like Helium-3 and Liquid Oxygen</li>
            <li>Invest in space missions and companies</li>
            <li>Decentralized and permissionless platform</li>
            <li>Built on Solana for fast and low-cost transactions</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Get Started</h2>
          <p className="mb-6">
            Connect your wallet to start trading space resources or launch your own space venture. 
            Join our community to stay updated on the latest developments in the space economy.
          </p>
        </div>
      </div>
    </div>
  )
} 