/**
 * 安全的 Stripe Checkout Session 创建端点
 * 替代有漏洞的 next-stripe 包
 */
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // 使用最新的 API 版本
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            success_url,
            cancel_url,
            customer_email,
            line_items,
            metadata,
            payment_method_types = ['card'],
            mode = 'payment'
        } = req.body;

        // 验证必需的参数
        if (!success_url || !cancel_url || !line_items || !Array.isArray(line_items)) {
            return res.status(400).json({ 
                error: 'Missing required parameters: success_url, cancel_url, line_items' 
            });
        }

        // 格式化 line_items 为 Stripe 格式
        const formattedLineItems = line_items.map(item => ({
            price_data: {
                currency: item.currency || 'usd',
                product_data: {
                    name: item.name,
                    images: item.images || [],
                },
                unit_amount: item.amount, // 金额应该已经是分为单位
            },
            quantity: item.quantity,
        }));

        // 创建 checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types,
            line_items: formattedLineItems,
            mode,
            success_url,
            cancel_url,
            customer_email,
            metadata: metadata || {},
            // 安全配置
            billing_address_collection: 'auto',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU'], // 根据需要调整
            },
        });

        res.status(200).json({ 
            id: session.id,
            url: session.url 
        });

    } catch (error) {
        console.error('Stripe checkout session creation error:', error);
        
        // 不要暴露敏感的错误信息
        const errorMessage = error.type === 'StripeCardError' 
            ? error.message 
            : 'An error occurred while creating the checkout session';
            
        res.status(500).json({ 
            error: errorMessage 
        });
    }
} 