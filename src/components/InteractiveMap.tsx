'use client';

import { useEffect, useState } from 'react';
import { Store } from '@/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leafletのアイコン不具合対策
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function InteractiveMap({ stores }: { stores: Store[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 font-bold">MAP LOADING...</div>;

  // 動的インポート
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');

  const center: [number, number] = [35.98, 140.15]; // 牛久市中心部

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores.map((store) => {
          if (!store.latitude || !store.longitude) return null;
          return (
            <Marker key={store.id} position={[store.latitude, store.longitude]} icon={icon}>
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-sm mb-1">{store.name}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{store.content}</p>
                  <a 
                    href={store.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-600 font-bold mt-2 block"
                  >
                    詳細を見る →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
