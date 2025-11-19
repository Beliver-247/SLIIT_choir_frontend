import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { api } from '../utils/api';
import { hasRole } from '../utils/roleUtils';

interface Merchandise {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  sizes: string[];
  stock: number;
  category: 'tshirt' | 'band' | 'hoodie';
  status: 'available' | 'unavailable' | 'discontinued';
}

interface CartItem {
  merchandise: Merchandise;
  size: string;
  quantity: number;
}

interface MerchandiseCatalogProps {
  onOrderNow?: (cart: CartItem[]) => void;
  onManageClick?: () => void;
}

export default function MerchandiseCatalog({ onOrderNow, onManageClick }: MerchandiseCatalogProps) {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const isAdmin = hasRole(['admin', 'moderator']);

  useEffect(() => {
    fetchMerchandise();
  }, []);

  const fetchMerchandise = async () => {
    try {
      setLoading(true);
      const response = await api.merchandise.getAll({ status: 'available' });
      
      if (response.success && response.data) {
        setMerchandise(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch merchandise:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'tshirt': return 'T-Shirt';
      case 'band': return 'Band';
      case 'hoodie': return 'Hoodie';
      default: return category;
    }
  };

  const addToCart = (item: Merchandise) => {
    const selectedSize = selectedSizes[item._id];
    
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.merchandise._id === item._id && cartItem.size === selectedSize
    );

    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { merchandise: item, size: selectedSize, quantity: 1 }]);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    
    setCart(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.merchandise.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    onOrderNow?.(cart);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-600">Loading merchandise...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Admin Actions */}
      {isAdmin && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-900">Merchandise Catalog</h2>
          <Button onClick={onManageClick} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Manage Merchandise
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            Official SLIIT Choir Merchandise
          </CardTitle>
        </CardHeader>
        <CardContent>
          {merchandise.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No merchandise available at the moment
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchandise.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
                      }}
                    />
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {getCategoryLabel(item.category)}
                      </Badge>
                      <h3 className="text-blue-900 mb-2 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-600">Sizes:</span>
                        {item.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSizes({ ...selectedSizes, [item._id]: size })}
                            className={`px-2 py-1 text-xs rounded border transition-colors ${
                              selectedSizes[item._id] === size
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-900">
                          LKR {item.price.toLocaleString()}
                        </span>
                        <Badge
                          variant={item.status === 'available' ? 'default' : 'secondary'}
                          className={item.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => addToCart(item)}
                        disabled={item.status !== 'available'}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Shopping Cart Summary */}
          {cart.length > 0 && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>
              
              <div className="space-y-3 mb-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div className="flex-1">
                      <div className="font-medium text-blue-900">{item.merchandise.name}</div>
                      <div className="text-sm text-gray-600">
                        Size: {item.size} • LKR {item.merchandise.price.toLocaleString()} each
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(index, -1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(index, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="w-24 text-right font-bold text-blue-900">
                        LKR {(item.merchandise.price * item.quantity).toLocaleString()}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(index)}
                        className="h-8"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                <span className="text-lg font-bold text-blue-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-900">
                  LKR {getTotalAmount().toLocaleString()}
                </span>
              </div>

              <Button
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-lg py-6"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}

          {/* Order Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-900 font-medium mb-2">Order Information</div>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Orders will be processed within 2-3 weeks</li>
              <li>Pick up from the choir coordinator during practice</li>
              <li>Upload payment receipt after placing your order</li>
              <li>Contact choir@sliit.lk for bulk orders</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
