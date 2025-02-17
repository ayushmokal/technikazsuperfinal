import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { data: searchResults } = useQuery({
    queryKey: ['blogs', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;
      
      const { data, error } = await supabase 
        .from('blogs')
        .select('id, title, category, created_at, slug')
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,meta_description.ilike.%${searchQuery}%,meta_keywords.ilike.%${searchQuery}%`)
        .limit(5);
      
      if (error) { 
        console.error('Error searching blogs:', error);
        toast({
          variant: "destructive",
          title: "Search failed",
          description: "Please try again later",
        });
        return null;
      }
      
      return data;
    },
    enabled: searchQuery.length >= 2,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 1000
  });

  return (
    <div className={isMobile ? "relative" : "relative w-full max-w-[250px] sm:max-w-[350px]"}>
      {isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          className="h-8 w-8 p-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start text-muted-foreground"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          Search articles...
        </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <div className="flex items-center justify-between p-2 border-b">
          <DialogTitle className="text-lg font-semibold">Search Articles</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Command>
          <CommandInput
            placeholder="Type to search articles..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            autoFocus
          />
          <CommandList className="max-h-[50vh] overflow-y-auto">
            <CommandEmpty>
              {!searchQuery.trim() ? (
                "Start typing to search..."
              ) : searchQuery.length < 2 ? (
                "Type at least 2 characters to search..."
              ) : (
                "No matching articles found. Try different keywords."
              )}
            </CommandEmpty>
            {searchResults?.length > 0 && (
              <CommandGroup heading="Search Results">
              {searchResults?.map((article) => (
                <CommandItem
                  key={article.id}
                  onSelect={() => {
                    navigate(`/article/${article.slug}`);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-2 p-2 cursor-pointer"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium line-clamp-1">{article.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {article.category} • {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CommandItem>
              ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}