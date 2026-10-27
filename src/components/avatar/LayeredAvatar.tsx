import type { ChildProfile, ShopItem, Universe } from '../../types/domain';
import { SHOP_ITEMS } from '../../data/shopItems';


interface LayeredAvatarProps {
  profile: Pick<
    ChildProfile,
    'name' | 'avatar' | 'current_streak' | 'inventory' | 'equipped_items'
  >;
  universe: Pick<Universe, 'character'>;
  compact?: boolean;
}

const assetPath = (code: string): string => {
  const cleanCode = code.replace(/\.svg$/i, '');
  return `/assets/avatar/${cleanCode}.svg`;
};

const isRenderableCode = (code: string | null | undefined): code is string =>
  Boolean(code && code !== 'default' && code !== 'none');

function ItemVisual({ code }: { code: string }) {
  return (
    <span className={`item-visual item-${code}`} aria-hidden="true">
      <img src={assetPath(code)} alt="" loading="eager" />
    </span>
  );
}

export default function LayeredAvatar({
  profile,
  universe,
  compact = false,
}: LayeredAvatarProps) {
  const owned = new Map<string, ShopItem>();
  (profile.inventory || []).forEach((code) => {
    const item = SHOP_ITEMS.find((candidate) => candidate.code === code);
    if (item) owned.set(code, item);
  });

  const equipped = profile.equipped_items || {
    aura: null,
    hair: 'default',
    outfit: 'default',
    accessory: null,
    pet: null,
  };
  const layers = [
    { key: 'aura', code: equipped.aura },
    { key: 'outfit', code: equipped.outfit },
    { key: 'hair', code: equipped.hair },
    { key: 'accessory', code: equipped.accessory },
    { key: 'pet', code: equipped.pet },
  ].filter((layer) => isRenderableCode(layer.code));

  return (
    <div
      className={`layered-avatar ${compact ? 'compact' : ''}`}
      aria-label={`Avatar de ${profile.name}`}
    >
      <div className="avatar-layer layer-body">
        <img className="avatar-body-image" src={assetPath('base_body')} alt="" loading="eager" />
      </div>
      {layers.map((layer) => {
        const item = owned.get(layer.code);
        return (
          <div
            className={`avatar-layer layer-${layer.key} ${
              layer.key === 'aura' && profile.current_streak >= 3
                ? 'aura-charged'
                : ''
            }`}
            key={layer.key}
          >
            {item && <ItemVisual code={item.code} />}
          </div>
        );
      })}
    </div>
  );
}
