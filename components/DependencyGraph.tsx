/**
 * @license
 * Copyright (c) 2025 ArchLens Strategic Systems. All rights reserved.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { DependencyNode, DependencyLink } from '../types';
import { CpuIcon, ShieldIcon, RocketIcon, GraphIcon } from './Icons';

interface Props {
  nodes: DependencyNode[];
  links: DependencyLink[];
  onNodeClick: (id: string) => void;
  onRefreshGraph?: () => void;
}

const DependencyGraph: React.FC<Props> = ({ nodes, links, onNodeClick, onRefreshGraph }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    const defs = svg.append("defs");
    
    defs.append("marker")
      .attr("id", "arrow-std")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#2f81f744");

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(250))
      .force("charge", d3.forceManyBody().strength(-1500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(100));

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#2f81f722")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow-std)");

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag()
        .on("start", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any)
      .on("click", (e, d: any) => {
         setSelectedNode(d);
      });

    node.append("circle")
      .attr("r", (d: any) => 22 + (d.toxicity || 0) / 8)
      .attr("fill", (d: any) => (d.toxicity || 0) > 60 ? "#f8514911" : "#2f81f708")
      .attr("stroke", "transparent");

    node.append("circle")
      .attr("r", (d: any) => 18 + (d.criticality || 0) / 10)
      .attr("fill", (d: any) => {
         if ((d.toxicity || 0) > 70) return "#f85149";
         if (d.tier === 'Architectural') return "#3fb950";
         if (d.tier === 'Infrastructure') return "#d29922";
         return "#2f81f7";
      })
      .attr("stroke", "#050505")
      .attr("stroke-width", 3);

    node.append("text")
      .text((d: any) => d.label)
      .attr("fill", "#e6edf3")
      .attr("font-size", "11px")
      .attr("font-family", "'JetBrains Mono', monospace")
      .attr("font-weight", "700")
      .attr("text-anchor", "middle")
      .attr("dy", 45);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

  }, [nodes, links]);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#050505] relative overflow-hidden flex flex-col selection:bg-[#2f81f733]">
      <div className="absolute top-10 left-10 z-10 space-y-4 pointer-events-none">
          <h2 className="text-4xl font-black italic text-[#2f81f7] tracking-tighter uppercase leading-none">Strategic Knowledge <span className="text-white opacity-40">Graph</span></h2>
          <div className="flex flex-col gap-2">
             <div className="text-[#484f58] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                <ShieldIcon className="w-3 h-3 text-[#3fb950]" /> Active Logic Clusters: {nodes.length}
             </div>
             <div className="text-[#484f58] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                <RocketIcon className="w-3 h-3 text-[#2f81f7]" /> Cross-Module Links: {links.length}
             </div>
          </div>
      </div>

      <div className="absolute top-10 right-10 z-20 flex flex-col gap-4">
         <button 
            onClick={onRefreshGraph}
            className="bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 pointer-events-auto"
         >
            <CpuIcon className="w-4 h-4" /> RE-INDEX FLEET ASSETS
         </button>
      </div>
      
      <svg ref={svgRef} className="w-full h-full cursor-move" />

      {selectedNode && (
         <div className="absolute bottom-10 left-10 z-20 w-96 animate-in slide-in-from-left-10 duration-500">
            <div className="glass-card p-10 rounded-[50px] border border-[#30363d] bg-[#161b22]/90 backdrop-blur-3xl space-y-6 relative overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
               <button onClick={() => setSelectedNode(null)} className="absolute top-6 right-8 text-[#484f58] hover:text-white text-xl">×</button>
               <div className="space-y-1">
                  <div className="text-[10px] font-black text-[#2f81f7] uppercase tracking-[0.4em] mb-2">{selectedNode.tier} Tier</div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedNode.label}</h3>
                  <div className="text-[9px] font-mono text-[#484f58] font-bold truncate">{selectedNode.id}</div>
               </div>
               
               <div className="bg-[#050505] p-6 rounded-3xl border border-white/5 space-y-3 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#2f81f7]" />
                  <div className="text-[9px] font-black text-[#8b949e] uppercase tracking-[0.3em] flex items-center gap-2">
                     <RocketIcon className="w-3 h-3" /> Architectural Intent
                  </div>
                  <p className="text-[13px] text-[#c9d1d9] leading-relaxed italic font-medium">"{selectedNode.intent || 'Logical core component awaiting deep semantic mapping.'}"</p>
               </div>

               <div className="flex gap-4">
                  <button 
                     onClick={() => onNodeClick(selectedNode.id)}
                     className="flex-1 bg-[#2f81f7] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                  >
                     SCUTINIZE SOURCE
                  </button>
                  <button className="px-6 bg-white/5 text-[#8b949e] py-4 rounded-2xl border border-white/5 hover:text-white transition-all">
                     <GraphIcon className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default DependencyGraph;