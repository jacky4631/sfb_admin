/**
 * 首页统计卡的环比计算工具
 */

/**
 * 计算环比涨跌幅，返回百分数（如 12.5 表示 +12.5%）
 *
 * 以下两种情况返回 null，交给界面显示占位符：
 * 1. 基期为 0：比率无意义（首页常见今日 0、昨日也是 0）；
 * 2. 基期为负：百分数会丢失方向语义，例如净收入从 -1 元变到 0 元，
 *    按公式算出 +100% 会把「扭亏」显示成红色上涨，属于误导。
 *
 * @param {number|string} current 本期值
 * @param {number|string} base 基期值
 * @returns {number|null}
 */
export function trendPercent(current, base) {
  const cur = Number(current)
  const pre = Number(base)
  if (!Number.isFinite(cur) || !Number.isFinite(pre) || pre <= 0) {
    return null
  }
  return ((cur - pre) / pre) * 100
}

/**
 * 涨跌文案：保留一位小数，正数补 + 号
 * @param {number|null} percent
 * @returns {string}
 */
export function formatTrend(percent) {
  if (percent === null || percent === undefined || !Number.isFinite(percent)) {
    return ''
  }
  const fixed = percent.toFixed(1)
  return percent > 0 ? `+${fixed}%` : `${fixed}%`
}

/**
 * 金额展示：千分位 + 固定小数位
 * @param {number|string} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatAmount(value, decimals = 2) {
  const num = Number(value)
  if (!Number.isFinite(num)) {
    return '0'
  }
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * 整数展示：千分位
 * @param {number|string} value
 * @returns {string}
 */
export function formatInteger(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) {
    return '0'
  }
  return Math.round(num).toLocaleString('zh-CN')
}
