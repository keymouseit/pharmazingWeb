export const SET_USER_LOADING: string = "SET_USER_LOADING";
export const SET_USER: string = "SET_USER";
export const RESET_USER: string = "RESET_USER";
export const SET_TUTORIAL_SEEN: string = "SET_TUTORIAL_SEEN";
export const UPDATE_LAST_ACTIVITY: string = "UPDATE_LAST_ACTIVITY";
export const SET_IS_PHONE: string = "SET_IS_PHONE";
export const SET_AFFILIATE_CODE: string = "SET_AFFILIATE_CODE";
export const SET_SHOW_SEMESTER_MODAL: string = "SET_SHOW_SEMESTER_MODAL";
export const SET_SEMESTER: string = "SET_SEMESTER";
export const SET_OCCUPATION: string = "SET_OCCUPATION";
export const SET_COUNTRY: string = "SET_COUNTRY";
export const SET_PHONENUMBER: string = "SET_PHONENUMBER";
export const SET_INITIAL_PRICE_MARKETING: string =
  "SET_INITIAL_PRICE_MARKETING";

export type SetUserLoadingAction = {
  type: typeof SET_USER_LOADING;
  loading: boolean;
};

export type SetUserAction = {
  type: typeof SET_USER;
  admin: boolean;
  name: string;
  studies: string;
};

export type ResetUserAction = {
  type: typeof RESET_USER;
};

export type SetIsPhoneAction = {
  type: typeof SET_IS_PHONE;
  isPhone: boolean;
};

export type SetTutorialSeenAction = {
  type: typeof SET_TUTORIAL_SEEN;
  seen: boolean;
};

export type UpdateLastActivityAction = {
  type: typeof UPDATE_LAST_ACTIVITY;
};

export type SetInitialPriceMarketing = {
  type: typeof SET_INITIAL_PRICE_MARKETING;
  initialMarketingPrice: string;
};

export type SetShowSemesterModal = {
  type: typeof SET_SHOW_SEMESTER_MODAL;
  showSemesterModal: boolean;
};

export type SetPhonenumber = {
  type: typeof SET_PHONENUMBER;
  phonenumber: string;
};

export type SetCountry = {
  type: typeof SET_COUNTRY;
  country: string;
};

export type SetOccupation = {
  type: typeof SET_OCCUPATION;
  occupation: string;
};

export type SetSemester = {
  type: typeof SET_SEMESTER;
  semester: string;
};

export type SetAffiliateCode = {
  type: typeof SET_AFFILIATE_CODE;
  affiliateCode: string;
};

export const setInitialPriceMarketing = (
  initialMarketingPrice: string
): SetInitialPriceMarketing => {
  return {
    type: SET_INITIAL_PRICE_MARKETING,
    initialMarketingPrice,
  };
};

export const setShowSemesterModal = (
  showSemesterModal: boolean
): SetShowSemesterModal => {
  return { type: SET_SHOW_SEMESTER_MODAL, showSemesterModal };
};

export const setPhonenumber = (phonenumber: string): SetPhonenumber => {
  return { type: SET_PHONENUMBER, phonenumber: phonenumber };
};

export const setCountry = (country: string): SetCountry => {
  return { type: SET_COUNTRY, country };
};

export const setOccupation = (occupation: string): SetOccupation => {
  return { type: SET_OCCUPATION, occupation };
};

export const setSemester = (semester: string): SetSemester => {
  return { type: SET_SEMESTER, semester };
};

export const setAffiliateCode = (affiliateCode: string): SetAffiliateCode => {
  return { type: SET_AFFILIATE_CODE, affiliateCode };
};

export const setUserLoading = (loading: boolean): SetUserLoadingAction => ({
  type: SET_USER_LOADING,
  loading,
});

export const setUser = (
  admin: boolean,
  name: string,
  studies: string
): SetUserAction => ({
  type: SET_USER,
  admin,
  name,
  studies,
});

export const resetUser = (): ResetUserAction => ({
  type: RESET_USER,
});

export const setIsPhone = (isPhone: boolean): SetIsPhoneAction => ({
  type: SET_IS_PHONE,
  isPhone,
});

export const setTutorialSeen = (seen: boolean): SetTutorialSeenAction => ({
  type: SET_TUTORIAL_SEEN,
  seen,
});

export const updateLastActivity = (): UpdateLastActivityAction => ({
  type: UPDATE_LAST_ACTIVITY,
});
