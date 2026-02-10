// src/lib/constants.ts

// 定義區域與其包含的國家代碼
export const REGION_CONFIG: Record<string, string[]> = {
    VSA: ["us"], // 美洲
    VSE: ["be-fr", "cz", "de", "es", "eu", "fr", "hu", "it", "nl", "pl", "ro", "ru", "tr", "ua", "uk"], // 歐洲
    VSI: ["ap", "au", "bd", "id", "in", "jp", "kr", "me", "my", "ph", "pk", "sg", "th", "tw", "vn", "za"], // 亞太
    // 可以在這裡繼續加 VS China 等等...
};

// 產生所有國家的扁平陣列 (用來做「全部隱藏」功能)
export const ALL_COUNTRIES = Object.values(REGION_CONFIG).flat();