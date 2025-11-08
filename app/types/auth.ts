/**
 * Authentication Types and Interfaces
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegistrationPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  captcha: string;
  currency: string;
  phone: string;
  referral_code: string;
  captcha_type: string;
  captcha_key: string;
}

export interface UserValidations {
  email: { r: number; s: number };
  phone: { r: number; s: number };
  detail: { r: number; s: number };
  document: { r: number; s: number };
}

export interface UserDetail {
  id: number;
  user_id: number;
  gender: string | null;
  phone: string;
  birthday: string | null;
  country: string;
  city: string;
  address: string | null;
  zipcode: string | null;
  identification_number: string | null;
  secret_question: string | null;
  notification: string;
  ftd_trx_id: number;
  ftd_trx_date: string;
  notifications: number;
  validations: UserValidations;
  payment_group_id: number | null;
  register_device_type: number;
  referral_group: number;
  referral_enabled: number;
  apk_login: number;
  created_at: string;
  updated_at: string;
  account_name: string;
  account_number: string;
  bank_id: string;
  crypto_token: string | null;
  crypto_address: string | null;
  kyc_enabled: number;
  withdraw_method: string;
  bank_name: string;
}

export interface UserGroup {
  group_id: number;
  name: string;
  comment: string;
  can_access: number;
  can_payin: number;
  can_payout: number;
  daily_payout_limit: string;
  real_payout_coefficient: number;
  discount_expire_time: number;
  discount_payout_coefficient: number;
  discount_chargeback_coefficient: number;
  discount_payin_coefficient: number;
}

export interface UserLimit {
  prematch_active: number;
  live_active: number;
  virtual_active: number;
  poker_active: number;
  casino_active: number;
  slot_active: number;
  bingo_active: number;
  sportsbook_active: number;
  fishing_active: number;
  lotto_active: number;
  arcade_active: number;
  other_limits: any | null;
  live_limit: any[];
  prematch_limit: any[];
  virtual_limit: any[];
}

export interface User {
  user_id: number;
  group_id: number;
  user_bonus_id: number | null;
  bonus_id: number;
  imported_user_id: number | null;
  global_ban: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  referral_code: string;
  referral_id: number | null;
  streaming: boolean;
  streaming_ips: string | null;
  currency: string;
  cash: string;
  bonus: string;
  category_deposit: string;
  custom_amount: string | null;
  use_last_amount: number;
  playing_poker: number;
  session_id: string;
  token_id: string;
  last_login_at: string;
  google2fa_enabled: number;
  google2fa_option: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  unread_messages: number;
  has_promowins: boolean;
  kyc_status: number;
  quick_amounts: string[];
  full_name: string;
  balance: string;
  user_reserve: string;
  bonus_type: any[];
  egt_enabled: boolean;
  passkeys: any[];
  detail: UserDetail;
  group: UserGroup;
  limit: UserLimit;
  active_bonus: any | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface AuthServiceResponse {
  success: boolean;
  message: string;
  data?: AuthResponse;
  errors?: Record<string, string[]>;
}

export interface UserServiceResponse {
  success: boolean;
  message: string;
  data?: User;
  errors?: Record<string, string[]>;
}

export interface Session {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
