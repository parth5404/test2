export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-orange-600">About Get Me A Chai</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            Get Me A Chai is a platform that empowers creators in India to receive support 
            from their fans and followers. Just like sharing a cup of chai, we believe in 
            creating meaningful connections between creators and their audience.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ul className="space-y-4 text-gray-700">
            <li>
              <span className="font-bold">1. Create Your Profile</span>
              <p>Set up your unique creator page and share your story.</p>
            </li>
            <li>
              <span className="font-bold">2. Share Your Link</span>
              <p>Spread your page across social media and with your network.</p>
            </li>
            <li>
              <span className="font-bold">3. Receive Support</span>
              <p>Fans can buy you a virtual chai and support your work.</p>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-8">
          Whether you're a content creator, artist, writer, or entrepreneur, 
          Get Me A Chai is here to help you turn your passion into a sustainable journey.
        </p>
        <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}
