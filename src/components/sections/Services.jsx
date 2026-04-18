import React from 'react';
import Button from '../ui/Button';
import { Utensils, Moon, Coffee } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: "Street Food Crawl",
      description: "Dive into the heart of the city through its vibrant street food stalls. Taste 10+ local delicacies on a guided walking tour.",
      icon: <Utensils size={32} className="text-matcha-800" />,
      color: "bg-matcha-300",
      darkBg: "bg-matcha-800",
      textColor: "text-matcha-800",
    },
    {
      title: "Midnight Market",
      description: "When the sun goes down, the real culinary adventures begin. We'll take you to bustling night markets only locals know.",
      icon: <Moon size={32} className="text-ube-900" />,
      color: "bg-ube-300",
      darkBg: "bg-ube-800",
      textColor: "text-ube-900",
    },
    {
      title: "Morning Cafe Run",
      description: "Start the day like a true local. Explore heritage coffee shops, artisanal bakeries, and the city's iconic breakfast spots.",
      icon: <Coffee size={32} className="text-lemon-800" />,
      color: "bg-lemon-500",
      darkBg: "bg-lemon-800",
      textColor: "text-lemon-800",
    }
  ];

  return (
    <section id="tours" className="py-24 px-6 bg-clay-white border-y border-oat-border">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:flex justify-between items-end">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-heading-tight mb-4 text-clay-black">
              Handcrafted Culinary Journeys
            </h2>
            <p className="text-lg text-warm-charcoal leading-relaxed">
              Every tour is meticulously planned to give you a true taste of the city, carefully balancing iconic institutions with hidden neighborhood gems.
            </p>
          </div>
          <div className="mt-8 md:mt-0">
            <Button variant="ghost">View Schedule</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className={`${service.color} rounded-feature p-8 border border-clay-black/10 shadow-clay hover-clay-jump relative group`}
            >
              <div className="bg-clay-white w-16 h-16 rounded-card flex items-center justify-center mb-12 shadow-sm border border-oat-light">
                {service.icon}
              </div>
              <h3 className={`text-2xl font-semibold tracking-sub-tight mb-3 ${service.textColor}`}>
                {service.title}
              </h3>
              <p className={`${service.textColor} opacity-80 leading-relaxed font-medium`}>
                {service.description}
              </p>
              
              <div className="mt-12">
                <Button className="w-full bg-clay-white hover:bg-clay-black hover:text-clay-white text-clay-black">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
