import type { Directive } from 'vue'
import hljs from 'highlight.js'

/**
 * v-highlightjs 指令：替代 vue2 的 vue-highlightjs（仅支持 Vue2）
 * 用法：<pre v-highlightjs="codeString"><code class="java" /></pre>
 */
function render(el: HTMLElement, value: string) {
  const codeEl = el.querySelector('code')
  if (!codeEl) return
  codeEl.textContent = value ?? ''
  const lang = Array.from(codeEl.classList).find(c => c !== 'hljs')
  let highlighted: string
  try {
    highlighted = lang && hljs.getLanguage(lang)
      ? hljs.highlight(codeEl.textContent ?? '', { language: lang }).value
      : hljs.highlightAuto(codeEl.textContent ?? '').value
  } catch {
    highlighted = codeEl.textContent ?? ''
  }
  codeEl.innerHTML = highlighted
  codeEl.classList.add('hljs')
}

export const highlightjs: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    render(el, binding.value)
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      render(el, binding.value)
    }
  }
}
