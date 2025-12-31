"use client";
import React, { useEffect, useState } from "react";

function useFetch<T = any>(url: string): [T | null] {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url);
        const datag = await res.json();
        setData(datag);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [url]);

  return [data];
}

export default useFetch;
