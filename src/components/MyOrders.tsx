import { useState, useEffect } from 'react';
import { Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { api } from '../utils/api';

interface Order {
  _id: string;
  memberId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
  items: Array<{
    merchandiseId: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  receipt: string;
  status: 'pending' | 'confirmed' | 'declined';
  declineReason?: string;
  verifiedBy?: {
    firstName: string;
    lastName: string;
  };
  verifiedAt?: string;
  createdAt: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await api.orders.getMyOrders();
      
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Declined</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-600">Loading your orders...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          My Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            You haven't placed any orders yet
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-blue-900">Order #{order._id.slice(-8)}</div>
                    <div className="text-sm text-gray-600">{formatDate(order.createdAt)}</div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} (Size: {item.size}) × {item.quantity}
                      </span>
                      <span className="font-medium">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-bold">Total:</span>
                  <span className="text-lg font-bold text-blue-900">
                    LKR {order.totalAmount.toLocaleString()}
                  </span>
                </div>

                {order.receipt && (
                  <div className="text-sm">
                    <span className="text-gray-600">Receipt: </span>
                    <a 
                      href={order.receipt} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Receipt
                    </a>
                  </div>
                )}

                {order.status === 'declined' && order.declineReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                    <span className="font-semibold text-red-800">Decline Reason: </span>
                    <span className="text-red-700">{order.declineReason}</span>
                  </div>
                )}

                {order.status === 'confirmed' && order.verifiedBy && (
                  <div className="text-sm text-green-700">
                    <span className="font-medium">Verified by: </span>
                    {order.verifiedBy.firstName} {order.verifiedBy.lastName}
                    {order.verifiedAt && ` on ${formatDate(order.verifiedAt)}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
