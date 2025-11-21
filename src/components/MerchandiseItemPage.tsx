import { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingCart, Minus, Plus, BadgePercent, PackageCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import OrderCheckout from './OrderCheckout';
import { api } from '../utils/api';

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

interface Props {
  itemId: string;
}

const placeholderImage = 'https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const MerchandiseItemPage = ({ itemId }: Props) => {
  const [item, setItem] = useState<Merchandise | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await api.merchandise.getById(itemId);
        if (response.success && response.data) {
          setItem(response.data);
          if (response.data.sizes?.length) {
            setSelectedSize(response.data.sizes[0]);
          } else {
            setSelectedSize('');
          }
        }
      } catch (error) {
        console.error('Failed to load merchandise item', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const navigateBack = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('membersTab', 'merchandise');
    }
    window.history.pushState({}, '', '/members');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleOrderNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (!item) return;
    setShowCheckout(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <p className="text-gray-600">Loading merchandise...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-700">Item not found.</p>
          <Button onClick={navigateBack} className="bg-blue-600 hover:bg-blue-700">
            Go back to Merchandise
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="outline" className="gap-2" onClick={navigateBack}>
            <ArrowLeft className="h-4 w-4" />
            Back to Merchandise
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <img
              src={item.image || placeholderImage}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <div className="space-y-2">
              <Badge variant="secondary">{item.category.toUpperCase()}</Badge>
              <h1 className="text-3xl font-bold text-blue-900">{item.name}</h1>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-blue-900">
                LKR {item.price.toLocaleString()}
              </span>
              {item.status === 'available' ? (
                <Badge className="bg-green-100 text-green-800 gap-1">
                  <PackageCheck className="h-3 w-3" />
                  In stock
                </Badge>
              ) : (
                <Badge className="bg-gray-200 text-gray-600">{item.status}</Badge>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm uppercase text-gray-500 font-semibold">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {item.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm uppercase text-gray-500 font-semibold">Quantity</p>
              <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 px-4 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1"
                >
                  <Minus className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="p-1">
                  <Plus className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BadgePercent className="h-4 w-4 text-blue-600" />
                <span>All proceeds go directly to choir initiatives and events.</span>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg gap-2"
                disabled={item.status !== 'available'}
                onClick={handleOrderNow}
              >
                <ShoppingCart className="h-5 w-5" />
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <OrderCheckout
          cart={[
            {
              merchandise: { _id: item._id, name: item.name, price: item.price },
              size: selectedSize,
              quantity,
            },
          ]}
          onSuccess={() => {
            setShowCheckout(false);
            navigateBack();
          }}
          onCancel={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};

export default MerchandiseItemPage;
