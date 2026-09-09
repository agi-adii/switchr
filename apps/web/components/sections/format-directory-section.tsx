"use client";

import { useState, useMemo } from "react";
import { CONVERSION_REGISTRY } from "@/lib/registry";
import { Search, ArrowRight, Grid, Zap } from "lucide-react";

export function FormatDirectorySection() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const allPairs = useMemo(() => {
    const list: { from: string; to: string; category: string; fromName: string; engine: string }[] = [];

    Object.values(CONVERSION_REGISTRY).forEach((item) => {
      item.conversions.forEach((rule) => {
        list.push({
          from: item.extension,
          to: rule.target,
          category: item.category,
          fromName: item.name,
          engine: rule.engine,
        });
      });
    });

    return list;
  }, []);

  const filtered = useMemo(() => {
    return allPairs.filter((pair) => {
      const matchesCategory =
        selectedCategory === "all" || pair.category === selectedCategory;
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        pair.from.includes(query) ||
        pair.to.includes(query) ||
        `${pair.from} to ${pair.to}`.includes(query) ||
        pair.fromName.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [allPairs, selectedCategory, search]);

  const scrollToConverter = () => {
    document.getElementById("converter")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="directory" className="w-full py-16 scroll-mt-16 border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold mb-3">
            <Grid className="w-3.5 h-3.5" />
            Format Directory &amp; Compatibility
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Supported Conversion Directory
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mt-2">
            Every listed format is verified and supported. No fake conversions or unverified combinations.
          </p>

          {/* Search bar */}
          <div className="relative w-full max-w-md mt-6">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search e.g. JPG to PDF, MP4 to MP3, JSON..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {["all", "image", "audio", "video", "data", "document"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/50 border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
          {filtered.map((pair, idx) => (
            <div
              key={idx}
              onClick={scrollToConverter}
              className="p-3.5 rounded-2xl border border-border bg-card hover:border-primary/60 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                  {pair.category}
                </span>
                <span className="text-[9px] font-mono text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {pair.engine}
                </span>
              </div>

              <div className="flex items-center gap-2 my-2.5 text-xs font-bold text-foreground">
                <span className="font-mono uppercase">{pair.from}</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                <span className="font-mono uppercase text-primary">{pair.to}</span>
              </div>

              <span className="text-[11px] text-muted-foreground truncate">
                {pair.fromName}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={scrollToConverter}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            Convert With These Formats Now
          </button>
        </div>
      </div>
    </section>
  );
}
