import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import MyOrders from './MyOrders';

const MyOrdersPage = () => {
  const navigateToMembers = (targetTab?: string) => {
    if (targetTab && typeof window !== 'undefined') {
      localStorage.setItem('membersTab', targetTab);
    }
    window.history.pushState({}, '', '/members');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-500 font-semibold">Merchandise Portal</p>
            <h1 className="text-3xl font-bold text-blue-900 mt-1">My Orders</h1>
            <p className="text-gray-600 mt-2">Track your purchases, see live statuses, and access receipts anytime.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigateToMembers()}>
              <ArrowLeft className="h-4 w-4" />
              Back to Member Portal
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => navigateToMembers('merchandise')}>
              <ShoppingBag className="h-4 w-4" />
              Browse Merchandise
            </Button>
          </div>
        </div>

        <MyOrders />
      </div>
    </div>
  );
};

export default MyOrdersPage;
