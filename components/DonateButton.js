'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DonateButton({ creatorId, creatorName }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDonate = async () => {
    if (status !== 'authenticated') {
      router.push('/login');
      return;
    }

    setShowModal(true);
  };

  const handlePayment = async () => {
    if (amount < 10) {
      alert('Minimum donation amount is ₹10');
      return;
    }

    try {
      setLoading(true);

      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          creatorId,
          message,
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Load Razorpay SDK
      const loadRazorpay = () => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Get Me A Chai",
        description: `Donate to ${creatorName}`,
        order_id: orderData.orderId,
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        },
        theme: {
          color: '#f97316'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setShowModal(false);
          }
        },
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              const error = await verifyResponse.json();
              throw new Error(error.error || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              setShowModal(false);
              setMessage('');
              setAmount(100);
              router.refresh();
              
              // Show success message
              alert('Thank you for your donation! 🎉');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support if amount was deducted.');
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert(error.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDonate}
        className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-700 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
      >
        Buy me a chai ☕
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setShowModal(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Support {creatorName}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₹)
                      </label>
                      <div className="flex gap-2">
                        {[50, 100, 200, 500].map((value) => (
                          <button
                            key={value}
                            onClick={() => setAmount(value)}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                              amount === value
                                ? 'bg-orange-100 text-orange-700 border-2 border-orange-500'
                                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-orange-50'
                            }`}
                          >
                            ₹{value}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        min="10"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message (optional)
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="3"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Say something nice..."
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => !loading && setShowModal(false)}
                        disabled={loading}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePayment}
                        disabled={loading}
                        className={`flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                          loading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Processing...' : `Donate ₹${amount}`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
