export const imgError = {
  inserted: (el, { value }) => {
    if (!el.src) {
      el.src = value
    } else {
      el.onerror = () => {
        el.src = value
      }
    }
  },
  update(el, { value }) {
    if (!el.src) {
      el.src = value
    }
  }
}
