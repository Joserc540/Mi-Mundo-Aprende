import { Check, X } from 'lucide-react';
import React from 'react';
import type { ChildProfile, ShopItem, Universe } from '../../types/domain';
import { SHOP_ITEMS } from '../../data/shopItems';

interface MiniShopDrawerProps {
  profile: Pick<ChildProfile, 'coins' | 'inventory'>;
  universe: Pick<Universe, 'id'>;
  showAllItems?: boolean;
  onClose: () => void;
  onPurchase: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
}

export default function MiniShopDrawer({
  profile,
  universe,
  showAllItems = false,
  onClose,
  onPurchase,
  onEquip,
}: MiniShopDrawerProps) {
  const [message, setMessage] = React.useState('');
  const items = showAllItems
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter((item) => item.universe_id === universe.id);

  const handleItem = (item: ShopItem, owned: boolean) => {
    if (owned) {
      onEquip(item);
      setMessage(`${item.name} equipado`);
    } else if (profile.coins >= item.price) {
      onPurchase(item);
      setMessage(`¡${item.name} desbloqueado!`);
    } else {
      setMessage(`Te faltan ${item.price - profile.coins} monedas`);
    }
  };

  return (
    <aside className="shop-drawer">
      <div className="shop-head">
        <div><p className="eyebrow">{showAllItems ? 'Catálogo completo' : 'Mini tienda'}</p><h2>Arma tu poder</h2></div>
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar tienda"><X size={20} /></button>
      </div>
      <div className="shop-coins"><span>🪙</span><strong>{profile.coins}</strong><small>monedas disponibles</small></div>
      <div className="shop-items">
        {items.map((item) => {
          const owned = profile.inventory.includes(item.code);
          const missing = Math.max(item.price - profile.coins, 0);
          return (
            <div className={`shop-item ${owned ? 'owned' : ''}`} key={item.code}>
              <span className="shop-item-icon"><img src={`/assets/avatar/${item.code.replace(/\.svg$/i, '')}.svg`} alt="" /></span>
              <div><strong>{item.name}</strong><small>{item.category}</small></div>
              <button onClick={() => handleItem(item, owned)}>
                {owned ? 'Equipar' : missing ? `¡Te faltan ${missing} monedas (${Math.ceil(missing / 15)} problemas más)!` : `🪙 ${item.price}`}
              </button>
            </div>
          );
        })}
      </div>
      {message && <div className="shop-message"><Check size={16} /> {message}</div>}
      <p className="shop-footnote">Cada acierto en el primer intento da 15 monedas.</p>
    </aside>
  );
}
