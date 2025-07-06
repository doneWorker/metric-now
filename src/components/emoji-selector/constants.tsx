import { ReactNode } from "react";
import {
  Bicycle,
  CarFront,
  CupStraw,
  EmojiSmile,
  Flag,
  Laptop,
  MusicNote,
  PersonWalking,
  Tree,
} from "react-bootstrap-icons";

export const groupToIcon: Record<string, ReactNode> = {
  "Smileys & Emotion": <EmojiSmile />,
  "People & Body": <PersonWalking />,
  "Animals & Nature": <Tree />,
  "Food & Drink": <CupStraw />,
  "Travel & Places": <CarFront />,
  Activities: <Bicycle />,
  Objects: <Laptop />,
  Symbols: <MusicNote />,
  Flags: <Flag />,
};
