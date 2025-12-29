import { Link } from "wouter";
import { type Item } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface ItemCardProps {
  item: Item & { owner?: { username: string; reputation: number } };
}

export function ItemCard({ item }: ItemCardProps) {
  const imageUrl = item.images && item.images.length > 0 
    ? item.images[0] 
    : "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80"; // Default box image

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full rounded-2xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* Descriptive alt text for accessibility */}
        <img
          src={imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge 
            variant={item.status === 'available' ? 'default' : 'secondary'}
            className={item.status === 'available' ? 'bg-primary/90 text-primary-foreground' : ''}
          >
            {item.status.toUpperCase()}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center gap-1 text-white/90 text-xs font-medium">
            <MapPin className="h-3 w-3" />
            <span>{item.location}</span>
          </div>
        </div>
      </div>

      <CardHeader className="p-5 pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-display font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {item.description}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-grow">
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span className="bg-secondary px-2 py-1 rounded-md text-secondary-foreground font-medium">
            {item.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {item.createdAt && formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link href={`/items/${item.id}`} className="w-full">
          <Button className="w-full gap-2 group-hover:bg-primary/90" variant="outline">
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
