import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Forest3DMap from "@/components/Forest3DMap";

const Home = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-government opacity-10" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                VanaDarshan
                <span className="block text-primary">Forest Rights Dashboard</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Monitor tribal village forest coverage, manage FRA claims, and visualize
                environmental insights across India with a modern, accessible interface.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/dashboard">Open Dashboard</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#features">Explore Features</a>
                </Button>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-4 shadow-government">
              <div className="w-full rounded-md overflow-hidden border">
                <Forest3DMap height={300} interactive={false} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Preview mode. Full interactivity available on the Dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold">Key Capabilities</h2>
        <p className="mt-2 text-muted-foreground">Purpose-built for the Ministry of Tribal Affairs</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold">3D Mapping</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Visualize forest coverage and tribal regions across India with Deck.GL and MapLibre basemaps.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold">FRA Insights</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Track claims, beneficiaries and processing stages with clear dashboards and summaries.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold">Actionable Alerts</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Surface environmental alerts and recent activities to prioritize field interventions.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold">Accessible UI</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Built with shadcn UI, Radix primitives and Tailwind for clarity and performance.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold">Open Standards</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Uses open mapping tech (MapLibre, OpenStreetMap) and industry-standard web tooling.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold">Extensible Data</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Easily plug in real datasets and APIs using TanStack Query and Redux where needed.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Home;
