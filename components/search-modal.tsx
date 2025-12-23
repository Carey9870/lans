import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import debounce from "lodash.debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Debounced API call
  const runSearch = useCallback(
    debounce((value: string) => {
      console.log("Searching for:", value);
      // call API here
    }, 400),
    []
  );

  const handleChange = (e: any) => {
    setQuery(e.target.value);
    runSearch(e.target.value);
  };

  return (
    <>
      {/* Search Icon Trigger */}
      <button onClick={() => setOpen(true)}>
        <Search className="h-6 w-6 text-black" />
      </button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>

          <Input
            value={query}
            onChange={handleChange}
            placeholder="Search..."
            className="mt-2"
          />

          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button onClick={() => console.log("Final search:", query)}>
              Search
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
