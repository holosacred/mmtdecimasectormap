import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Sector, PrayerWindow, GeoJsonWorld, DecimaTime } from '../../types';
import { SECTORS, SECTOR_WIDTH, MAKKAH_LON, PRAYER_WINDOWS } from '../../constants';
import { getSectorTime } from '../../utils/time';

interface DecimaMapProps {
  mmt: DecimaTime;
  activeSectorId: number | null;
  onSectorClick: (id: number) => void;
  showPrayers: boolean;
}

const DecimaMap: React.FC<DecimaMapProps> = ({ mmt, activeSectorId, onSectorClick, showPrayers }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = React.useState<any>(null);

  // Fetch world data once
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json')
      .then(response => response.json())
      .then(data => {
        const feature = topojson.feature(data as any, (data as any).objects.land);
        setWorldData(feature);
      })
      .catch(err => console.error("Failed to load map data", err));
  }, []);

  // Responsive D3 Draw Logic
  useEffect(() => {
    if (!svgRef.current || !worldData || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Equirectangular projection fits the "vertical bands" logic best
    const projection = d3.geoEquirectangular()
      .fitSize([width, height], worldData)
      .rotate([-MAKKAH_LON, 0]); // Rotate so Makkah (Sector 0) is roughly central or align 0 to center? 
      // Actually, if we want Sector 0 centered, we rotate by -MAKKAH_LON.
      // But let's just use standard 0 center and draw sectors accordingly to avoid confusion.
      // Or better: Align so the map looks nice. Standard view is usually Europe/Africa centered. 
      // Makkah is 40E. 
    
    // Let's re-center on Makkah (Sector 0) to make it the "Prime" visual.
    projection.rotate([-MAKKAH_LON, 0]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Clear previous
    svg.selectAll("*").remove();

    // 1. Draw Land
    svg.append("path")
      .datum(worldData)
      .attr("d", pathGenerator)
      .attr("fill", "#1e293b") // slate-800
      .attr("stroke", "#334155") // slate-700
      .attr("stroke-width", 0.5);

    // 2. Draw Sectors (Grid)
    // We want 10 bands. 
    // Since projection rotates -40, Sector 0 (40E) is at X center?
    // Let's calculate the X pixel positions for the bands.
    // Sector 0 center is 40E.
    // Band edges are +/- 18 deg from center.
    // We need to map Longitude to Pixels.
    
    const getX = (lon: number) => {
        const coords = projection([lon, 0]);
        return coords ? coords[0] : 0;
    };

    // Because of wrapping (International Date Line), simple rects might break if they cross the edge.
    // We can use GeoJSON Polygons for bands to handle projection correctly.
    
    SECTORS.forEach((sector) => {
      const center = sector.centerLon;
      // Define a polygon for the sector: [lon-18, 90], [lon+18, 90], [lon+18, -90], [lon-18, -90]
      // Handle wrapping manually if needed, but d3.geoPath handles it if we pass a Feature.
      
      const left = center - 18;
      const right = center + 18;
      
      const coords = [
        [left, 90],
        [right, 90],
        [right, -90],
        [left, -90],
        [left, 90]
      ];

      const sectorFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coords]
        }
      };

      const isSelected = activeSectorId === sector.id;
      
      const group = svg.append("g")
        .attr("class", "sector-group cursor-pointer hover:opacity-80 transition-opacity")
        .on("click", () => onSectorClick(sector.id));

      group.append("path")
        .datum(sectorFeature as any)
        .attr("d", pathGenerator)
        .attr("fill", isSelected ? "rgba(16, 185, 129, 0.15)" : "rgba(255,255,255,0.02)") // Emerald tint if selected
        .attr("stroke", isSelected ? "#fbbf24" : "rgba(255,255,255,0.05)") // Gold stroke if selected
        .attr("stroke-width", isSelected ? 2 : 0.5);
        
      // Sector Label (ID)
      const centerPt = projection([center, 0]);
      if (centerPt) {
        group.append("text")
          .attr("x", centerPt[0])
          .attr("y", height - 20)
          .attr("text-anchor", "middle")
          .attr("class", "font-mono text-xs fill-slate-500 pointer-events-none select-none")
          .text(sector.id.toString());
      }
    });

    // 3. Draw Prayer Overlays (Dynamic)
    if (showPrayers) {
      PRAYER_WINDOWS.forEach(prayer => {
        // Prayer happens at Local Time T_prayer.
        // We need to find Longitude where LocalTime == T_prayer.
        // T_local = (MMT + offset) % 10.
        // Offset (in Decas) corresponds to Longitude difference / 36.
        // Actually, earlier we said Sector ID ~ Offset.
        // Let's use continuous longitude.
        // T_loc = (MMT_dec + (Lon - MAKKAH_LON)/36) % 10.
        // We want T_loc = PrayerStart.
        // PrayerStart = (MMT_dec + (Lon - 40)/36)
        // (Lon - 40)/36 = PrayerStart - MMT_dec
        // Lon = 40 + 36 * (PrayerStart - MMT_dec)
        
        let deltaDeca = prayer.startDeca - mmt.rawDeca;
        // Normalize delta to ensure we find the instance on the map (Earth wraps)
        // We might have multiple instances if map shows > 360? No, standard map.
        // Wrap deltaDeca to [-5, 5] or [0, 10]?
        // Earth is 360 deg = 10 Decas.
        
        // We need to handle modulo.
        // The line exists where the phase matches.
        // Let's calculate the primary longitude.
        
        let targetLon = MAKKAH_LON + (deltaDeca * 36);
        
        // Normalize targetLon to [-180, 180]
        while (targetLon > 180) targetLon -= 360;
        while (targetLon < -180) targetLon += 360;

        // Draw a vertical line (or great circle arc) at targetLon.
        const lineCoords = [
          [targetLon, 90],
          [targetLon, -90]
        ];
        
        const lineFeature = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: lineCoords
          }
        };

        svg.append("path")
          .datum(lineFeature as any)
          .attr("d", pathGenerator)
          .attr("fill", "none")
          .attr("stroke", prayer.color)
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "4,4")
          .attr("opacity", 0.8);
          
         // Add Label near equator or top
         const labelPt = projection([targetLon, 45]);
         if (labelPt) {
            svg.append("text")
              .attr("x", labelPt[0])
              .attr("y", labelPt[1])
              .attr("fill", prayer.color)
              .attr("font-size", "10px")
              .attr("class", "font-mono font-bold drop-shadow-md")
              .text(prayer.name);
         }
      });
    }
    
    // 4. Draw Terminator (Night/Day) - Optional Polish
    // Not strictly required by prompt but adds "S.U.I.T.E." aesthetic nicely.
    // Skipping to keep code size managed and focus on requirements.

  }, [worldData, mmt.rawDeca, activeSectorId, showPrayers]); // Re-render when time changes significantly or interaction happens

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] relative overflow-hidden bg-slate-950 rounded-xl border border-slate-800 shadow-2xl">
      <svg ref={svgRef} className="w-full h-full block absolute inset-0" style={{ pointerEvents: 'all' }}></svg>
      
      {/* Overlay Gradient for "Scanline" effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>
    </div>
  );
};

export default DecimaMap;
