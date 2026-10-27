INSERT INTO shop_items (code, name, universe_id, category, price, asset_url, z_index)
VALUES
  ('ki_hair_gold', 'Cabello Fase Dorada', 'ki_warriors', 'hair', 100, '/assets/shop/ki-hair-gold.svg', 40),
  ('ki_aura_blue', 'Aura de Energía Azul', 'ki_warriors', 'aura', 150, '/assets/shop/ki-aura-blue.svg', 10),
  ('ki_scouter_red', 'Visor de Nivel de Poder', 'ki_warriors', 'accessory', 80, '/assets/shop/ki-scouter-red.svg', 50),
  ('ki_gi_master', 'Traje del Gran Torneo', 'ki_warriors', 'outfit', 120, '/assets/shop/ki-gi-master.svg', 30),
  ('sl_jersey_bicolor', 'Camiseta Selección Histórica', 'super_league', 'outfit', 100, '/assets/shop/sl-jersey-bicolor.svg', 30),
  ('sl_boots_fire', 'Chimpunes de Fuego', 'super_league', 'accessory', 150, '/assets/shop/sl-boots-fire.svg', 50),
  ('sl_hair_lightning', 'Corte Rayo Dorado', 'super_league', 'hair', 80, '/assets/shop/sl-hair-lightning.svg', 40),
  ('sl_ball_galaxy', 'Balón Galáctico Flotante', 'super_league', 'pet', 120, '/assets/shop/sl-ball-galaxy.svg', 60),
  ('bb_armor_diamond', 'Armadura de Cristal', 'block_builders', 'outfit', 150, '/assets/shop/bb-armor-diamond.svg', 30),
  ('bb_pickaxe_laser', 'Pico de Plasma', 'block_builders', 'accessory', 100, '/assets/shop/bb-pickaxe-laser.svg', 50),
  ('bb_pet_slime', 'Cubo Mascota Saltarín', 'block_builders', 'pet', 80, '/assets/shop/bb-pet-slime.svg', 60),
  ('bb_aura_pixels', 'Lluvia de Píxeles', 'block_builders', 'aura', 120, '/assets/shop/bb-aura-pixels.svg', 10)
ON CONFLICT (code) DO NOTHING;
