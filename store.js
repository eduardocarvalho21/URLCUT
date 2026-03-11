// store.js — armazenamento em memória
export const urls = new Map()    // slug -> { id, slug, original, createdAt }
export const clicks = new Map()  // id   -> [{ device, browser, referer, clickedAt }]
