import type { ShopItem } from '../types/domain';

export const SHOP_ITEMS: ShopItem[] = [
  { code: 'ki_hair_gold', name: 'Cabello Fase Dorada', category: 'hair', price: 100, icon: '🌟', universe_id: 'ki_warriors' },
  { code: 'ki_aura_blue', name: 'Aura de Energía Azul', category: 'aura', price: 150, icon: '💠', universe_id: 'ki_warriors' },
  { code: 'ki_scouter_red', name: 'Visor de Nivel de Poder', category: 'accessory', price: 80, icon: '🔴', universe_id: 'ki_warriors' },
  { code: 'ki_gi_master', name: 'Traje del Gran Torneo', category: 'outfit', price: 120, icon: '🥋', universe_id: 'ki_warriors' },
  { code: 'sl_jersey_bicolor', name: 'Camiseta de Campeones', category: 'outfit', price: 100, icon: '👕', universe_id: 'super_league' },
  { code: 'sl_boots_fire', name: 'Chimpunes de Fuego', category: 'accessory', price: 150, icon: '🔥', universe_id: 'super_league' },
  { code: 'sl_hair_lightning', name: 'Corte Rayo Dorado', category: 'hair', price: 80, icon: '⚡', universe_id: 'super_league' },
  { code: 'sl_ball_galaxy', name: 'Balón Galáctico Flotante', category: 'pet', price: 120, icon: '⚽', universe_id: 'super_league' },
  { code: 'bb_armor_diamond', name: 'Armadura de Cristal', category: 'outfit', price: 150, icon: '💎', universe_id: 'block_builders' },
  { code: 'bb_pickaxe_laser', name: 'Pico de Plasma', category: 'accessory', price: 100, icon: '⛏️', universe_id: 'block_builders' },
  { code: 'bb_pet_slime', name: 'Cubo Mascota Saltarín', category: 'pet', price: 80, icon: '🟩', universe_id: 'block_builders' },
  { code: 'bb_aura_pixels', name: 'Lluvia de Píxeles', category: 'aura', price: 120, icon: '🔷', universe_id: 'block_builders' },
];
