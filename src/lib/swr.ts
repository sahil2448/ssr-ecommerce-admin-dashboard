import useSWR from "swr";
import { api } from "@/lib/http";

export function useApiSWR<T>(key: string | null, initialData?: T) {
  return useSWR<T>(key, (k) => api<T>(k), {
    revalidateOnFocus: true,
    keepPreviousData: true,
    fallbackData: initialData,
  });
}
