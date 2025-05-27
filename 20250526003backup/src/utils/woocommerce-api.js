/**
 * 安全的 WooCommerce REST API 客户端
 * 使用最新的 axios 版本，避免安全漏洞
 */
import axios from 'axios';
import crypto from 'crypto';

class WooCommerceAPI {
    constructor(options) {
        this.url = options.url;
        this.consumerKey = options.consumerKey;
        this.consumerSecret = options.consumerSecret;
        this.version = options.version || 'wc/v3';
        this.timeout = options.timeout || 30000;
        
        // 创建安全的 axios 实例
        this.client = axios.create({
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'WooCommerce-Next.js-Client/1.0.0'
            },
            // 安全配置
            maxRedirects: 5,
            validateStatus: (status) => status < 500, // 只有 5xx 错误才抛出异常
        });
        
        // 请求拦截器 - 添加认证
        this.client.interceptors.request.use((config) => {
            config.auth = {
                username: this.consumerKey,
                password: this.consumerSecret
            };
            return config;
        });
        
        // 响应拦截器 - 错误处理
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    // 服务器响应了错误状态码
                    const errorMessage = error.response.data?.message || error.message;
                    throw new Error(`WooCommerce API Error: ${errorMessage}`);
                } else if (error.request) {
                    // 请求发出但没有收到响应
                    throw new Error('WooCommerce API: No response received');
                } else {
                    // 其他错误
                    throw new Error(`WooCommerce API: ${error.message}`);
                }
            }
        );
    }
    
    /**
     * 构建 API URL
     */
    buildUrl(endpoint) {
        const baseUrl = this.url.replace(/\/$/, ''); // 移除末尾斜杠
        return `${baseUrl}/wp-json/${this.version}/${endpoint}`;
    }
    
    /**
     * GET 请求
     */
    async get(endpoint, params = {}) {
        try {
            const response = await this.client.get(this.buildUrl(endpoint), {
                params: params
            });
            return response;
        } catch (error) {
            console.error('WooCommerce GET Error:', error.message);
            throw error;
        }
    }
    
    /**
     * POST 请求
     */
    async post(endpoint, data = {}) {
        try {
            const response = await this.client.post(this.buildUrl(endpoint), data);
            return response;
        } catch (error) {
            console.error('WooCommerce POST Error:', error.message);
            throw error;
        }
    }
    
    /**
     * PUT 请求
     */
    async put(endpoint, data = {}) {
        try {
            const response = await this.client.put(this.buildUrl(endpoint), data);
            return response;
        } catch (error) {
            console.error('WooCommerce PUT Error:', error.message);
            throw error;
        }
    }
    
    /**
     * DELETE 请求
     */
    async delete(endpoint, params = {}) {
        try {
            const response = await this.client.delete(this.buildUrl(endpoint), {
                params: params
            });
            return response;
        } catch (error) {
            console.error('WooCommerce DELETE Error:', error.message);
            throw error;
        }
    }
}

export default WooCommerceAPI; 