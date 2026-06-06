import type { UID } from "@pokepulse/toolkit";

export type TrainerRef = UID;
export type TrainerID = UID;

export const trainerId = () => "00000000-0000-0000-0000-000000000001";

export const guestSignature = () => "00000000-0000-0000-0000-000000000000";
export const isGuest = (trainerId: string) => trainerId === guestSignature();
