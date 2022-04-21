import fetcher from 'src/utils/fetcher'
import useSWR from 'swr'

function useFetch(url: string) {
  const { data, error } = useSWR(url, fetcher)

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default useFetch
