import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useRequestsByItem(itemId: number) {
  return useQuery({
    queryKey: [api.requests.listByItem.path, itemId],
    queryFn: async () => {
      const url = buildUrl(api.requests.listByItem.path, { itemId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch requests");
      return api.requests.listByItem.responses[200].parse(await res.json());
    },
    enabled: !!itemId,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertRequest) => {
      const res = await fetch(api.requests.create.path, {
        method: api.requests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send request");
      return api.requests.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Request Sent!",
        description: "The owner has been notified of your interest.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, itemId }: { id: number; status: 'pending' | 'accepted' | 'rejected'; itemId: number }) => {
      const url = buildUrl(api.requests.update.path, { id });
      const res = await fetch(url, {
        method: api.requests.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update request");
      return api.requests.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.requests.listByItem.path, variables.itemId] });
      toast({
        title: "Request Updated",
        description: `Request has been ${variables.status}.`,
      });
    },
  });
}
