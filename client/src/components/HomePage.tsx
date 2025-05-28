import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const HomePage: React.FC = () => {
  const features = [
    {
      title: 'Generate PDF',
      description: 'Create custom PDFs with blocks of content',
      path: '/pdf',
      icon: '📄'
    },
    {
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one',
      path: '/merge',
      icon: '🔗'
    },
    {
      title: 'Split PDF',
      description: 'Split a PDF into multiple documents',
      path: '/split',
      icon: '✂️'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">PDF Toolkit</h1>
        <p className="text-xl text-gray-600">
          Your all-in-one solution for PDF manipulation
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;