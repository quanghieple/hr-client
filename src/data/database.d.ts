import { GeographicType } from "@/data/share";

export interface User {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
    roles?: any[];
    created?: Date;
    birth?: Date;

    address?: string;
    disabled?: string;
    parent?: number;
    photoURL?: string;
    profile?: string;
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
