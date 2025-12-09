// app/land-registries/page.tsx
import { Suspense } from "react";
import { LandRegistryClient } from "./land-registry-client"; 
import { Spinner } from "@/components/ui/spinner";

export default function LandRegistriesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Land Registries</h1>
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        }
      >
        <LandRegistryClient />
      </Suspense>
    </div>
  );
}