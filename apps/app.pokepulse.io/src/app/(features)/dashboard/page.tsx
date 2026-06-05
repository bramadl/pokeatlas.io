"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import type { PokemonType } from "@pokepulse/core";
import Image from "next/image";
import { Fragment } from "react/jsx-runtime";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { POKEMON_THEME_MAP } from "../pokedex/pokemon/card/pokemon-card.theme";

function CompletionAchievements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Achievements</CardTitle>
        <CardDescription>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rerum, nihil.</CardDescription>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 shadow border border-amber-500 ring-2 ring-amber-500/25 bg-amber-50 size-8 text-center align-middle">🏆</div>
              <div>
                <div>Pokedex Completed</div>
                <p className="text-muted-foreground text-xs">Date: 23 February 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Kanto</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 shadow border border-amber-500 ring-2 ring-amber-500/25 bg-amber-50 size-8 text-center align-middle">🏆</div>
              <div>
                <div>Variant Completed</div>
                <p className="text-muted-foreground text-xs">Region: Kanto</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Costume</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 shadow border border-amber-500 ring-2 ring-amber-500/25 bg-amber-50 size-8 text-center align-middle">🏆</div>
              <div>
                <div>Signature Completed</div>
                <p className="text-muted-foreground text-xs">Scope: National</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Shadow</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 shadow border border-amber-500 ring-2 ring-amber-500/25 bg-amber-50 size-8 text-center align-middle">🏆</div>
              <div>
                <div>Variant Completed</div>
                <p className="text-muted-foreground text-xs">Region: Johto</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Temp. Evo</Badge>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function TrackingSpotlight() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking Spotlight</CardTitle>
        <CardDescription>Your latest rare acquisition.</CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="relative rounded-sm">
          <div
            className={cn(
              "absolute inset-0 bg-linear-30 from-25% via-background via-75% opacity-50",
              POKEMON_THEME_MAP.water.cardBg,
              POKEMON_THEME_MAP.water.cardBgOffset,
            )}
          />
          <CardContent className="relative z-1">
            <div className="flex items-center gap-4">
              <Avatar className="bg-slate-50" size="lg">
                <AvatarImage src={"https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm130.icon.png"} />
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-mono">#130</div>
                  <div className="text-muted-foreground text-[8px] opacity-50">
                    •
                  </div>
                  <div className="text-xs font-mono uppercase">Kanto</div>
                </div>
                <p className="font-semibold">Gyarados</p>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="relative z-1">
            <div className="text-xs font-mono rounded-full px-1">
              ✨ Shiny 🌑 Shadow
            </div>
          </CardFooter>
        </Card>
      </CardContent>
      <Separator />
      <CardFooter>
        <p className="text-muted-foreground text-xs">Activity logged</p>
        <small className="text-xs ml-auto text-muted-foreground">
          5/20/2026, 11:40:52 AM
        </small>
      </CardFooter>
    </Card>
  );
}

function CollectionInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection Insights</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum,
          pariatur!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="flex items-center justify-between">
          <dt className="flex items-center">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Most Complete Region
                </p>
                <span className="font-semibold tracking-wider">Kanto</span>
              </div>
            </div>
          </dt>
          <dd className="text-muted-foreground">
            <div className="text-right">
              <span className="text-xs text-muted-foreground font-mono">
                98%
              </span>
            </div>
          </dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between">
          <dt className="flex items-center">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Largest Collection
                </p>
                <span className="font-semibold tracking-wider">Lucky Dex</span>
              </div>
            </div>
          </dt>
          <dd className="text-muted-foreground">
            <div className="text-right">
              <span className="text-xs text-muted-foreground font-mono">
                522 entries
              </span>
            </div>
          </dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between">
          <dt className="flex items-center">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Closest Collection
                </p>
                <span className="font-semibold tracking-wider">
                  Temporary Evolutions
                </span>
              </div>
            </div>
          </dt>
          <dd className="text-muted-foreground">
            <div className="text-right">
              <span className="text-xs text-muted-foreground font-mono">
                4 remaining
              </span>
            </div>
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
}

function SignatureHighlights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signature Highlights</CardTitle>
        <CardDescription>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rerum,
          nihil.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="flex items-center justify-between">
          <dt className="flex items-center">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Most Common Signature
                </p>
                <p className="font-semibold tracking-wider">Shiny</p>
              </div>
            </div>
          </dt>
          <dd className="text-muted-foreground">
            <div className="text-right">
              <Badge>241 Pokémon</Badge>
            </div>
          </dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between">
          <dt className="flex items-center">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Rarest Signature
                </p>
                <p className="font-semibold tracking-wider">Shiny Hundo</p>
              </div>
            </div>
          </dt>
          <dd className="text-muted-foreground">
            <div className="text-right">
              <Badge>3 Pokémon</Badge>
            </div>
          </dd>
        </dl>
        <Separator />
        <dl className="flex items-center justify-between">
          <dt className="flex items-center">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Latest Rare Signature
                </p>
                <p className="font-semibold tracking-wider">Shadow Shiny</p>
              </div>
            </div>
          </dt>
          <dd className="text-muted-foreground">
            <div className="text-right">
              <Badge>Gyarados</Badge>
            </div>
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
}

function RegionalBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Breakdown</CardTitle>
        <CardDescription>Species completion by region.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {[
          ["Kanto", 148, 151],
          ["Johto", 97, 100],
          ["Hoenn", 113, 135],
          ["Sinnoh", 93, 107],
          ["Unova", 121, 156],
          ["Kalos", 58, 72],
          ["Alola", 74, 88],
          ["Galar", 71, 89],
          ["Hisui", 28, 30],
          ["Paldea", 91, 120],
        ].map(([region, current, total]) => (
          <Card className="rounded-sm" key={region}>
            <CardHeader>
              <CardTitle className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                {region}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                <Progress
                  className="h-1"
                  value={(Number(current) / Number(total)) * 100}
                />
                <div className="flex items-end justify-between gap-4 uppercase text-muted-foreground text-xs tracking-widest">
                  <FieldLabel className="text-xs">
                    {" "}
                    {current}/{total}
                  </FieldLabel>
                  <span>
                    {((Number(current) / Number(total)) * 100).toFixed(0)}%
                  </span>
                </div>
              </Field>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

const DAILY_TARGETS = [
  {
    dex: 25,
    name: "Pikachu Libre",
    signature: "BASE",
    sprite:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm25.fDOCTOR.icon.png",
    types: ["ELECTRIC"],
  },
  {
    dex: 483,
    name: "Aegislash (Blade)",
    signature: "BASE",
    sprite:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm483.fORIGIN.icon.png",
    types: ["GHOST"],
  },
  {
    dex: 681,
    name: "Origin Dialga",
    signature: "BASE",
    sprite:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm681.fBLADE.icon.png",
    types: ["DRAGON"],
  },
  {
    dex: 745,
    name: "Dusk Lycanroc",
    signature: "BASE",
    sprite:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm745.fDUSK.icon.png",
    types: ["ROCK"],
  },
  {
    dex: 376,
    name: "Metagross",
    signature: "SHINY+SHADOW",
    sprite:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm376.icon.png",
    types: ["STEEL"],
  },
  {
    dex: 574,
    name: "Gothita",
    signature: "BASE",
    sprite:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm574.icon.png",
    types: ["PSYCHIC"],
  },
  {
    dex: 888,
    name: "Zacian (Hero)",
    signature: "BASE",
    sprite:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm888.fHERO.icon.png",
    types: ["FAIRY"],
  },
  {
    dex: 890,
    name: "Eternatus (Eternamax)",
    signature: "SHINY+SHADOW",
    sprite:
      "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm890.fETERNAMAX.icon.png",
    types: ["DRAGON"],
  },
];

function CatchOfTheDay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Catch of the Day</CardTitle>
        <CardDescription>Missing entries worth chasing today.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {DAILY_TARGETS.map((target) => (
          <Tooltip key={target.name}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "relative flex items-center justify-center p-4 aspect-square rounded-full border shadow",
                  "bg-linear-60 from-1% via-background via-50% grayscale-75 opacity-50 hover:opacity-100 transition-all",
                  POKEMON_THEME_MAP[
                    (target.types[0] as string).toLowerCase() as PokemonType
                  ].cardBg,
                  POKEMON_THEME_MAP[
                    (target.types[0] as string).toLowerCase() as PokemonType
                  ].cardBgOffset,
                )}
              >
                <button aria-label="Tap to Track" className="absolute inset-0 z-1" type="button" />
                <div
                  className={cn(
                    "relative p-4 sm:p-6 lg:p-4 rounded-full border shadow bg-slate-100",
                    "bg-linear-30 from-1% via-background via-50%",
                    POKEMON_THEME_MAP[
                      (target.types[0] as string).toLowerCase() as PokemonType
                    ].cardBg,
                    POKEMON_THEME_MAP[
                      (target.types[0] as string).toLowerCase() as PokemonType
                    ].cardBgOffset,
                    POKEMON_THEME_MAP[
                      (target.types[0] as string).toLowerCase() as PokemonType
                    ].badgeBorder,
                  )}
                >
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                    <div className="px-1 py-px text-[10px] rounded-full bg-slate-50 text-slate-500 border border-slate-500/50 shadow drop-shadow-2xl">
                      #{Intl.NumberFormat().format(target.dex)}
                    </div>
                  </div>
                  <Image
                    alt={target.name}
                    className=""
                    height={128}
                    priority
                    src={target.sprite}
                    width={128}
                  />
                  <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                    <div className="aspect-square size-4 text-xs p-px text-center align-middle rounded-full shadow drop-shadow-2xl bg-background">
                      ✨
                    </div>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>{target.name}</TooltipContent>
          </Tooltip>
        ))}
      </CardContent>
    </Card>
  );
}

