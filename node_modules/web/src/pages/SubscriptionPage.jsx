import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Crown } from 'lucide-react';

const SubscriptionPage = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: '3 Days',
      price: 400,
      description: 'Perfect for a quick start',
      popular: false,
      features: [
        { text: 'Upload unlimited photos', included: true },
        { text: 'Upload videos', included: true },
        { text: 'Priority listing', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Customer support', included: true },
        { text: 'Featured placement', included: false },
        { text: 'Premium badge', included: false },
      ]
    },
    {
      name: '1 Week',
      price: 1000,
      description: 'Most popular choice',
      popular: true,
      features: [
        { text: 'Upload unlimited photos', included: true },
        { text: 'Upload unlimited videos', included: true },
        { text: 'Priority listing', included: true },
        { text: 'Advanced analytics', included: true },
        { text: '24/7 customer support', included: true },
        { text: 'Featured placement', included: true },
        { text: 'Premium badge', included: true },
        { text: 'Top search ranking', included: false },
      ]
    },
    {
      name: '2 Weeks',
      price: 2000,
      description: 'Best value for money',
      popular: false,
      features: [
        { text: 'Upload unlimited photos', included: true },
        { text: 'Upload unlimited videos', included: true },
        { text: 'Top priority listing', included: true },
        { text: 'Advanced analytics', included: true },
        { text: '24/7 VIP support', included: true },
        { text: 'Featured placement', included: true },
        { text: 'Premium badge', included: true },
        { text: 'Top search ranking', included: true },
        { text: 'Profile verification', included: true },
      ]
    }
  ];

  const handleSubscribe = (planName) => {
    // TODO: Implement payment logic
    alert(`Subscribing to ${planName} plan`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase mb-4">Subscription Plans</h1>
          <p className="text-zinc-400 text-lg">Choose the perfect plan for your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl border-2 p-6 ${
                plan.popular
                  ? 'bg-gradient-to-b from-red-900/20 to-zinc-900 border-red-600'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              {plan.popular && (
                <div className="bg-red-600 text-white text-center py-1 rounded-full text-sm font-bold mb-4">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-zinc-400 text-sm">KSH</span>
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                </div>
                <p className="text-zinc-400 text-sm mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-white' : 'text-zinc-600'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name)}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  plan.popular
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;