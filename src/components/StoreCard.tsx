import { Store } from '@/types';

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  const categoryLabels: Record<string, string> = {
    food: '飲食店',
    beauty: '美容室',
    shop: 'ショップ',
    event: 'イベント',
    other: 'その他'
  };

  const categoryColors: Record<string, string> = {
    food: 'bg-orange-100 text-orange-800',
    beauty: 'bg-pink-100 text-pink-800',
    shop: 'bg-blue-100 text-blue-800',
    event: 'bg-green-100 text-green-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {store.imageUrl && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={store.imageUrl}
            alt={store.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[store.category]}`}>
            {categoryLabels[store.category]}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(store.collectedAt)}
          </span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{store.name}</h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {store.content}
        </p>
        
        {store.address && (
          <p className="text-xs text-gray-500 mb-2">
            📍 {store.address}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-xs text-gray-400">
            出典: {store.source === 'instagram' ? 'Instagram' : store.source === 'twitter' ? 'X' : 'Web'}
          </span>
          <a
            href={store.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            元投稿を見る →
          </a>
        </div>
      </div>
    </article>
  );
}
