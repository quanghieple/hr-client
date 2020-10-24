import { GeographicType } from "@/data/share";

export interface CurrentUser {
    displayName?: string;
    photoURL?: string;
    uid?: string;
    email?: string;
    title?: string;
    country?: string;
    geographic?: GeographicType;
    address?: string;
    phoneNumber?: string;
    disabled?: string;
    // notifyCount?: number;
    // unreadCount?: number;
    // group?: string;
  }