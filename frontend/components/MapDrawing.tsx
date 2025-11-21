'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { calculatePolygonArea, formatArea, Coordinate } from '@/lib/area-calculator';

interface MapDrawingProps {
  onBoundaryChange: (coordinates: Coordinate[]) => void;
}

export default function MapDrawing({ onBoundaryChange }: MapDrawingProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [drawingManager, setDrawingManager] = useState<any>(null);
  const [currentPolygon, setCurrentPolygon] = useState<any>(null);
  const [area, setArea] = useState({ sq_feet: 0, sq_yards: 0, guntas: 0, acres: 0 });

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['drawing', 'geometry'],
      });

      try {
        const { Map } = await loader.importLibrary('maps');
        const { DrawingManager } = await loader.importLibrary('drawing');

        if (!mapRef.current) return;

        const mapInstance = new Map(mapRef.current, {
          center: { lat: 17.3850, lng: 78.4867 },
          zoom: 12,
          mapTypeId: 'satellite',
        });

        const drawingManagerInstance = new DrawingManager({
          drawingMode: (window as any).google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: (window as any).google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [(window as any).google.maps.drawing.OverlayType.POLYGON],
          },
          polygonOptions: {
            fillColor: '#00FF00',
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: '#00FF00',
            editable: true,
            draggable: false,
          },
        });

        drawingManagerInstance.setMap(mapInstance);

        (window as any).google.maps.event.addListener(drawingManagerInstance, 'polygoncomplete', (polygon: any) => {
          if (currentPolygon) {
            currentPolygon.setMap(null);
          }

          setCurrentPolygon(polygon);
          drawingManagerInstance.setDrawingMode(null);
          updateCoordinates(polygon);

          (window as any).google.maps.event.addListener(polygon.getPath(), 'set_at', () => updateCoordinates(polygon));
          (window as any).google.maps.event.addListener(polygon.getPath(), 'insert_at', () => updateCoordinates(polygon));
          (window as any).google.maps.event.addListener(polygon.getPath(), 'remove_at', () => updateCoordinates(polygon));
        });

        setMap(mapInstance);
        setDrawingManager(drawingManagerInstance);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  const updateCoordinates = (polygon: any) => {
    const path = polygon.getPath();
    const coords: Coordinate[] = [];

    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coords.push({ lat: point.lat(), lng: point.lng() });
    }

    const areaSqFeet = calculatePolygonArea(coords);
    const areas = formatArea(areaSqFeet);
    setArea(areas);
    onBoundaryChange(coords);
  };

  return (
    <div>
      <div ref={mapRef} className="w-full h-[500px] rounded-lg border-2 border-gray-300 mb-4" />

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-primary mb-2">Calculated Area:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Square Feet</p>
            <p className="text-lg font-bold text-gray-900">{area.sq_feet.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Square Yards</p>
            <p className="text-lg font-bold text-gray-900">{area.sq_yards.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Guntas</p>
            <p className="text-lg font-bold text-gray-900">{area.guntas.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Acres</p>
            <p className="text-lg font-bold text-gray-900">{area.acres.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
