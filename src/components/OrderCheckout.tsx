import { useState } from 'react';
import { Upload, X, AlertCircle, FileCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { api } from '../utils/api';

interface CartItem {
  merchandise: {
    _id: string;
    name: string;
    price: number;
  };
  size: string;
  quantity: number;
}

interface OrderCheckoutProps {
  cart: CartItem[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function OrderCheckout({ cart, onSuccess, onCancel }: OrderCheckoutProps) {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.merchandise.price * item.quantity), 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload JPG, PNG, WebP, or PDF');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Maximum size is 5MB');
        return;
      }
      
      setReceiptFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receiptFile) {
      setError('Please upload a payment receipt');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      formData.append('items', JSON.stringify(cart.map(item => ({
        merchandiseId: item.merchandise._id,
        size: item.size,
        quantity: item.quantity
      }))));

      const response = await api.orders.createWithFile(formData);

      if (response.success) {
        alert('Order placed successfully! We will verify your payment and confirm your order.');
        onSuccess();
      } else {
        setError(response.error || 'Failed to create order');
      }
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Checkout</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-blue-900">Order Summary</h3>
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">{item.merchandise.name}</div>
                    <div className="text-sm text-gray-600">
                      Size: {item.size} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-blue-900">
                    LKR {(item.merchandise.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-3 text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-2xl text-blue-900">LKR {getTotalAmount().toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="p-4 bg-blue-50 rounded-lg space-y-2">
              <h4 className="font-semibold text-blue-900">Payment Instructions:</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Transfer the total amount to: <strong>Bank Account: XXXX-XXXX-XXXX</strong></li>
                <li>Take a screenshot or photo of the payment receipt</li>
                <li>Upload the receipt using the file picker below</li>
                <li>Submit your order</li>
              </ol>
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
              <Label htmlFor="receipt" className="text-base">
                Payment Receipt <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                  <label htmlFor="receipt" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Upload className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-sm">
                        {receiptFile ? (
                          <div className="flex items-center gap-2 text-green-700">
                            <FileCheck className="h-5 w-5" />
                            <span className="font-medium">{receiptFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <span className="font-medium text-blue-600">Click to upload</span>
                            <span className="text-gray-600"> or drag and drop</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, WebP or PDF (max. 5MB)
                      </p>
                    </div>
                  </label>
                </div>
                {receiptFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReceiptFile(null)}
                    className="w-full"
                  >
                    Remove file
                  </Button>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>

            <div className="text-xs text-gray-600 text-center">
              By placing this order, you agree to collect the merchandise during choir practice sessions.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
