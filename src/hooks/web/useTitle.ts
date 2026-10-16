export const useTitle = (title: string) => {
  const setTitle = (t: string) => {
    document.title = `${t} - mshop admin`
  }
  setTitle(title)
  return {
    setTitle
  }
}
