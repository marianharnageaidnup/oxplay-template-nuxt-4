export interface MetaPage {
  title: string;
  description?: string;
  keywords?: string;
}

export interface MetaConfig {
  name: string;
  license: string | null;
  trademark: string;
  maintenance: boolean;
  main: {
    title: string;
  };
  pages: {
    [key: string]: MetaPage;
  };
}

export interface MetaTag {
  name: string;
  property: string;
  content: string;
}

export interface PageContent {
  url: string;
  title: string;
  header: number;
  order: number;
  section: string | null;
  lang: string;
  content: string;
}

export interface SocialConfig {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  wechat?: string[];
  line?: string[];
  telegram?: string[];
  skype?: string[];
  viber?: string[];
  whatsapp?: string[];
  webmaster_tools?: string;
  tiktok_pixel?: string;
  instagram_threads?: string;
  promo_line_en?: string;
  promo_line_id?: string;
  welcome_message_en?: string;
  welcome_message_id?: string;
  google_analytics?: string;
  livechat_type?: string;
  chat_chaport_code?: string | null;
  chat_live_chat_code?: string | null;
  google_tag_manager?: string[];
  facebook_pixel?: string[];
  amp_script?: string;
  livechat?: string | null;
  fb_pixel_1?: string;
  fb_pixel_2?: string;
  [key: string]: any;
}

export interface PaymentMethod {
  id?: number;
  name: string;
  payment_code: string;
  category?: string;
  images?: string;
}

export interface ActiveBanks {
  bank_transfer?: PaymentMethod[];
  virtual_account?: PaymentMethod[];
  'e-money'?: PaymentMethod[];
  cellular_balance?: PaymentMethod[];
  custom?: PaymentMethod[];
  [key: string]: PaymentMethod[] | undefined;
}

export interface NotificationCTA {
  label: string;
  link: string;
  is_external: number;
}

export interface Notification {
  title: string;
  content: string;
  cta?: NotificationCTA;
  banner?: string;
}

export interface Notifications {
  notification_before_login?: Notification;
  [key: string]: Notification | undefined;
}

export interface ConfigData {
  status: boolean;
  menu: any[];
  poker: number;
  meta: MetaConfig;
  tags: MetaTag[];
  pages: PageContent[];
  social: SocialConfig;
  methods?: string[];
  activeBanks?: ActiveBanks;
  payment_type?: string;
  notifications?: Notifications;
  [key: string]: any;
}

export interface ConfigState {
  init: boolean;
  data: ConfigData | null;
}