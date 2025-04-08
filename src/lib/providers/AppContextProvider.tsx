"use client";

import {
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useAccount, useChainId } from "wagmi";

import PreLoading from "@/components/PreLoading";

interface ContextData {
  sport: string;
  mybetsTab: 0 | 1 | 2;
  openDetailed: string[];
  sports: string[];
}

const initialData: ContextData = {
  sport: "Soccer",
  mybetsTab: 0,
  openDetailed: [],
  sports: [],
};

export const AppContext = createContext<{
  data: ContextData;
  setData: (data: Partial<ContextData>) => void;
  setDataT: (value: SetStateAction<ContextData>) => void;
}>({
  data: initialData,
  setData: () => {},
  setDataT: () => {},
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataT] = useState(initialData);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const chainId = useChainId();
  const account = useAccount();

  const setData = (d: Partial<ContextData>) =>
    setDataT((data) => ({ ...data, ...d }));

  useEffect(() => {
    if (data !== initialData) {
      localStorage.setItem("app-data", JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    const appDataJson = localStorage.getItem("app-data");
    // if (appDataJson) {
    //   const appData = JSON.parse(appDataJson) as ContextData;
    //   const { positions, favorites } = appData;
    //   setData({
    //     ...appData,
    //     positions: positions.filter(
    //       (p) => compareTime(p.market.maturityDate, Date()) === 1
    //     ),
    //     favorites: favorites.filter(
    //       (f) => compareTime(f.maturityDate, Date()) === 1
    //     ),
    //   });
    // }
  }, []);

  useEffect(() => {
    (async function init() {
      setLoading(true);
      try {
        if (!firstLoad) return;

        // const { sports } = await getLeagues(network);
        // const markets = await getMarkets(network, {
        //   ungroup: true,
        // });
        // setData({ sports, markets });
      } catch (_) {
        toast.error("Error occured!");
      }
    })();
  }, [firstLoad]);

  useEffect(() => {
    (function ChainIdChange() {
      if (!account.isConnected) {
        return;
      }

      setDataT((data) => ({
        ...data,
        network: chainId,
        positions: [],
        favorites: [],
      }));
      // if (networks.includes(chainId)) {
      // } else {
        // disconnect.disconnect();
        // setTimeout(() => {
        //   location.reload();
        // }, 2000);
        // toast("Optimism, Arbitrum and base are only available");
      // }
    })();
  }, [account.isConnected, chainId]);

  // if (firstLoad && loading)
  //   return (
  //     <PreLoading
  //       loading={firstLoad || loading}
  //       setLoading={setLoading}
  //       setFirstLoad={setFirstLoad}
  //     />
  //   );

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        setDataT,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
