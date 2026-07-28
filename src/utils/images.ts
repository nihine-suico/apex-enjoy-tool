// public/images 配下の画像パスを解決する
// base設定（'./'）に追従するよう BASE_URL を使う

export function legendImage(id: string): string {
  return `${import.meta.env.BASE_URL}images/legends/${id}.png`
}

export function weaponImage(id: string): string {
  return `${import.meta.env.BASE_URL}images/weapons/${id}.png`
}
