import { useItems } from "@/hooks/use-items";
import { ItemCard } from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, PackageOpen } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce"; // We need to create this simple hook or inline it

function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  });

  return debouncedValue;
}

export default function Browse() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  
  // Debounce search to prevent too many API calls
  // Simple implementation since we don't have use-debounce hook file
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Effect to update debounced search
  useState(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  });

  const { data: items, isLoading } = useItems({ 
    search: debouncedSearch, 
    category 
  });

  const categories = ["Furniture", "Electronics", "Clothing", "Books", "Kitchen", "Toys", "Garden", "Other"];

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="bg-background border-b sticky top-16 z-40 shadow-sm">
        <div className="container py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-primary hidden md:block">Browse Items</h1>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => {
                   setSearch(e.target.value);
                   setTimeout(() => setDebouncedSearch(e.target.value), 500); // Simple debounce
                }}
                className="pl-10 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary"
              />
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px] rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3 w-3" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
            <div className="bg-muted p-6 rounded-full mb-6">
              <PackageOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">No items found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any items matching your search. Try adjusting your filters or search terms.
            </p>
            <Button 
              variant="link" 
              className="mt-4 text-primary"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
