export interface KakaoAuth {
  id: number;
  connected_at: Date;
  properties: {
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_image_needs_agreement: boolean;
    profile: {
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email?: string;
    has_age_range: boolean;
    age_range_needs_agreement: boolean;
    age_range?: string;
    has_gender: boolean;
    gender_needs_agreement: boolean;
    gender?: string;
  };
}