const VARIANT_COLLECTIONS = [
  {
    current: 190,
    label: "Alternate Forms",
    total: 243,
  },
  {
    current: 78,
    label: "Costume Variants",
    total: 332,
  },
  {
    current: 51,
    label: "Female Variants",
    total: 104,
  },
  {
    current: 32,
    label: "Temporary Evolutions",
    total: 50,
  },
];

function VariantCollections() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Variant Collections</CardTitle>
        <CardDescription>Progress beyond species completion.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {VARIANT_COLLECTIONS.map((variant, index) => (
          <Fragment key={variant.label}>
            {index !== 0 && <Separator />}
            <dl className="flex items-center justify-between">
              <dt className="flex items-center">
                <p>
                  {variant.label}
                </p>
              </dt>
              <dd className="flex items-center gap-4">
                <Progress
                  className="w-12 lg:w-24 h-1"
                  value={(variant.current / variant.total) * 100}
                />
                <p className="min-w-16 text-right text-xs text-muted-foreground font-semibold tracking-wider">
                  {variant.current} / {variant.total}
                </p>
              </dd>
            </dl>
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

const TRACKING_COLLECTIONS = [
  {
    current: 312,
    icon: "✨",
    label: "Shiny Dex",
    total: 1025,
  },
  {
    current: 44,
    icon: "🌑",
    label: "Shadow Dex",
    total: 1025,
  },
  {
    current: 87,
    icon: "💫",
    label: "Purified Dex",
    total: 1025,
  },
  {
    current: 522,
    icon: "🍀",
    label: "Lucky Dex",
    total: 1025,
  },
  {
    current: 157,
    icon: "💯",
    label: "Hundo Dex",
    total: 1025,
  },
  {
    current: 4,
    icon: "�",
    label: "Nundo Dex",
    total: 1025,
  },
];

function TrackingCollections() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking Collections</CardTitle>
        <CardDescription>
          Collection progress across tracking states.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {TRACKING_COLLECTIONS.map((collection) => {
          const percent = (collection.current / collection.total) * 100;
          return (
            <Card key={collection.label}>
              <CardHeader>
                <CardTitle className="text-sm">
                  {collection.icon} {collection.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {collection.current}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of {collection.total}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {percent.toFixed(1)}%
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Progress className="h-1" value={percent} />
              </CardFooter>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}

function SpeciesCompletionHero() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Species Completion</CardTitle>
        <CardDescription>Your overall National Dex progress.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-16">
        <div className="flex items-end gap-3 shrink-0">
          <div className="text-6xl font-bold">847</div>
          <div className="mb-1 text-muted-foreground">of 1,025 species</div>
        </div>
        <div className="flex-1 mb-2">
          <Field>
            <div className="flex items-end justify-between gap-4 text-muted-foreground text-xs">
              <FieldLabel className="text-muted-foreground text-xs font-normal">Completion</FieldLabel>
              <span>82.6%</span>
            </div>
            <Progress className="h-2" value={82.6} />
          </Field>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <div className="w-full flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Tracked</div>
            <div className="font-semibold">986 Species</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Missing</div>
            <div className="font-semibold">178 Species</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">
              Most Complete Region
            </div>
            <div className="font-semibold">Kanto · 98%</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function TrainerCard() {
  return (
    <Card className="bg-linear-to-br from-background to-primary/5 border-primary/10 justify-between">
      <CardContent className="flex items-start gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Avatar className="ring ring-primary-foreground" size="default">
            <AvatarImage alt="Ash Ketchum" src="/pp.jpeg" />
          </Avatar>
          <div className="flex flex-col gap-0">
            <span className="font-bold text-sm">Ash Ketchum</span>
            <span className="text-xs text-muted-foreground">
              ash@pokemon.com
            </span>
          </div>
        </div>
        <Badge className="text-xs">Team Valor</Badge>
      </CardContent>
      <Separator />
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>
          Pick up where you left off, you are <strong>87%</strong> away from
          total completion! Keep it going, Trainer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-x-2">
        <Button>View Pokédex</Button>
        <Button className="hover:bg-primary/5" variant="ghost">
          Open User Guides
          <ArrowRightIcon />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <Container
      className="relative min-h-160 sm:my-8 flex flex-col gap-4 py-4 sm:py-0 md:px-4"
      padded
    >
      <div className="grid lg:grid-cols-[400px_1fr] gap-4">
        <TrainerCard />
        <SpeciesCompletionHero />
      </div>
      <CatchOfTheDay />

      <div className="grid lg:grid-cols-[1fr_360px] gap-4">
        <div className="flex flex-col gap-4">
          <TrackingCollections />
          <VariantCollections />
          <CompletionAchievements />
        </div>
        <div className="flex flex-col gap-4">
          <RegionalBreakdown />
          <TrackingSpotlight />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <SignatureHighlights />
        <CollectionInsights />
      </div>
    </Container>
  );
}
