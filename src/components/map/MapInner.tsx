'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '@/hooks/useTheme';
import type { Store } from '@/types';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LIGHT_TILE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const DARK_TILE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

interface MapInnerProps {
  stores: Store[];
  center: [number, number];
  onSelectStore?: (store: Store) => void;
}

export default function MapInner({ stores, center, onSelectStore }: MapInnerProps) {
  const { isDark } = useTheme();

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={isDark ? DARK_TILE : LIGHT_TILE}
      />
      {stores.map((store) => {
        if (!store.latitude || !store.longitude) return null;
        return (
          <Marker key={store.id} position={[store.latitude, store.longitude]} icon={markerIcon}>
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-sm mb-1">{store.name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{store.content}</p>
                {onSelectStore ? (
                  <button
                    type="button"
                    onClick={() => onSelectStore(store)}
                    className="text-[10px] text-blue-600 font-bold mt-2 block cursor-pointer hover:underline"
                  >
                    詳細を見る →
                  </button>
                ) : (
                  <a
                    href={store.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-600 font-bold mt-2 block"
                  >
                    詳細を見る →
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
