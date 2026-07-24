export const useDesign = () => {
  const getPrefixCls = (suffix?: string) => {
    const prefix = 'v'
    return suffix ? `${prefix}-${suffix}` : prefix
  }

  return {
    getPrefixCls
  }
}
