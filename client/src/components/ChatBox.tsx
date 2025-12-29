import { useMessages, useSendMessage } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";

interface ChatBoxProps {
  requestId: number;
  otherPartyName: string;
}

export function ChatBox({ requestId, otherPartyName }: ChatBoxProps) {
  const { user } = useAuth();
  const { data: messages, isLoading } = useMessages(requestId);
  const sendMessage = useSendMessage();
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    sendMessage.mutate(
      { requestId, content },
      { onSuccess: () => setContent("") }
    );
  };

  if (isLoading) return <div className="h-[400px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <Card className="h-[500px] flex flex-col border-primary/10 shadow-lg">
      <CardHeader className="bg-primary/5 py-3 border-b border-primary/10">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Chat with <span className="text-primary font-bold">{otherPartyName}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow p-0 overflow-hidden relative">
        <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-4">
          {messages?.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-10">
              No messages yet. Start the conversation!
            </div>
          )}
          
          {messages?.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="h-8 w-8 mt-1 border border-border">
                    <AvatarFallback className="text-xs bg-background">
                      {msg.sender.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`p-3 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted text-foreground rounded-tl-sm'
                  }`}>
                    <p>{msg.content}</p>
                    <span className={`text-[10px] block mt-1 opacity-70 ${isMe ? 'text-right' : 'text-left'}`}>
                      {msg.createdAt && format(new Date(msg.createdAt), 'p')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-muted/20 border-t">
        <form onSubmit={handleSend} className="flex w-full gap-2">
          <Input 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow rounded-full border-primary/20 focus-visible:ring-primary"
            disabled={sendMessage.isPending}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!content.trim() || sendMessage.isPending}
            className="rounded-full h-10 w-10 shrink-0 bg-primary hover:bg-primary/90"
          >
            {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
