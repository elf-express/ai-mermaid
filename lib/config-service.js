/**
 * @file config-service.js
 * @description 配置服務 - 管理應用程序配置、AI設置和認證
 * 
 * 主要功能：
 * 1. 管理AI API配置(URL、密鑰、模型名稱等)
 * 2. 提供配置存儲和讀取(同時支持本地存儲和環境變量)
 * 3. 處理密碼驗證和安全相關功能
 * 4. 提供統一的配置訪問接口
 * 
 * 配置優先級：本地存儲 > 環境變量 > 默認值
 */

// 獲取AI配置，優先使用localStorage中的配置，否則使用環境變量
export function getAIConfig() {
  if (typeof window === 'undefined') {
    // 服務端：使用環境變量
    return {
      apiUrl: process.env.AI_API_URL || '',
      apiKey: process.env.AI_API_KEY || '',
      modelName: process.env.AI_MODEL_NAME || ''
    };
  }

  // 客户端：優先使用localStorage中的配置
  try {
    const savedConfig = localStorage.getItem('aiConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      // 檢查配置是否完整
      if (config.apiUrl && config.apiKey && config.modelName) {
        return config;
      }
    }
  } catch (error) {
    console.error('Failed to load AI config from localStorage:', error);
  }

  // 如果沒有本地配置或配置不完整，使用環境變量
  return {
    apiUrl: process.env.NEXT_PUBLIC_AI_API_URL || '',
    apiKey: process.env.NEXT_PUBLIC_AI_API_KEY || '',
    modelName: process.env.NEXT_PUBLIC_AI_MODEL_NAME || 'gpt-3.5-turbo'
  };
}

// 檢查是否有有效的AI配置
export function hasValidAIConfig() {
  const config = getAIConfig();
  return !!(config.apiUrl && config.apiKey && config.modelName);
}

// 檢查用户是否有自定義AI配置（存儲在localStorage中）
export function hasCustomAIConfig() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const savedConfig = localStorage.getItem('aiConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      // 檢查配置是否完整
      return !!(config.apiUrl && config.apiKey && config.modelName);
    }
  } catch (error) {
    console.error('Failed to load AI config from localStorage:', error);
  }
  
  return false;
}

// 保存AI配置到localStorage
export function saveAIConfig(config) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aiConfig', JSON.stringify(config));
  }
}

// 清除本地AI配置
export function clearAIConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('aiConfig');
  }
}

// 密碼相關函數

// 驗證密碼（調用後端API）
export async function verifyPassword(password) {
  try {
    const response = await fetch('/api/verify-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Password verification failed:', error);
    return { success: false, error: '密碼驗證失敗' };
  }
}

// 保存密碼驗證狀態和密碼
export function savePasswordState(password) {
  if (typeof window !== 'undefined') {
    // 設置過期時間為當前時間 + 30分鐘（1800000毫秒）
    // 使用 sessionStorage 而非 localStorage，確保在頁面重載後失效
    const expiryTime = new Date().getTime() + 1800000;
    sessionStorage.setItem('passwordVerified', 'true');
    sessionStorage.setItem('passwordVerifiedExpiry', expiryTime.toString());
    localStorage.setItem('accessPassword', password); // 保留密碼以便快速重新登入
  }
}

// 獲取保存的密碼
export function getSavedPassword() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessPassword') || '';
  }
  return '';
}

// 檢查密碼是否已驗證
export function isPasswordVerified() {
  if (typeof window !== 'undefined') {
    const isVerified = sessionStorage.getItem('passwordVerified') === 'true';
    
    // 如果已驗證，檢查是否過期
    if (isVerified) {
      const expiryTime = parseInt(sessionStorage.getItem('passwordVerifiedExpiry') || '0', 10);
      const currentTime = new Date().getTime();
      
      // 如果已過期，清除驗證狀態並返回false
      if (currentTime > expiryTime) {
        clearPasswordState();
        return false;
      }
      
      return true;
    }
    
    return false;
  }
  return false;
}

// 清除密碼驗證狀態
export function clearPasswordState() {
  if (typeof window !== 'undefined') {
    // 清除 sessionStorage 中的驗證狀態
    sessionStorage.removeItem('passwordVerified');
    sessionStorage.removeItem('passwordVerifiedExpiry');
    
    // 同時清除 localStorage 中的舊驗證狀態（如果有）
    localStorage.removeItem('passwordVerified');
    localStorage.removeItem('passwordVerifiedExpiry');
    localStorage.removeItem('accessPassword');
  }
}

// 檢查用户是否享有無限量權限（密碼驗證通過或有自定義AI配置）
export function hasUnlimitedAccess() {
  return isPasswordVerified() || hasCustomAIConfig();
}