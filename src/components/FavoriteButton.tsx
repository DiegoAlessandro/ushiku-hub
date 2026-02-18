'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export function FavoriteButton({ storeId }: { storeId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('ushiku_favorites') || '[]');
    setIsFavorite(favorites.includes(storeId));
  }, [storeId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('ushiku_favorites') || '[]');
    let newFavorites;
    
    if (favorites.includes(storeId)) {
      newFavorites = favorites.filter((id: string) => id !== storeId);
      setIsFavorite(false);
    } else {
      newFavorites = [...favorites, storeId];
      setIsFavorite(true);
    }
    
    localStorage.setItem('ushiku_favorites', JSON.stringify(newFavorites));
    
    // カスタムイベントを発火させて、他コンポーネントに通知
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full backdrop-blur-md transition-all ${
        isFavorite 
        ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
        : 'bg-white/80 text-slate-400 hover:text-red-400'
      }`}
      title={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <Heart size={16} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
    </button>
  );
}
