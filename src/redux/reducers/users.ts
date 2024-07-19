"use client";

import {
  SET_USER_LOADING,
  SET_USER,
  RESET_USER,
  SET_TUTORIAL_SEEN,
  UPDATE_LAST_ACTIVITY,
  SET_IS_PHONE,
  SET_AFFILIATE_CODE,
  SET_INITIAL_PRICE_MARKETING,
  SET_PHONENUMBER,
  SET_COUNTRY,
  SET_OCCUPATION,
  SET_SEMESTER,
  SET_SHOW_SEMESTER_MODAL,
} from "@/redux/actions/users";
import { getState, saveState, deleteState } from "@/util";

export type SetUserAction = {
  admin: boolean;
  name: string;
  studies: string;
};

export type SetIsLoadingAction = {
  loading: boolean;
};

export type SetIsPhoneAction = {
  isPhone: boolean;
};

export type SetTutorialSeenAction = {
  seen: boolean;
};

type UserState = {
  loading: boolean;
  isPhone: boolean;
  user: {
    loggedIn: boolean;
    admin: boolean;
    name: string;
    studies: string;
  };
  tutorialSeen: boolean;
  lastActivity: number;
  affiliateCode: string;
  showSemesterModal: boolean;
  semester: string;
  occupation: string;
  country: "DE" | "EN";
  phonenumber: string;
  initialMarketingPrice: number;
};

const initialState: UserState = ({
  ...getState("user"),
  loading: true,
  tutorialSeen: true,
} as UserState) || {
  loading: true,
  isPhone: false,
  user: {
    loggedIn: false,
    admin: false,
    name: "",
    studies: "OTHER",
  },
  tutorialSeen: true,
  lastActivity: Date.now(),
  affiliateCode: "",
  showSemesterModal: false,
  semester: "",
  occupation: "",
  country: "DE",
  phonenumber: "",
  initialMarketingPrice: 5,
};

const usersReducer = (
  state: UserState = initialState,
  action: any
): UserState => {
  switch (action.type) {
    case SET_USER_LOADING:
      const setIsLoadingAction = action as SetIsLoadingAction;
      saveState("user", { ...state, isPhone: setIsLoadingAction.loading });
      return {
        ...state,
        loading: setIsLoadingAction.loading,
      };
    case SET_USER:
      const setUserAction = action as SetUserAction;
      saveState("user", {
        ...state,
        user: {
          loggedIn: true,
          admin: setUserAction.admin,
          name: setUserAction.name,
          studies: setUserAction.studies,
        },
      });
      return {
        ...state,
        user: {
          loggedIn: true,
          admin: setUserAction.admin,
          name: setUserAction.name,
          studies: setUserAction.studies,
        },
      };
    case SET_AFFILIATE_CODE:
      saveState("user", { ...state, affiliateCode: action.affiliateCode });
      return {
        ...state,
        affiliateCode: action.affiliateCode,
      };
    case SET_INITIAL_PRICE_MARKETING:
      saveState("user", {
        ...state,
        initialMarketingPrice: action.initialMarketingPrice,
      });
      return {
        ...state,
        initialMarketingPrice: action.initialMarketingPrice,
      };
    case SET_PHONENUMBER:
      saveState("user", { ...state, phonenumber: action.phonenumber });
      return {
        ...state,
        phonenumber: action.phonenumber,
      };
    case SET_COUNTRY:
      saveState("user", { ...state, country: action.country });
      return {
        ...state,
        country: action.country,
      };
    case SET_OCCUPATION:
      saveState("user", { ...state, occupation: action.occupation });
      return {
        ...state,
        occupation: action.occupation,
      };
    case SET_SEMESTER:
      saveState("user", { ...state, semester: action.semester });
      return {
        ...state,
        semester: action.semester,
      };
    case SET_IS_PHONE:
      saveState("user", { ...state, isPhone: action.isPhone });
      return {
        ...state,
        isPhone: action.isPhone,
      };
    case SET_SHOW_SEMESTER_MODAL:
      saveState("user", {
        ...state,
        showSemesterModal: action.showSemesterModal,
      });
      return {
        ...state,
        showSemesterModal: action.showSemesterModal,
      };
    case SET_TUTORIAL_SEEN:
      const setTutorialSeenAction = action as SetTutorialSeenAction;
      saveState("user", { ...state, tutorialSeen: setTutorialSeenAction.seen });
      return {
        ...state,
        tutorialSeen: setTutorialSeenAction.seen,
      };
    case UPDATE_LAST_ACTIVITY:
      saveState("user", { ...state, lastActivity: Date.now() });
      return {
        ...state,
        lastActivity: Date.now(),
      };
    case RESET_USER:
      deleteState("user");
      return {
        ...state,
        user: {
          loggedIn: false,
          admin: false,
          name: "",
          studies: "OTHER",
        },
        tutorialSeen: false,
      };
    default:
      return state;
  }
};

export default usersReducer;
