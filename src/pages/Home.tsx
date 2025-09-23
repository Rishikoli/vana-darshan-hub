import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Map, AlertCircle, BarChart3, Users, Layers, Globe, Database } from "lucide-react";
import LeafletAssetMap from "@/components/LeafletAssetMap";

const features = [
  {
    icon: <Map className="w-6 h-6 text-primary" />,
    title: "3D Mapping",
    description: "Visualize forest coverage and tribal regions across India with Deck.GL and MapLibre basemaps."
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-primary" />,
    title: "FRA Insights",
    description: "Track claims, beneficiaries and processing stages with clear dashboards and summaries."
  },
  {
    icon: <AlertCircle className="w-6 h-6 text-primary" />,
    title: "Actionable Alerts",
    description: "Surface environmental alerts and recent activities to prioritize field interventions."
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Accessible UI",
    description: "Built with shadcn UI, Radix primitives and Tailwind for clarity and performance."
  },
  {
    icon: <Globe className="w-6 h-6 text-primary" />,
    title: "Open Standards",
    description: "Uses open mapping tech (MapLibre, OpenStreetMap) and industry-standard web tooling."
  },
  {
    icon: <Database className="w-6 h-6 text-primary" />,
    title: "Extensible Data",
    description: "Easily plug in real datasets and APIs using TanStack Query and Redux where needed."
  }
];

const stats = [
  { label: 'Tribal Communities', value: '700+' },
  { label: 'Forest Area Covered', value: '100k+ sq km' },
  { label: 'FRA Claims Processed', value: '2M+' },
  { label: 'States Covered', value: '22' },
];

const testimonials = [
  {
    quote: "The VanaDarshan dashboard has revolutionized how we monitor forest rights and tribal welfare across India.",
    author: "Dr. Rajesh Verma",
    role: "Director, Ministry of Tribal Affairs"
  },
  {
    quote: "An essential tool for our field officers to track and manage FRA claims efficiently.",
    author: "Priya Singh",
    role: "Field Coordinator, Chhattisgarh"
  }
];

const Home = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div className="flex">
              <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-foreground/10">
                <span className="font-semibold text-primary">New</span>
                <span className="h-4 w-px bg-foreground/20" aria-hidden="true" />
                <span>Updated tribal region data</span>
              </div>
            </div>
            <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Empowering Tribal Communities Through
              <span className="text-primary block">Forest Rights</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Monitor tribal village forest coverage, manage FRA claims, and visualize environmental insights across India with our comprehensive, accessible platform designed for the Ministry of Tribal Affairs.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/dashboard" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#features" className="group">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow
          ">
            <div className="relative mx-auto w-full max-w-2xl rounded-2xl shadow-2xl ring-1 ring-foreground/10 overflow-hidden">
              <div className="w-full h-full">
                <LeafletAssetMap />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                <p className="text-xs text-muted-foreground text-center">
                  Interactive map showing tribal regions across India. <Link to="/assets" className="text-primary hover:underline">Explore all layers →</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-muted-foreground">{stat.label}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Key Capabilities</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to manage forest rights
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Purpose-built for the Ministry of Tribal Affairs to monitor and manage forest rights across India.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature, index) => (
                <div key={index} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trusted by Tribal Affairs Professionals
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              What our users are saying about VanaDarshan
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col justify-between bg-card p-8 shadow-sm ring-1 ring-foreground/5 sm:p-10 rounded-xl">
                <div>
                  <p className="text-lg leading-8 text-foreground">"{testimonial.quote}"</p>
                </div>
                <div className="mt-8">
                  <p className="text-base font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16 sm:py-24">
        <div className="relative isolate">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                Join us in our mission to protect tribal rights and preserve India's forests.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button asChild size="lg">
                  <Link to="/dashboard" className="group">
                    Open Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <a href="#" className="text-sm font-semibold leading-6 text-foreground">
                  Contact us <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
