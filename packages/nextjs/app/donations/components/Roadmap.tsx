import React from 'react';

const Roadmap: React.FC = () => {
  const roadmapItems = [
    { title: 'Application Development', description: 'Finish the development of our core application.' },
    { title: 'Awareness and Outreach', description: 'Spread the word about our mission and platform.' },
    { title: 'On-ground Support', description: 'Provide hands-on support to onboard and assist shelters.' },
    { title: 'Community Support', description: 'Build a network of community members to support our cause.' },
    { title: 'Continuous Improvement', description: 'Regularly update and enhance our platform based on feedback.' },
  ];

  return (
    <div className="bg-base-200 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Roadmap</h2>
      <p className="text-lg mb-8 text-center">
        We have a clear vision for the future and need your support to make it happen.
      </p>
      <div className="space-y-6">
        {roadmapItems.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
              {index + 1}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <p className="text-lg font-semibold">
          Your support is crucial in helping us achieve these goals and make a real difference for animals in need.
        </p>
      </div>
    </div>
  );
};

export default Roadmap;