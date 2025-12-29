import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ItemCard } from "@/components/ItemCard";
import { Plus, Inbox, Package, Loader2, MessageSquare, Check, X } from "lucide-react";
import { Link } from "wouter";
import { useRequestsByItem, useUpdateRequestStatus } from "@/hooks/use-requests";
import { useUpdateItemStatus } from "@/hooks/use-items";
import { ChatBox } from "@/components/ChatBox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Fetch My Items
  const { data: myItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['/api/my-items'],
    queryFn: async () => {
      // For MVP we filter client side or fetch all and filter? 
      // Actually standard pattern is to have a backend endpoint. 
      // Since we didn't define one, we'll fetch items list and filter by user ID manually 
      // (Not performant for production but fine for MVP)
      const res = await fetch(api.items.list.path);
      const allItems = await res.json();
      return allItems.filter((i: any) => i.userId === user?.id);
    }
  });

  if (!user) return null; // Should be protected by router

  return (
    <div className="min-h-screen bg-muted/10 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your listings and requests</p>
          </div>
          <Link href="/create-item">
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> List New Item
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="mb-6 bg-background border p-1 rounded-full h-auto">
            <TabsTrigger value="listings" className="rounded-full px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Package className="mr-2 h-4 w-4" /> My Listings
            </TabsTrigger>
            {/* 
              Note: Incoming Requests would ideally be a separate tab, 
              but for this MVP we'll show requests INSIDE the listings tab for items that have them 
              or a global list if we had an endpoint for "all requests received".
              
              Since schema doesn't have "get all requests for user", we'll stick to Listings view.
            */}
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            {itemsLoading ? (
              <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : myItems && myItems.length > 0 ? (
              <div className="grid gap-6">
                {myItems.map((item: any) => (
                  <ListingManagementCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ListingManagementCard({ item }: { item: any }) {
  const { data: requests } = useRequestsByItem(item.id);
  const updateStatus = useUpdateItemStatus();
  const updateRequest = useUpdateRequestStatus();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const pendingRequests = requests?.filter((r: any) => r.status === 'pending') || [];
  const acceptedRequest = requests?.find((r: any) => r.status === 'accepted');

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Item Summary */}
        <div className="p-6 md:w-1/3 bg-muted/20 border-r border-border/50 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">{item.title}</h3>
            <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
              {item.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
            {item.description}
          </p>
          <div className="space-y-2">
            <Link href={`/items/${item.id}`}>
              <Button variant="outline" size="sm" className="w-full">View Public Page</Button>
            </Link>
            {item.status === 'available' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-muted-foreground"
                onClick={() => updateStatus.mutate({ id: item.id, status: 'given' })}
              >
                Mark as Given (Archived)
              </Button>
            )}
          </div>
        </div>

        {/* Requests Panel */}
        <div className="p-6 md:w-2/3">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Inbox className="h-4 w-4" /> Requests ({requests?.length || 0})
          </h4>

          {acceptedRequest ? (
             <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-xl p-4">
               <div className="flex justify-between items-center mb-2">
                 <span className="font-bold text-green-700 dark:text-green-300">Accepted: {acceptedRequest.requester.username}</span>
                 <Badge className="bg-green-600">Pending Pickup</Badge>
               </div>
               <p className="text-sm mb-4">You have accepted this request. Coordinate pickup via chat.</p>
               <div className="flex gap-2">
                 <ChatDialog requestId={acceptedRequest.id} otherPartyName={acceptedRequest.requester.username} />
                 <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateStatus.mutate({ id: item.id, status: 'given' })}
                 >
                   Complete & Mark Given
                 </Button>
               </div>
             </div>
          ) : pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.map((req: any) => (
                <div key={req.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{req.requester.username}</span>
                      <span className="text-xs text-muted-foreground">• Reputation: {req.requester.reputation}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">"{req.message}"</p>
                  </div>
                  <div className="flex gap-2">
                    <ChatDialog requestId={req.id} otherPartyName={req.requester.username} />
                    <Button 
                      size="sm" 
                      onClick={() => {
                        updateRequest.mutate({ id: req.id, status: 'accepted', itemId: item.id });
                        updateStatus.mutate({ id: item.id, status: 'reserved' });
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8">
               <Inbox className="h-8 w-8 mb-2 opacity-20" />
               <p className="text-sm">No pending requests yet.</p>
             </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ChatDialog({ requestId, otherPartyName }: { requestId: number; otherPartyName: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <MessageSquare className="h-4 w-4" /> Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0">
        <ChatBox requestId={requestId} otherPartyName={otherPartyName} />
      </DialogContent>
    </Dialog>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-background rounded-3xl border border-dashed border-border">
      <div className="bg-primary/5 p-4 rounded-full inline-block mb-4">
        <Package className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-display text-2xl font-bold mb-2">You haven't listed anything yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Join the movement! List items you no longer need and help your community reduce waste.
      </p>
      <Link href="/create-item">
        <Button size="lg" className="rounded-full px-8">List Your First Item</Button>
      </Link>
    </div>
  );
}
