import { ChainId } from "@certusone/wormhole-sdk";
import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataWrapper } from "src/store/helpers";
import { selectMarketsMap } from "src/store/selectors";
import {
  errorMarketsMap,
  fetchMarketsMap,
  receiveMarketsMap,
} from "src/store/tokenSlice";
import { FEATURED_MARKETS_JSON_URL } from "src/utils/bridgeUtils/consts";

export type MarketsMap = {
  markets?: {
    [index: string]: {
      name: string;
      link: string;
    };
  };
  tokens?: {
    [key in ChainId]?: {
      [index: string]: {
        symbol: string;
        logo: string;
      };
    };
  };
  tokenMarkets?: {
    [key in ChainId]?: {
      [key in ChainId]?: {
        [index: string]: {
          symbol: string;
          logo: string;
          markets: string[];
        };
      };
    };
  };
};

const useMarketsMap = (shouldFire: boolean): DataWrapper<MarketsMap> => {
  const marketsMap = useSelector(selectMarketsMap);
  const dispatch = useDispatch();
  const internalShouldFire =
    shouldFire &&
    (marketsMap.data === undefined ||
      (marketsMap.data === null && !marketsMap.isFetching));

  useEffect(() => {
    if (internalShouldFire) {
      getMarketsMap(dispatch);
    }
  }, [internalShouldFire, dispatch]);

  return marketsMap;
};

const getMarketsMap = (dispatch: Dispatch) => {
  dispatch(fetchMarketsMap());
  axios.get(FEATURED_MARKETS_JSON_URL).then(
    (response) => {
      dispatch(receiveMarketsMap(response.data as MarketsMap));
    },
    (error) => {
      dispatch(errorMarketsMap("Failed to retrieve the Terra Token List."));
    }
  );
};

export default useMarketsMap;
