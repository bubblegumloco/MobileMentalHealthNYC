import React, { useState } from 'react';

const problems = [
  { 
    title: "Anxiety & Stress", 
    description: "The weight of daily life leaves little energy to prioritize mental health.", 
    fact: "35% of NYC high school students reported persistent sadness or hopelessness in 2023.",
    source: "NYC Youth Risk Behavior Survey (2023)"
  },
  { 
    title: "Language Barrier", 
    description: "Limited English proficiency cuts off access to culturally competent care.", 
    fact: "88000 of ELL students attend schools with no bilingual mental health staff in the 2025 school year",
    source: "NYC Comptroller's Office Audit (2025)"
  },
  { 
    title: "Service Deserts", 
    description: "In many parts of the 5 Boroughs, the nearest mental health provider is miles away.", 
    fact: "Only 47 child and adolescent psychologists for NYC were listed the Medicaid directory in 2022.",
    source: "Shelby Jouppi"
  },
  { 
    title: "Cost Barrier", 
    description: "High therapy fees and lack of insurance coverage price out those who need it most.", 
    fact: "An average therapy session costs $175-$288 for one session alone.",
    source: "Therapy Route (2025)"
  },
  { 
    title: "Lack of Safe Spaces", 
    description: "Without a private, stigma-free environment, many fear being seen or judged.", 
    fact: "Nearly half of teens avoid seeking help due to fear of judgment from peers or family.",
    source: "NYC Health Department & NAMI"
  },
  { 
    title: "School Environment", 
    description: "Bullying and toxic school climates are driving a silent crisis among youth.", 
    fact: "51% of NYC high school students surveyed said harassment, intimidation, and bullying was common.",
    source: "New York Post (2024)"
  }
];

const ProblemsGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="max-w-8xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#fffdf1] mb-4">
          The Real-World Barriers
        </h2>
        <p className="text-lg text-white max-w-2xl mx-auto">
          Access isn't just about distance. It's about language, cost, stigma, and the sheer lack of capacity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem, index) => (
          <div
            key={index}
            className="relative h-64 cursor-pointer perspective-1000"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
          >
            {/* Card Inner */}
            <div className={`
              relative w-full h-full transition-transform duration-500
              transform-style-preserve-3d
              ${hoveredIndex === index ? 'rotate-y-180' : ''}
            `}>

              {/* Front Face */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg border border-green-100 p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-700">
                    💡
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{problem.description}</p>
                </div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider group-hover:text-green-700 transition-colors">
                  Hover for Impact
                </div>
              </div>

              {/* Back Face */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl p-6 flex flex-col justify-center text-center"
                style={{ background: 'linear-gradient(135deg, #1a4a2e 0%, #2d7a4f 100%)', border: '2px solid rgba(168,213,181,0.3)' }}>
                <div>
                  <div className="text-4xl font-black mb-2" style={{ color: '#a8d5b5' }}>
                    {problem.fact.match(/\d+/)?.[0] || "📊"}
                  </div>
                  <p className="font-medium text-lg leading-snug mb-4" style={{ color: '#ffffff' }}>
                    "{problem.fact}"
                  </p>
                  <p className="text-xs italic pt-3" style={{ color: 'rgba(255,255,255,0.55)', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                    Source: {problem.source}
                  </p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <p className="md:hidden text-center text-gray-500 text-sm mt-8">
        Tap any card to reveal the statistic.
      </p>
    </div>
  );
};

export default ProblemsGrid;