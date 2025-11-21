import { useState, useEffect } from 'react';
import { Package, Filter, CheckCircle, XCircle, Eye, Calendar, Download, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
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

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  declinedOrders: number;
  totalRevenue: number;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [statusFilter, categoryFilter, sizeFilter, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      if (categoryFilter !== 'all') {
        filters.category = categoryFilter;
      }

      if (sizeFilter !== 'all') {
        filters.size = sizeFilter;
      }

      if (startDate) {
        filters.startDate = startDate;
      }

      if (endDate) {
        filters.endDate = endDate;
      }
      
      const response = await api.orders.getAll(filters);
      
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.orders.getStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to confirm this order?')) return;

    try {
      setActionLoading(true);
      const response = await api.orders.confirm(orderId);
      
      if (response.success) {
        alert('Order confirmed successfully!');
        fetchOrders();
        fetchStats();
        setSelectedOrder(null);
      } else {
        alert('Failed to confirm order: ' + response.error);
      }
    } catch (error) {
      alert('Failed to confirm order');
      console.error('Confirm order error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    if (!declineReason.trim()) {
      alert('Please provide a reason for declining the order');
      return;
    }

    try {
      setActionLoading(true);
      const response = await api.orders.decline(orderId, declineReason.trim());
      
      if (response.success) {
        alert('Order declined');
        fetchOrders();
        fetchStats();
        setSelectedOrder(null);
        setDeclineReason('');
      } else {
        alert('Failed to decline order: ' + response.error);
      }
    } catch (error) {
      alert('Failed to decline order');
      console.error('Decline order error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    try {
      const filters: any = {};
      
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      if (sizeFilter !== 'all') filters.size = sizeFilter;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      
      const params = new URLSearchParams(filters);
      const token = api.getAuthToken();
      
      const response = await fetch(`http://localhost:5000/api/orders/export/excel?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        alert('Failed to export orders');
        return;
      }
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_export_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export orders');
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setSizeFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800">Declined</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Total Orders</div>
              <div className="text-2xl font-bold text-blue-900">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Confirmed</div>
              <div className="text-2xl font-bold text-green-600">{stats.confirmedOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Declined</div>
              <div className="text-2xl font-bold text-red-600">{stats.declinedOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xl font-bold text-blue-900">LKR {stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tshirt">T-Shirt</SelectItem>
                  <SelectItem value="hoodie">Hoodie</SelectItem>
                  <SelectItem value="band">Band</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="size-filter">Size</Label>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger id="size-filter">
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                  <SelectItem value="One Size">One Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={fetchOrders} variant="outline" className="flex-1">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button onClick={handleResetFilters} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
            <Button onClick={handleExportToExcel} className="flex-1 bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No orders found</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-blue-900">
                          {order.memberId.firstName} {order.memberId.lastName}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.memberId.studentId} • {order.memberId.email}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>

                  <div className="space-y-1 divide-y">
                    {order.items.map((item, index) => (
                      <div key={index} className="pt-1 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
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

                  {order.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button
                        onClick={() => handleConfirmOrder(order._id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        disabled={actionLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Order
                      </Button>
                      <Button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        disabled={actionLoading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline Order
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
            <CardHeader className="bg-white">
              <CardTitle className="text-gray-900">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white p-4 sm:p-6">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="text-sm space-y-1">
                  <div><strong>Name:</strong> {selectedOrder.memberId.firstName} {selectedOrder.memberId.lastName}</div>
                  <div><strong>Student ID:</strong> {selectedOrder.memberId.studentId}</div>
                  <div><strong>Email:</strong> {selectedOrder.memberId.email}</div>
                  <div><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</div>
                  <div><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <span>{item.name} (Size: {item.size}) × {item.quantity}</span>
                      <span className="font-medium">LKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total:</span>
                    <span>LKR {selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Payment Receipt</h3>
                <a 
                  href={selectedOrder.receipt} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {selectedOrder.receipt}
                </a>
              </div>

              {selectedOrder.status === 'declined' && selectedOrder.declineReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <h3 className="font-semibold text-red-800 mb-1">Decline Reason:</h3>
                  <p className="text-sm text-red-700">{selectedOrder.declineReason}</p>
                </div>
              )}

              {selectedOrder.status === 'pending' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="decline-reason">Decline Reason (Required if declining)</Label>
                    <Textarea
                      id="decline-reason"
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Enter reason for declining this order..."
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleConfirmOrder(selectedOrder._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={actionLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Order
                    </Button>
                    <Button
                      onClick={() => handleDeclineOrder(selectedOrder._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      disabled={actionLoading || !declineReason.trim()}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline Order
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedOrder(null);
                  setDeclineReason('');
                }}
                className="w-full"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
