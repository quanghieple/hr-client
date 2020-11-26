import { GeographicType } from "@/data/share";

export interface CurrentUser {
    displayName?: string;
    photoURL?: string;
    uid: string;
    email?: string;
    title?: string;
    country?: string;
    geographic?: GeographicType;
    address?: string;
    phoneNumber?: string;
    disabled?: string;
    role?: string;
    parent?: string;
    // notifyCount?: number;
    // unreadCount?: number;
    // group?: string;
  }

  export interface TimeCheck {
    in?: number;
    out?: number;
    type?: string;
  }

  export interface LocationCheckIn {
    radius: number;
    name: string;
    coord: Coord;
  }