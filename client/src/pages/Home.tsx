import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gift, Recycle, Users, Leaf } from "lucide-react";
import { useItems } from "@/hooks/use-items";
import { ItemCard } from "@/components/ItemCard";

export default function Home() {
  const { data: recentItems, isLoading } = useItems();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 pt-16 pb-20 lg:pt-32 lg:pb-28">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
            <h1 className="font-display text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
              Give freely. <br className="hidden sm:block" />
              <span className="text-primary bg-primary/10 px-4 rounded-xl -rotate-1 inline-block mt-2">Live sustainably.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join your local community in reducing waste by sharing items you no longer need. 
              Find treasures, de-clutter your home, and make connections.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/browse">
                <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all">
                  Browse Items
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8 rounded-full border-2 hover:bg-muted/50">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none opacity-40">
           <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
           <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Recycle className="h-8 w-8 text-primary" />}
              title="Reduce Waste"
              description="Keep good items out of landfills by giving them a second life with someone who needs them."
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-accent" />}
              title="Build Community"
              description="Connect with neighbors and build trust through the simple act of giving and receiving."
            />
            <FeatureCard 
              icon={<Gift className="h-8 w-8 text-primary" />}
              title="Everything is Free"
              description="No money changes hands. Generosity is the only currency here."
            />
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold">Fresh Finds</h2>
              <p className="text-muted-foreground mt-2">Just added by your neighbors</p>
            </div>
            <Link href="/browse">
              <Button variant="ghost" className="hidden sm:flex items-center gap-2 hover:text-primary">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentItems?.slice(0, 4).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/browse">
              <Button variant="outline" className="w-full">View All Items</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container relative z-10 text-center">
          <Leaf className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="font-display text-4xl font-bold mb-6">Ready to declutter?</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            One person's trash is another person's treasure. List your first item today and make someone's day.
          </p>
          <Link href="/create-item">
            <Button size="lg" variant="secondary" className="rounded-full font-bold h-12 px-8 shadow-xl">
              Post an Item Now
            </Button>
          </Link>
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
