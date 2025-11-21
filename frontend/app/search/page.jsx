'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { landAPI } from '@/lib/api';
import { calculatePolygonArea, formatArea, calculateDistance, formatDistance } from '@/lib/area-calculator';
import Link from 'next/link';
import { Ruler, Circle, Maximize, Trash2, Filter, Search, MapPin, TrendingUp } from 'lucide-react';

export default function SearchPage() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [lands, setLands] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [measurement, setMeasurement] = useState('');
  const [filters, setFilters] = useState({ district: '', price_range: '', min_area: '', max_area: '' });

  const distanceMarkers = useRef([]);
  const distancePath = useRef(null);
  const radiusCircle = useRef(null);
  const areaPolygon = useRef(null);
  const areaPoints = useRef([]);

  useEffect(() => {
    initMap();
    loadLands();
  }, []);

  const initMap = async () => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['geometry'],
    });

    try {
      const { Map } = await loader.importLibrary('maps');
      if (!mapRef.current) return;

      const mapInstance = new Map(mapRef.current, {
        center: { lat: 17.3850, lng: 78.4867 },
        zoom: 10,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      mapInstance.addListener('click', (e) => {
        handleMapClick(e.latLng);
      });

      setMap(mapInstance);
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  };

  const loadLands = async (customFilters = {}) => {
    try {
      const result = await landAPI.getAll(customFilters);
      setLands(result.lands || []);
      displayMarkers(result.lands || []);
    } catch (error) {
      console.error('Error loading lands:', error);
    }
  };

  const displayMarkers = (landList) => {
    markers.forEach(m => m.setMap(null));
    const newMarkers = [];

    landList.forEach(land => {
      if (land.center_lat && land.center_lng && map) {
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(land.center_lat), lng: parseFloat(land.center_lng) },
          map,
          title: land.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#059669',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
        });

        marker.addListener('click', () => {
          alert(`${land.title} - Click to view details`);
        });

        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);
  };

  const handleMapClick = (latLng) => {
    if (!latLng) return;

    if (activeTool === 'distance') {
      const marker = new window.google.maps.Marker({
        position: latLng,
        map,
        label: {
          text: (distanceMarkers.current.length + 1).toString(),
          color: 'white',
          fontWeight: 'bold',
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#dc2626',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
      distanceMarkers.current.push(marker);

      if (distanceMarkers.current.length > 1) {
        const path = distanceMarkers.current.map(m => m.getPosition());
        if (distancePath.current) distancePath.current.setMap(null);

        distancePath.current = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#dc2626',
          strokeWeight: 3,
          map,
        });

        let totalDist = 0;
        for (let i = 0; i < path.length - 1; i++) {
          totalDist += calculateDistance(path[i].lat(), path[i].lng(), path[i + 1].lat(), path[i + 1].lng());
        }
        setMeasurement(`Total Distance: ${formatDistance(totalDist)}`);
      }
    } else if (activeTool === 'radius') {
      const radiusKm = prompt('Enter radius in kilometers:', '5');
      if (!radiusKm) return;

      if (radiusCircle.current) radiusCircle.current.setMap(null);

      radiusCircle.current = new window.google.maps.Circle({
        center: latLng,
        radius: parseFloat(radiusKm) * 1000,
        map,
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        strokeColor: '#3b82f6',
        strokeWeight: 3,
      });

      const count = lands.filter(land => {
        const dist = calculateDistance(latLng.lat(), latLng.lng(), parseFloat(land.center_lat), parseFloat(land.center_lng));
        return dist <= parseFloat(radiusKm);
      }).length;

      setMeasurement(`Radius: ${radiusKm} km | Lands found: ${count}`);
      setActiveTool(null);
    } else if (activeTool === 'area') {
      areaPoints.current.push(latLng);

      const marker = new window.google.maps.Marker({
        position: latLng,
        map,
        label: {
          text: areaPoints.current.length.toString(),
          color: 'white',
          fontWeight: 'bold',
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#16a34a',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
      distanceMarkers.current.push(marker);

      if (areaPoints.current.length > 2) {
        const first = areaPoints.current[0];
        const last = areaPoints.current[areaPoints.current.length - 1];
        const dist = calculateDistance(first.lat(), first.lng(), last.lat(), last.lng());

        if (dist < 0.05) {
          if (areaPolygon.current) areaPolygon.current.setMap(null);

          areaPolygon.current = new window.google.maps.Polygon({
            paths: areaPoints.current,
            map,
            fillColor: '#16a34a',
            fillOpacity: 0.2,
            strokeColor: '#16a34a',
            strokeWeight: 3,
          });

          const coords = areaPoints.current.map(p => ({ lat: p.lat(), lng: p.lng() }));
          const areaSqFeet = calculatePolygonArea(coords);
          const areas = formatArea(areaSqFeet);
          setMeasurement(`Area: ${areas.guntas.toLocaleString()} guntas | ${areas.acres.toLocaleString()} acres`);
          setActiveTool(null);
        }
      }
    }
  };

  const clearMeasurements = () => {
    distanceMarkers.current.forEach(m => m.setMap(null));
    distanceMarkers.current = [];
    if (distancePath.current) distancePath.current.setMap(null);
    if (radiusCircle.current) radiusCircle.current.setMap(null);
    if (areaPolygon.current) areaPolygon.current.setMap(null);
    areaPoints.current = [];
    setMeasurement('');
    setActiveTool(null);
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <div className="w-96 bg-white overflow-y-auto border-r border-slate-200 shadow-xl">
        <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <h2 className="text-2xl font-black mb-2">Property Explorer</h2>
          <p className="text-slate-300 text-sm">Search and measure land properties</p>
        </div>

        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2 mb-4">
            <Ruler className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900">Measurement Tools</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setActiveTool('distance')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
                activeTool === 'distance'
                  ? 'border-red-600 bg-red-50 shadow-lg shadow-red-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <Ruler className={`w-6 h-6 mb-2 ${activeTool === 'distance' ? 'text-red-600' : 'text-slate-400'}`} />
              <span className={`text-sm font-bold ${activeTool === 'distance' ? 'text-red-600' : 'text-slate-700'}`}>
                Distance
              </span>
            </button>

            <button
              onClick={() => setActiveTool('radius')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
                activeTool === 'radius'
                  ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <Circle className={`w-6 h-6 mb-2 ${activeTool === 'radius' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className={`text-sm font-bold ${activeTool === 'radius' ? 'text-blue-600' : 'text-slate-700'}`}>
                Radius
              </span>
            </button>

            <button
              onClick={() => setActiveTool('area')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
                activeTool === 'area'
                  ? 'border-green-600 bg-green-50 shadow-lg shadow-green-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <Maximize className={`w-6 h-6 mb-2 ${activeTool === 'area' ? 'text-green-600' : 'text-slate-400'}`} />
              <span className={`text-sm font-bold ${activeTool === 'area' ? 'text-green-600' : 'text-slate-700'}`}>
                Area
              </span>
            </button>

            <button
              onClick={clearMeasurements}
              className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-red-300 hover:bg-red-50 transition-all duration-200 flex flex-col items-center group"
            >
              <Trash2 className="w-6 h-6 mb-2 text-slate-400 group-hover:text-red-600" />
              <span className="text-sm font-bold text-slate-700 group-hover:text-red-600">Clear</span>
            </button>
          </div>

          {measurement && (
            <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl">
              <div className="text-xs text-emerald-700 font-bold mb-1">MEASUREMENT RESULT</div>
              <div className="text-sm font-bold text-emerald-900">{measurement}</div>
            </div>
          )}
        </div>

        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900">Filters</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">DISTRICT</label>
              <input
                type="text"
                placeholder="Enter district name"
                value={filters.district}
                onChange={e => setFilters({ ...filters, district: e.target.value })}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">PRICE RANGE</label>
              <select
                value={filters.price_range}
                onChange={e => setFilters({ ...filters, price_range: e.target.value })}
                className="input-field text-sm"
              >
                <option value="">All Prices</option>
                <option value="0-10L">0 - 10L</option>
                <option value="10L-25L">10L - 25L</option>
                <option value="25L-50L">25L - 50L</option>
                <option value="50L-1Cr">50L - 1Cr</option>
                <option value="1Cr+">1Cr+</option>
              </select>
            </div>

            <button onClick={() => loadLands(filters)} className="btn-primary w-full">
              <Search className="w-4 h-4 inline-block mr-2" />
              Apply Filters
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Results</h3>
            </div>
            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
              {lands.length} Found
            </div>
          </div>

          <div className="space-y-3">
            {lands.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No properties found</p>
              </div>
            ) : (
              lands.map(land => (
                <Link
                  key={land.id}
                  href={`/land/${land.id}`}
                  className="block p-4 border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:shadow-lg transition-all duration-200 bg-white group"
                >
                  <h4 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {land.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-600 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{land.district}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600">{land.price_range}</span>
                    <span className="text-slate-500">{land.area_guntas} guntas</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div ref={mapRef} className="flex-1 relative">
        {activeTool && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border-2 border-slate-200">
            <p className="text-sm font-bold text-slate-900">
              Click on the map to use the{' '}
              <span className="text-emerald-600">{activeTool}</span> tool
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
