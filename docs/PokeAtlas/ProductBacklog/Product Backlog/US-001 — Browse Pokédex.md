# US-001 — Browse Pokédex

Epic: Collection Tracking
Priority: P0
Status: Not started

**As a** trainer,  **I want to** browse the full Pokémon collection. **So that**
I can see what exists and track my progress.

## Acceptance Criteria

- Trainer can browse all Pokémon species.
- Pokémon appear in a scrollable collection.
- Missing Pokémon are visually distinguishable.
- Tracked Pokémon are visually distinguishable.

## Discovery

Bagi PokeAtlas, Species yang dilihat oleh user sebenarnya adalah `PokemonEntry`.
Dengan kata lain, user sebenernya melakukan tracking terhadap `PokemonEntry`.

Sebagai gambaran, daftar semua Pokemon species:

- Bulbasaur
- Dynamax Bulbasaur
- Ivysaur
- Dynamax Ivysaur
- Venusaur
- Dynamax Venusaur
- Gigantamax Venusaur
- Mega Venusaur

Bahkan:

- Meowth
- Persian
- Alolan Meowth
- Alolan Persian
- Galarian Meowth
- Perserker
- Rattata
- Raticate
- Alolan Raticate
- Alolan Raticate
- Wooper
- Quagsire
- Paldean Wooper
- Clodsire

Termasuk:

- Groudon
- Primal Groudon
- Kyogre
- Primal Kyogre
- Dialga
- Origin Dialga
- Palkia
- Origin Palkia
- Giratina Origin
- Giratina Altered
- Thundurus Incarnate
- Thundurus Therian
- Tornadus Incarnate
- Tornadus Therian
- Landorus Incarnate
- Landorus Therian
- Necrozma
- Necrozma - Dawn Wings
- Necrozma - Dusk Mane
- Zacian - Hero of Many Battles
- Zacian - Crowned Sword
- Zamazenta - Hero of Many Battles
- Zamazenta - Crowned Shield

Ini semua, secara data, berbeda "species"–tapi karena beberapa sebenarnya
adalah "variant" dari satu species yang sama, namun sistem harus membedakan,
maka istilah yang sistem pahami: `PokemonEntry`.

Tetapi, PokemonGO memiliki konsep menarik lain: Costume.

"Menampilkan semua species" (atau `PokemonEntry`) berarti juga menampilkan semua
costumes:

- Pikachu Kariyushi
- Pikachu Pop Star
- Pikachu Jeju
- dst

Maka, `PokemonEntry` ini sebenarnya memiliki intrinsic attribute: `form`.

Dynamax, Gigantamax, Mega, Primal, Origin, Altered, Incarnate, Therian, dll
adalah `form` by any means. Termasuk costume, merupakan `form`.

### Trackable States

Di lain sisi, `PokemonEntry` juga punya "another trackable traits" yang kita
sebut `TrackableState`.

Dalam hal ini, these entries:

- Necrozma
- Necrozma - Dawn Wings
- Necrozma - Dusk Mane
- Zacian - Hero of Many Battles
- Zacian - Crowned Sword

Bisa punya state yang ingin di-track misalnya:

- Shadow Necrozma
- Shadow Necrozma - Dawn Wings
- Shadow Necrozma - Dusk Mane
- Shadow Zacian - Hero of Many Battles
- Shadow Zacian - Crowned Sword

> Note: Ini hanya contoh, we know Shadow Zacian never exists :D

Selain Shadow, `TrackableState` lain meliputi:

- Purified
- Shiny
- Hundo
- Lucky
- Shiny Hundo
- Shiny Hundo Lucky
- Shadow Shiny
- Shadow Hundo
- Shadow Lucky
- Shadow Shiny Hundo
- Shadow Shiny Hundo Lucky
- dan lain-lain HAHA.

### Filters & Controls & Tracks

Jumlah `PokemonEntry` bisa mencapai ribuan. Untuk itu, mekanisme dasar normalnya:
**Filter By** "something". Kita tahu ada `Form`. Maka kandidat paling cocok
(sepertinya) **Filter By** `Form`.

Namun, fungsi filter sebenernya "mengubah daftar (atau `PokemonEntry`) secara
keseluruhan". Instead, `controls` adalah mekanisme "menampilkan" atau
"menyembunyikan" `PokemonEntry`.

Possible `controls`: **Show Forms**? Ini terlalu generik. Maka `Form` perlu
intrinsic attributes: `kind`. Sehingga, lebih masuk akal jika `controls`:

- Show Mega
- Show Alternate Forms
- Show Costumes
- Show Female Variants

Sementara `filters`:

- Show Shiny            # Tidak semua `PokemonEntry` memiliki shiny state
- Show Hundo            # Ini berlaku untuk semua pokemon
- dst

Artinya, ada `Filter` yang berlaku universal dan tidak. Maka perlu diluruskan.

`Filter` di sini bukan untuk "kepunyaan" (owned states). Tetapi lebih condong
ke "availability".

Sehingga, perlu mekanisme lain untuk "tampilkan" kepemilikan:

- Track Hundo
- Track XXL
- dll.
