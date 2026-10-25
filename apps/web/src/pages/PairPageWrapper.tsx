import React from "react";
import { useParams } from "react-router-dom";
import { getPseoPairBySlug } from "@/lib/pseo-registry";
import { PseoConverterClient } from "@/components/pseo/pseo-converter-client";

export function PairPageWrapper() {
  const { pair } = useParams<{ pair: string }>();
  const config = getPseoPairBySlug(pair || "");

  if (!config) {
    return (
      <div className="w-full max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-foreground">Conversion Pair Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The requested conversion pair &quot;{pair}&quot; is not configured.
        </p>
      </div>
    );
  }

  return <PseoConverterClient pair={config} />;
}
