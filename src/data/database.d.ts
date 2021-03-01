import { GeographicType } from "@/data/share";

export interface CurrentUser {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    roles?: any[];
    created?: Date;

    title?: string;
    country?: string;
    geographic?: GeographicType;
    address?: string;
    disabled?: string;
    parent?: string;
    photoURL?: string;
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
